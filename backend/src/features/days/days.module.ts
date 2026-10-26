import { Module } from '@nestjs/common';
import { DaysController } from './days.controller';
import { DraftEntryHandler } from './DraftEntry/DraftEntry.handler';
import { FinalizeDayHandler } from './FinalizeDay/FinalizeDay.handler';
import { GetDayHandler } from './GetDay/GetDay.handler';
import { ListDaysHandler } from './ListDays/ListDays.handler';
import { ReopenDayHandler } from './ReopenDay/ReopenDay.handler';
import { StartInterviewRoundHandler } from './StartInterviewRound/StartInterviewRound.handler';

@Module({
  controllers: [DaysController],
  providers: [
    GetDayHandler,
    ListDaysHandler,
    StartInterviewRoundHandler,
    DraftEntryHandler,
    FinalizeDayHandler,
    ReopenDayHandler,
  ],
})
export class DaysModule {}
