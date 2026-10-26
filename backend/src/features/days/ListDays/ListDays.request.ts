import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, Matches } from 'class-validator';
import { LOCAL_DATE_PATTERN } from '@src/features/snippets/shared/local-date';

export class ListDaysRequest {
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
}
