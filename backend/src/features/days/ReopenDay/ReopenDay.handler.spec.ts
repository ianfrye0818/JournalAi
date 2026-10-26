import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { ReopenDayCommand } from './ReopenDay.command';
import { ReopenDayHandler } from './ReopenDay.handler';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

describe(ReopenDayHandler, () => {
  let handler: ReopenDayHandler;
  const prisma = {
    dailySession: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  const run = () =>
    handler.execute(new ReopenDayCommand(USER, { date: '2026-10-26' }));

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.dailySession.updateMany.mockResolvedValue({ count: 1 });
    prisma.dailySession.findUniqueOrThrow.mockResolvedValue({
      id: 's-1',
      date: new Date('2026-10-26T00:00:00Z'),
      status: 'drafted',
      interviewRound: 1,
      finalizedAt: null,
      Snippets: [],
      Questions: [],
      Entry: null,
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ReopenDayHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(ReopenDayHandler);
  });

  it('moves a finalized day back to drafted and clears finalizedAt', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'finalized',
    });

    const result = await run();

    expect(prisma.dailySession.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_date: { userId: USER, date: new Date('2026-10-26T00:00:00Z') },
        },
      }),
    );
    expect(prisma.dailySession.updateMany).toHaveBeenCalledWith({
      where: { id: 's-1', userId: USER, status: 'finalized' },
      data: { status: 'drafted', finalizedAt: null },
    });
    expect(result).toMatchObject({ status: 'drafted', finalizedAt: null });
  });

  it('is a no-op on a day that is already drafted', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'drafted',
    });

    await expect(run()).resolves.toMatchObject({ status: 'drafted' });
    expect(prisma.dailySession.updateMany).not.toHaveBeenCalled();
  });

  it.each(['open', 'interviewing'])('rejects a %s day', async (status) => {
    prisma.dailySession.findUnique.mockResolvedValue({ id: 's-1', status });
    prisma.dailySession.updateMany.mockResolvedValue({ count: 0 });

    await expect(run()).rejects.toThrow(ConflictException);
  });

  it("404s on a day the user doesn't have", async () => {
    prisma.dailySession.findUnique.mockResolvedValue(null);

    await expect(run()).rejects.toThrow(NotFoundException);
  });
});
