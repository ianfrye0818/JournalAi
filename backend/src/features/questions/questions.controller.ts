import { Body, Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '@src/decorators/current-user.decorator';
import { AnswerQuestionCommand } from './AnswerQuestion/AnswerQuestion.command';
import { AnswerQuestionRequest } from './AnswerQuestion/AnswerQuestion.request';
import { AnswerQuestionResponse } from './AnswerQuestion/AnswerQuestion.response';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @ApiOkResponse({ type: AnswerQuestionResponse })
  answer(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AnswerQuestionRequest,
  ): Promise<AnswerQuestionResponse> {
    return this.commandBus.execute(
      new AnswerQuestionCommand(user.id, id, body),
    );
  }
}
