import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { ListDaysHandler } from './ListDays.handler';
import { ListDaysQuery } from './ListDays.query';
import { ListDaysRequest } from './ListDays.request';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

describe(ListDaysHandler, () => {
  let handler: ListDaysHandler;
  const prisma = { dailySession: { findMany: jest.fn() } };

  const run = (request: ListDaysRequest = {}) =>
    handler.execute(new ListDaysQuery(USER, request));

  const findArgs = () =>
    (
      prisma.dailySession.findMany.mock.calls[0] as [
        { where: { userId: string; date: unknown } },
      ]
    )[0];

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.dailySession.findMany.mockResolvedValue([]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListDaysHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(ListDaysHandler);
  });

  it("summarizes the user's days in the range, newest first", async () => {
    prisma.dailySession.findMany.mockResolvedValue([
      {
        date: new Date('2026-10-26T00:00:00Z'),
        status: 'drafted',
        Entry: { title: 'Coffee with Sam' },
        _count: { Snippets: 3 },
      },
      {
        date: new Date('2026-10-25T00:00:00Z'),
        status: 'open',
        Entry: null,
        _count: { Snippets: 1 },
      },
    ]);

    const result = await run({ from: '2026-10-01', to: '2026-10-31' });

    expect(findArgs().where).toMatchObject({
      userId: USER,
      date: {
        gte: new Date('2026-10-01T00:00:00Z'),
        lte: new Date('2026-10-31T00:00:00Z'),
      },
    });
    expect(result).toEqual([
      {
        date: '2026-10-26',
        status: 'drafted',
        snippetCount: 3,
        entryTitle: 'Coffee with Sam',
      },
      { date: '2026-10-25', status: 'open', snippetCount: 1, entryTitle: null },
    ]);
  });

  it('leaves the range open when from/to are omitted', async () => {
    await run();

    expect(findArgs().where).toMatchObject({
      userId: USER,
      date: { gte: undefined, lte: undefined },
    });
  });

  it('rejects from after to', async () => {
    await expect(run({ from: '2026-10-31', to: '2026-10-01' })).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.dailySession.findMany).not.toHaveBeenCalled();
  });
});
