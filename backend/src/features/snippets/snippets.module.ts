import { Module } from '@nestjs/common';
import { GetSnippetsSinceHandler } from './GetSnippetsSince/GetSnippetsSince.handler';
import { SnippetsController } from './snippets.controller';
import { SyncSnippetsHandler } from './SyncSnippets/SyncSnippets.handler';

@Module({
  controllers: [SnippetsController],
  providers: [SyncSnippetsHandler, GetSnippetsSinceHandler],
})
export class SnippetsModule {}
