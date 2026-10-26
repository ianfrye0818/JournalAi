import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';

@Module({
  controllers: [EntriesController],
  providers: [],
})
export class EntriesModule {}
