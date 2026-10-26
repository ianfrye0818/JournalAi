import { Module } from '@nestjs/common';
import { TranscribeController } from './transcribe.controller';

@Module({
  controllers: [TranscribeController],
  providers: [],
})
export class TranscribeModule {}
