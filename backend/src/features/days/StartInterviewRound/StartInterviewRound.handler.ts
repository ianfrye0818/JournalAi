import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { QuestionResponse } from '@src/features/questions/shared/question.response';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { AnthropicService } from '@src/services/anthropic.service';
import { PrismaService } from '@src/services/prisma.service';
import {
  buildInterviewMessage,
  INTERVIEW_SYSTEM_PROMPT,
  interviewOutputSchema,
} from '../prompts/interview.prompt';
import { StartInterviewRoundCommand } from './StartInterviewRound.command';
import { StartInterviewRoundResponse } from './StartInterviewRound.response';

export const MAX_INTERVIEW_ROUNDS = 2;

const INTERVIEWABLE: DayStatus[] = [DayStatus.open, DayStatus.interviewing];

/**
 * Asks the AI for the next round of follow-up questions about the day's snippets and stores them.
 * Past the last round it answers `readyToDraft` without calling the AI.
 */
@CommandHandler(StartInterviewRoundCommand)
export class StartInterviewRoundHandler implements ICommandHandler<
  StartInterviewRoundCommand,
  StartInterviewRoundResponse
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anthropic: AnthropicService,
  ) {}

  async execute({
    userId,
    timezone,
    request,
  }: StartInterviewRoundCommand): Promise<StartInterviewRoundResponse> {
    const session = await this.prisma.dailySession.findUnique({
      where: { userId_date: { userId, date: localDateToDb(request.date) } },
      include: {
        Snippets: {
          where: { deletedAt: null },
          orderBy: { capturedAt: 'asc' },
        },
        Questions: { orderBy: [{ round: 'asc' }, { order: 'asc' }] },
      },
    });
    if (!session || session.Snippets.length === 0) {
      throw new UnprocessableEntityException(
        'Capture at least one snippet before starting the interview',
      );
    }
    if (!INTERVIEWABLE.includes(session.status)) {
      throw new ConflictException(`This day is already ${session.status}`);
    }
    if (session.interviewRound >= MAX_INTERVIEW_ROUNDS) {
      return {
        round: session.interviewRound,
        questions: [],
        readyToDraft: true,
      };
    }

    const round = session.interviewRound + 1;
    const output = await this.anthropic.generateStructured({
      label: 'interview',
      system: INTERVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildInterviewMessage({
            date: request.date,
            round,
            maxRounds: MAX_INTERVIEW_ROUNDS,
            timezone,
            snippets: session.Snippets,
            priorQuestions: session.Questions,
          }),
        },
      ],
      schema: interviewOutputSchema,
    });

    const questions = await this.prisma.$transaction(async (tx) => {
      // Conditional on the round we read, so two concurrent requests can't both claim it.
      const { count } = await tx.dailySession.updateMany({
        where: {
          id: session.id,
          userId,
          interviewRound: session.interviewRound,
          status: { in: INTERVIEWABLE },
        },
        data: { interviewRound: round, status: DayStatus.interviewing },
      });
      if (count === 0) {
        throw new ConflictException('The interview changed; reload the day');
      }
      return tx.question.createManyAndReturn({
        data: output.questions.map((q, order) => ({
          sessionId: session.id,
          userId,
          round,
          order,
          text: q.text,
          options: q.options,
          rationale: q.rationale || null,
        })),
      });
    });

    return {
      round,
      questions: questions
        .sort((a, b) => a.order - b.order)
        .map((q) => QuestionResponse.from(q)),
      readyToDraft: questions.length === 0 || round >= MAX_INTERVIEW_ROUNDS,
    };
  }
}
