import { Module } from '@nestjs/common';
import { DaysController } from './days.controller';
import { GetDayHandler } from './GetDay/GetDay.handler';
import { StartInterviewRoundHandler } from './StartInterviewRound/StartInterviewRound.handler';

@Module({
  controllers: [DaysController],
  providers: [GetDayHandler, StartInterviewRoundHandler],
})
export class DaysModule {}
