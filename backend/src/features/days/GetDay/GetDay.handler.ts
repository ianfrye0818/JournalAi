import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { EntryResponse } from '@src/features/entries/shared/entry.response';
import { QuestionResponse } from '@src/features/questions/shared/question.response';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { SnippetResponse } from '@src/features/snippets/shared/snippet.response';
import { PrismaService } from '@src/services/prisma.service';
import { GetDayQuery } from './GetDay.query';
import { GetDayResponse } from './GetDay.response';

/**
 * Everything for one day. A day with no session yet (nothing synced) comes back empty rather than
 * 404, so the app can render any date the same way.
 */
@QueryHandler(GetDayQuery)
export class GetDayHandler implements IQueryHandler<
  GetDayQuery,
  GetDayResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, request }: GetDayQuery): Promise<GetDayResponse> {
    const session = await this.prisma.dailySession.findUnique({
      where: { userId_date: { userId, date: localDateToDb(request.date) } },
      include: {
        Snippets: {
          where: { deletedAt: null },
          include: { Session: { select: { date: true } } },
          orderBy: { capturedAt: 'asc' },
        },
        Questions: { orderBy: [{ round: 'asc' }, { order: 'asc' }] },
        Entry: true,
      },
    });

    if (!session) {
      return {
        id: null,
        date: request.date,
        status: DayStatus.open,
        interviewRound: 0,
        finalizedAt: null,
        snippets: [],
        questions: [],
        entry: null,
      };
    }

    return {
      id: session.id,
      date: request.date,
      status: session.status,
      interviewRound: session.interviewRound,
      finalizedAt: session.finalizedAt,
      snippets: session.Snippets.map((s) => SnippetResponse.from(s)),
      questions: session.Questions.map((q) => QuestionResponse.from(q)),
      entry: session.Entry ? EntryResponse.from(session.Entry) : null,
    };
  }
}
