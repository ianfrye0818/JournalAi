import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { LOCAL_DATE_PATTERN } from '@src/features/snippets/shared/local-date';

export const MAX_SEARCH_LIMIT = 200;

export class SearchEntriesRequest {
  @ApiProperty({
    required: false,
    maxLength: 200,
    description: 'Case-insensitive match on title or body',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  @ApiProperty({
    required: false,
    example: '2026-10-01',
    description: 'Inclusive',
  })
  @IsOptional()
  @Matches(LOCAL_DATE_PATTERN, { message: 'from must be YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  from?: string;

  @ApiProperty({
    required: false,
    example: '2026-10-31',
    description: 'Inclusive',
  })
  @IsOptional()
  @Matches(LOCAL_DATE_PATTERN, { message: 'to must be YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  to?: string;

  @ApiProperty({ required: false, default: 50, maximum: MAX_SEARCH_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_SEARCH_LIMIT)
  limit?: number;
}
