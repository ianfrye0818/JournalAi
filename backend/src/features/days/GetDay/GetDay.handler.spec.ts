import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { GetDayHandler } from './GetDay.handler';
import { GetDayQuery } from './GetDay.query';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const DAY = new Date('2026-10-26T00:00:00Z');

describe(GetDayHandler, () => {
  let handler: GetDayHandler;
  const prisma = { dailySession: { findUnique: jest.fn() } };

  const run = () =>
    handler.execute(new GetDayQuery(USER, { date: '2026-10-26' }));

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [GetDayHandler, { provide: PrismaService, useValue: prisma }],
    }).compile();

    handler = moduleRef.get(GetDayHandler);
  });

  it('returns the day with its live snippets, questions and entry, scoped to the user', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      date: DAY,
      status: 'interviewing',
      interviewRound: 1,
      finalizedAt: null,
      Snippets: [
        {
          id: 'snip-1',
          clientId: 'c-1',
          text: 'Coffee with Sam',
          source: 'text',
          capturedAt: new Date('2026-10-26T14:00:00Z'),
          clientUpdatedAt: new Date('2026-10-26T14:01:00Z'),
          updatedAt: new Date('2026-10-26T14:02:00Z'),
          deletedAt: null,
          Session: { date: DAY },
        },
      ],
      Questions: [
        {
          id: 'q-1',
          round: 1,
          order: 0,
          text: 'How was it?',
          options: ['Great'],
          rationale: null,
          answer: 'Great',
          skipped: false,
          answeredAt: new Date('2026-10-26T22:00:00Z'),
        },
      ],
      Entry: null,
    });

    const result = await run();

    const [args] = prisma.dailySession.findUnique.mock.calls[0] as [
      { where: unknown; include: { Snippets: { where: unknown } } },
    ];
    expect(args.where).toEqual({ userId_date: { userId: USER, date: DAY } });
    expect(args.include.Snippets.where).toEqual({ deletedAt: null });
    expect(result).toMatchObject({
      id: 's-1',
      date: '2026-10-26',
      status: 'interviewing',
      interviewRound: 1,
      entry: null,
    });
    expect(result.snippets).toEqual([
      expect.objectContaining({ id: 'snip-1', localDate: '2026-10-26' }),
    ]);
    expect(result.questions).toEqual([
      expect.objectContaining({ id: 'q-1', answer: 'Great' }),
    ]);
  });

  it('returns an empty open day when nothing has been synced for that date', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(null);

    await expect(run()).resolves.toEqual({
      id: null,
      date: '2026-10-26',
      status: 'open',
      interviewRound: 0,
      finalizedAt: null,
      snippets: [],
      questions: [],
      entry: null,
    });
  });
});
