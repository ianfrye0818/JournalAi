import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { SearchEntriesHandler } from './SearchEntries.handler';
import { SearchEntriesQuery } from './SearchEntries.query';
import { SearchEntriesRequest } from './SearchEntries.request';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

describe(SearchEntriesHandler, () => {
  let handler: SearchEntriesHandler;
  const prisma = { entry: { findMany: jest.fn() } };

  const run = (request: SearchEntriesRequest = {}) =>
    handler.execute(new SearchEntriesQuery(USER, request));

  const findArgs = () =>
    (
      prisma.entry.findMany.mock.calls[0] as [
        { where: Record<string, unknown>; take: number },
      ]
    )[0];

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.entry.findMany.mockResolvedValue([]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchEntriesHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(SearchEntriesHandler);
  });

  it("matches title or body case-insensitively within the user's entries and range", async () => {
    prisma.entry.findMany.mockResolvedValue([
      {
        id: 'e-1',
        title: 'Coffee with Sam',
        body: 'We talked',
        aiDraft: 'We talked',
        tags: [],
        model: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        Session: { date: new Date('2026-10-26T00:00:00Z') },
      },
    ]);

    const result = await run({
      q: '  sam ',
      from: '2026-10-01',
      to: '2026-10-31',
      limit: 10,
    });

    expect(findArgs().where).toEqual({
      userId: USER,
      Session: {
        date: {
          gte: new Date('2026-10-01T00:00:00Z'),
          lte: new Date('2026-10-31T00:00:00Z'),
        },
      },
      OR: [
        { title: { contains: 'sam', mode: 'insensitive' } },
        { body: { contains: 'sam', mode: 'insensitive' } },
      ],
    });
    expect(findArgs().take).toBe(10);
    expect(result).toEqual([
      expect.objectContaining({ id: 'e-1', date: '2026-10-26' }),
    ]);
  });

  it('lists everything (up to the default limit) without q', async () => {
    await run({ q: '  ' });

    expect(findArgs().where.OR).toBeUndefined();
    expect(findArgs().take).toBe(50);
  });

  it('rejects from after to', async () => {
    await expect(run({ from: '2026-10-31', to: '2026-10-01' })).rejects.toThrow(
      BadRequestException,
    );
  });
});
