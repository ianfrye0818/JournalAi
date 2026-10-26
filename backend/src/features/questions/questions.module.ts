import { Module } from '@nestjs/common';
import { AnswerQuestionHandler } from './AnswerQuestion/AnswerQuestion.handler';
import { QuestionsController } from './questions.controller';

@Module({
  controllers: [QuestionsController],
  providers: [AnswerQuestionHandler],
})
export class QuestionsModule {}
