import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';

@Module({
  controllers: [QuestionsController],
  providers: [],
})
export class QuestionsModule {}
