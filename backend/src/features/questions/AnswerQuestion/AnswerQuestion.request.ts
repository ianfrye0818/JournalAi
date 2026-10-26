import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Send exactly one of `answer` or `skipped: true`. Either replaces any earlier reply. */
export class AnswerQuestionRequest {
  @ApiProperty({ required: false, maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  answer?: string;

  @ApiProperty({ required: false, enum: [true] })
  @IsOptional()
  @Equals(true)
  skipped?: true;
}
