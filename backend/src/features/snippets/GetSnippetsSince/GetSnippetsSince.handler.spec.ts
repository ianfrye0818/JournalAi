import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { GetSnippetsSinceHandler } from './GetSnippetsSince.handler';
import { GetSnippetsSinceQuery } from './GetSnippetsSince.query';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

const row = (id: string, updatedAt: string) => ({
  id,
  clientId: `c-${id}`,
  text: 'Coffee with Sam',
  source: 'text',
  capturedAt: new Date('2026-10-26T14:00:00Z'),
  clientUpdatedAt: new Date('2026-10-26T14:05:00Z'),
  updatedAt: new Date(updatedAt),
  deletedAt: null,
  sessionId: 's-1',
  userId: USER,
  Session: { date: new Date('2026-10-26T00:00:00Z') },
});

describe(GetSnippetsSinceHandler, () => {
  let handler: GetSnippetsSinceHandler;
  const prisma = { snippet: { findMany: jest.fn() } };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetSnippetsSinceHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(GetSnippetsSinceHandler);
  });

  it('returns every snippet for the user when there is no cursor', async () => {
    prisma.snippet.findMany.mockResolvedValue([
      row('a', '2026-10-26T14:06:00Z'),
    ]);

    const result = await handler.execute(new GetSnippetsSinceQuery(USER, {}));

    expect(prisma.snippet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: USER },
        orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
        take: 501,
      }),
    );
    expect(result).toEqual({
      snippets: [
        {
          id: 'a',
          clientId: 'c-a',
          text: 'Coffee with Sam',
          source: 'text',
          capturedAt: new Date('2026-10-26T14:00:00Z'),
          localDate: '2026-10-26',
          updatedAt: new Date('2026-10-26T14:05:00Z'),
          deletedAt: null,
          serverUpdatedAt: new Date('2026-10-26T14:06:00Z'),
        },
      ],
      hasMore: false,
    });
  });

  it('filters by the (since, afterId) cursor, scoped to the user', async () => {
    prisma.snippet.findMany.mockResolvedValue([]);
    const since = new Date('2026-10-26T14:06:00Z');

    await handler.execute(
      new GetSnippetsSinceQuery(USER, { since, afterId: 'a' }),
    );

    expect(prisma.snippet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: USER,
          OR: [
            { updatedAt: { gt: since } },
            { updatedAt: since, id: { gt: 'a' } },
          ],
        },
      }),
    );
  });

  it('uses a strict since filter when no afterId is given', async () => {
    prisma.snippet.findMany.mockResolvedValue([]);
    const since = new Date('2026-10-26T14:06:00Z');

    await handler.execute(new GetSnippetsSinceQuery(USER, { since }));

    expect(prisma.snippet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: USER, OR: [{ updatedAt: { gt: since } }] },
      }),
    );
  });

  it('reports hasMore and trims the extra row when a page is full', async () => {
    prisma.snippet.findMany.mockResolvedValue([
      row('a', '2026-10-26T14:06:00Z'),
      row('b', '2026-10-26T14:06:00Z'),
      row('c', '2026-10-26T14:07:00Z'),
    ]);

    const result = await handler.execute(
      new GetSnippetsSinceQuery(USER, { limit: 2 }),
    );

    expect(prisma.snippet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3 }),
    );
    expect(result.snippets.map((s) => s.id)).toEqual(['a', 'b']);
    expect(result.hasMore).toBe(true);
  });
});
