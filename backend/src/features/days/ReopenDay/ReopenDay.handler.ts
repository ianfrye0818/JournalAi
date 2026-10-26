import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { PrismaService } from '@src/services/prisma.service';
import { DAY_INCLUDE, toDayResponse } from '../shared/day-view';
import { ReopenDayCommand } from './ReopenDay.command';
import { ReopenDayResponse } from './ReopenDay.response';

/** Unlocks a finalized day back to `drafted` so the entry can be edited or redrafted. */
@CommandHandler(ReopenDayCommand)
export class ReopenDayHandler implements ICommandHandler<
  ReopenDayCommand,
  ReopenDayResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: ReopenDayCommand): Promise<ReopenDayResponse> {
    const where = {
      userId_date: { userId, date: localDateToDb(request.date) },
    };
    const session = await this.prisma.dailySession.findUnique({
      where,
      select: { id: true, status: true },
    });
    if (!session) throw new NotFoundException('Day not found');

    if (session.status !== DayStatus.drafted) {
      const { count } = await this.prisma.dailySession.updateMany({
        where: { id: session.id, userId, status: DayStatus.finalized },
        data: { status: DayStatus.drafted, finalizedAt: null },
      });
      if (count === 0) {
        throw new ConflictException('Only a finalized day can be reopened');
      }
    }

    const day = await this.prisma.dailySession.findUniqueOrThrow({
      where,
      include: DAY_INCLUDE,
    });
    return toDayResponse(day, request.date);
  }
}
