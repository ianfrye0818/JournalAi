import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { PrismaService } from '@src/services/prisma.service';
import { DAY_INCLUDE, toDayResponse } from '../shared/day-view';
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
      include: DAY_INCLUDE,
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

    return toDayResponse(session, request.date);
  }
}
