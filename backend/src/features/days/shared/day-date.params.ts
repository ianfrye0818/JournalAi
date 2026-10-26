import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, Matches } from 'class-validator';
import { LOCAL_DATE_PATTERN } from '@src/features/snippets/shared/local-date';

/** `:date` route param: the device-computed local calendar day. */
export class DayDateParams {
  @ApiProperty({ example: '2026-10-26' })
  @Matches(LOCAL_DATE_PATTERN, { message: 'date must be YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  date!: string;
}
