import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponse } from '@src/features/questions/shared/question.response';

export class StartInterviewRoundResponse {
  @ApiProperty({ description: 'The round these questions belong to' })
  round!: number;

  @ApiProperty({ type: [QuestionResponse] })
  questions!: QuestionResponse[];

  @ApiProperty({
    description:
      'True when there is nothing more to ask: no questions came back, or the last round was reached',
  })
  readyToDraft!: boolean;
}
