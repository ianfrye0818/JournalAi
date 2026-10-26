import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { UpdateEntryHandler } from './UpdateEntry/UpdateEntry.handler';
import { SearchEntriesHandler } from './SearchEntries/SearchEntries.handler';

@Module({
  controllers: [EntriesController],
  providers: [UpdateEntryHandler, SearchEntriesHandler],
})
export class EntriesModule {}
