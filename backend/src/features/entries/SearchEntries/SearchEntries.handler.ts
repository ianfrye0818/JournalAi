import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { PrismaService } from '@src/services/prisma.service';
import { SearchEntriesQuery } from './SearchEntries.query';
import { SearchEntriesResponse } from './SearchEntries.response';

export const DEFAULT_SEARCH_LIMIT = 50;

/** Substring search (ILIKE) over title and body, newest day first. Full-text search is backlog. */
@QueryHandler(SearchEntriesQuery)
export class SearchEntriesHandler implements IQueryHandler<
  SearchEntriesQuery,
  SearchEntriesResponse[]
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: SearchEntriesQuery): Promise<SearchEntriesResponse[]> {
    const { from, to } = request;
    if (from && to && from > to) {
      throw new BadRequestException('from must not be after to');
    }
    const q = request.q?.trim();

    const entries = await this.prisma.entry.findMany({
      where: {
        userId,
        Session: {
          date: {
            gte: from ? localDateToDb(from) : undefined,
            lte: to ? localDateToDb(to) : undefined,
          },
        },
        OR: q
          ? [
              { title: { contains: q, mode: 'insensitive' } },
              { body: { contains: q, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: { Session: { select: { date: true } } },
      orderBy: { Session: { date: 'desc' } },
      take: request.limit ?? DEFAULT_SEARCH_LIMIT,
    });

    return entries.map((e) => SearchEntriesResponse.fromWithDate(e));
  }
}
