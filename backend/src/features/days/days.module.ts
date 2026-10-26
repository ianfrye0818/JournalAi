import { Module } from '@nestjs/common';
import { DaysController } from './days.controller';

@Module({
  controllers: [DaysController],
  providers: [],
})
export class DaysModule {}
