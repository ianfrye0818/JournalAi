import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  dbToLocalDate,
  localDateToDb,
} from '@src/features/snippets/shared/local-date';
import { PrismaService } from '@src/services/prisma.service';
import { ListDaysQuery } from './ListDays.query';
import { ListDaysResponse } from './ListDays.response';

/**
 * Newest first. Days whose snippets were all deleted and that never got an entry are left out, so
 * the list only shows days with something in them.
 */
@QueryHandler(ListDaysQuery)
export class ListDaysHandler implements IQueryHandler<
  ListDaysQuery,
  ListDaysResponse[]
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: ListDaysQuery): Promise<ListDaysResponse[]> {
    const { from, to } = request;
    // YYYY-MM-DD strings compare in calendar order.
    if (from && to && from > to) {
      throw new BadRequestException('from must not be after to');
    }

    const sessions = await this.prisma.dailySession.findMany({
      where: {
        userId,
        date: {
          gte: from ? localDateToDb(from) : undefined,
          lte: to ? localDateToDb(to) : undefined,
        },
        OR: [
          { Snippets: { some: { deletedAt: null } } },
          { Entry: { isNot: null } },
        ],
      },
      select: {
        date: true,
        status: true,
        Entry: { select: { title: true } },
        _count: { select: { Snippets: { where: { deletedAt: null } } } },
      },
      orderBy: { date: 'desc' },
    });

    return sessions.map((s) => ({
      date: dbToLocalDate(s.date),
      status: s.status,
      snippetCount: s._count.Snippets,
      entryTitle: s.Entry?.title ?? null,
    }));
  }
}
