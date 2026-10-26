import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { PrismaService } from '@src/services/prisma.service';
import { DAY_INCLUDE, toDayResponse } from '../shared/day-view';
import { FinalizeDayCommand } from './FinalizeDay.command';
import { FinalizeDayResponse } from './FinalizeDay.response';

/** Locks the day once it has an entry. Finalizing an already-finalized day is a no-op. */
@CommandHandler(FinalizeDayCommand)
export class FinalizeDayHandler implements ICommandHandler<
  FinalizeDayCommand,
  FinalizeDayResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: FinalizeDayCommand): Promise<FinalizeDayResponse> {
    const where = {
      userId_date: { userId, date: localDateToDb(request.date) },
    };
    const session = await this.prisma.dailySession.findUnique({
      where,
      select: { id: true, status: true, Entry: { select: { id: true } } },
    });
    if (!session) throw new NotFoundException('Day not found');
    if (!session.Entry) {
      throw new UnprocessableEntityException(
        'Draft the entry before finalizing the day',
      );
    }

    if (session.status !== DayStatus.finalized) {
      const { count } = await this.prisma.dailySession.updateMany({
        where: { id: session.id, userId, status: session.status },
        data: { status: DayStatus.finalized, finalizedAt: new Date() },
      });
      if (count === 0) {
        throw new ConflictException('The day changed; reload it');
      }
    }

    const day = await this.prisma.dailySession.findUniqueOrThrow({
      where,
      include: DAY_INCLUDE,
    });
    return toDayResponse(day, request.date);
  }
}
