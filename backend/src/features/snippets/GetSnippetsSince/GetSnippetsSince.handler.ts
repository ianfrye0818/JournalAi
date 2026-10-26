import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { SnippetResponse } from '../shared/snippet.response';
import { GetSnippetsSinceQuery } from './GetSnippetsSince.query';
import { MAX_PULL_LIMIT } from './GetSnippetsSince.request';
import { GetSnippetsSinceResponse } from './GetSnippetsSince.response';

/**
 * Change feed for the device: everything the user's snippets did after the cursor, by server
 * clock. The cursor is `(since, afterId)` so a page boundary inside a run of equal timestamps
 * neither skips nor repeats rows.
 */
@QueryHandler(GetSnippetsSinceQuery)
export class GetSnippetsSinceHandler implements IQueryHandler<
  GetSnippetsSinceQuery,
  GetSnippetsSinceResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: GetSnippetsSinceQuery): Promise<GetSnippetsSinceResponse> {
    const { since, afterId, limit = MAX_PULL_LIMIT } = request;

    const where: Prisma.SnippetWhereInput = { userId };
    if (since) {
      where.OR = [
        { updatedAt: { gt: since } },
        ...(afterId ? [{ updatedAt: since, id: { gt: afterId } }] : []),
      ];
    }

    const rows = await this.prisma.snippet.findMany({
      where,
      include: { Session: { select: { date: true } } },
      orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    return {
      snippets: rows.slice(0, limit).map((row) => SnippetResponse.from(row)),
      hasMore,
    };
  }
}
