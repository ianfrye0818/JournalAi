import { ApiProperty } from '@nestjs/swagger';
import type { Question } from '@prisma/generated';

export class QuestionResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Interview round this question was asked in' })
  round!: number;

  @ApiProperty({ description: 'Position within its round' })
  order!: number;

  @ApiProperty()
  text!: string;

  @ApiProperty({ type: [String], description: 'Suggested answers to tap' })
  options!: string[];

  @ApiProperty({ type: String, nullable: true })
  rationale!: string | null;

  @ApiProperty({ type: String, nullable: true })
  answer!: string | null;

  @ApiProperty()
  skipped!: boolean;

  @ApiProperty({ type: Date, nullable: true })
  answeredAt!: Date | null;

  static from(question: Question): QuestionResponse {
    return {
      id: question.id,
      round: question.round,
      order: question.order,
      text: question.text,
      options: question.options,
      rationale: question.rationale,
      answer: question.answer,
      skipped: question.skipped,
      answeredAt: question.answeredAt,
    };
  }
}
