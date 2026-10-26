import { Module } from '@nestjs/common';
import { SnippetsController } from './snippets.controller';

@Module({
  controllers: [SnippetsController],
  providers: [],
})
export class SnippetsModule {}
