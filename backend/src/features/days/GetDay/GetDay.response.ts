import { ApiProperty } from '@nestjs/swagger';
import { DayStatus } from '@prisma/generated';
import { EntryResponse } from '@src/features/entries/shared/entry.response';
import { QuestionResponse } from '@src/features/questions/shared/question.response';
import { SnippetResponse } from '@src/features/snippets/shared/snippet.response';

export class GetDayResponse {
  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'Null until the first snippet for this day is synced',
  })
  id!: string | null;

  @ApiProperty({ example: '2026-10-26' })
  date!: string;

  @ApiProperty({ enum: DayStatus })
  status!: DayStatus;

  @ApiProperty({ description: 'Interview rounds completed so far' })
  interviewRound!: number;

  @ApiProperty({ type: Date, nullable: true })
  finalizedAt!: Date | null;

  @ApiProperty({
    type: [SnippetResponse],
    description: 'Excludes deleted snippets',
  })
  snippets!: SnippetResponse[];

  @ApiProperty({ type: [QuestionResponse] })
  questions!: QuestionResponse[];

  @ApiProperty({ type: EntryResponse, nullable: true })
  entry!: EntryResponse | null;
}
