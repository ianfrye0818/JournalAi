import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { DayStatus } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { FinalizeDayCommand } from './FinalizeDay.command';
import { FinalizeDayHandler } from './FinalizeDay.handler';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const WHERE = {
  userId_date: { userId: USER, date: new Date('2026-10-26T00:00:00Z') },
};

const day = (status: DayStatus, finalizedAt: Date | null) => ({
  id: 's-1',
  date: new Date('2026-10-26T00:00:00Z'),
  status,
  interviewRound: 1,
  finalizedAt,
  Snippets: [],
  Questions: [],
  Entry: null,
});

describe(FinalizeDayHandler, () => {
  let handler: FinalizeDayHandler;
  const prisma = {
    dailySession: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  const run = () =>
    handler.execute(new FinalizeDayCommand(USER, { date: '2026-10-26' }));

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.dailySession.updateMany.mockResolvedValue({ count: 1 });
    prisma.dailySession.findUniqueOrThrow.mockResolvedValue(
      day('finalized', new Date()),
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        FinalizeDayHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(FinalizeDayHandler);
  });

  it('finalizes a drafted day and stamps finalizedAt', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'drafted',
      Entry: { id: 'e-1' },
    });

    const result = await run();

    expect(prisma.dailySession.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: WHERE }),
    );
    const [{ where, data }] = prisma.dailySession.updateMany.mock.calls[0] as [
      { where: unknown; data: { status: string; finalizedAt: unknown } },
    ];
    expect(where).toEqual({ id: 's-1', userId: USER, status: 'drafted' });
    expect(data.status).toBe('finalized');
    expect(data.finalizedAt).toBeInstanceOf(Date);
    expect(result).toMatchObject({ date: '2026-10-26', status: 'finalized' });
  });

  it('is a no-op on an already finalized day', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'finalized',
      Entry: { id: 'e-1' },
    });

    await expect(run()).resolves.toMatchObject({ status: 'finalized' });
    expect(prisma.dailySession.updateMany).not.toHaveBeenCalled();
  });

  it('requires an entry', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'interviewing',
      Entry: null,
    });

    await expect(run()).rejects.toThrow(UnprocessableEntityException);
    expect(prisma.dailySession.updateMany).not.toHaveBeenCalled();
  });

  it("404s on a day the user doesn't have", async () => {
    prisma.dailySession.findUnique.mockResolvedValue(null);

    await expect(run()).rejects.toThrow(NotFoundException);
  });

  it('rejects when the status changed underneath it', async () => {
    prisma.dailySession.findUnique.mockResolvedValue({
      id: 's-1',
      status: 'drafted',
      Entry: { id: 'e-1' },
    });
    prisma.dailySession.updateMany.mockResolvedValue({ count: 0 });

    await expect(run()).rejects.toThrow(ConflictException);
  });
});
