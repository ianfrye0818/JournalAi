import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { QuestionResponse } from '../shared/question.response';
import { AnswerQuestionCommand } from './AnswerQuestion.command';
import { AnswerQuestionResponse } from './AnswerQuestion.response';

@CommandHandler(AnswerQuestionCommand)
export class AnswerQuestionHandler implements ICommandHandler<
  AnswerQuestionCommand,
  AnswerQuestionResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    questionId,
    request,
  }: AnswerQuestionCommand): Promise<AnswerQuestionResponse> {
    const answer = request.answer?.trim();
    if (!answer === !request.skipped) {
      throw new BadRequestException(
        'Send either a non-empty answer or skipped: true',
      );
    }

    const question = await this.prisma.question.findFirst({
      where: { id: questionId, userId },
      select: { id: true, Session: { select: { status: true } } },
    });
    if (!question) throw new NotFoundException('Question not found');
    if (question.Session.status === DayStatus.finalized) {
      throw new ConflictException('This day is already finalized');
    }

    const updated = await this.prisma.question.update({
      where: { id: question.id },
      data: answer
        ? { answer, skipped: false, answeredAt: new Date() }
        : { answer: null, skipped: true, answeredAt: new Date() },
    });
    return QuestionResponse.from(updated);
  }
}
