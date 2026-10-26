import { Command } from '@nestjs/cqrs';
import { AnswerQuestionRequest } from './AnswerQuestion.request';
import { AnswerQuestionResponse } from './AnswerQuestion.response';

export class AnswerQuestionCommand extends Command<AnswerQuestionResponse> {
  constructor(
    public readonly userId: string,
    public readonly questionId: string,
    public readonly request: AnswerQuestionRequest,
  ) {
    super();
  }
}
