import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class DraftEntryRequest {
  @ApiProperty({
    required: false,
    maxLength: 2000,
    description:
      'How the new draft should differ, e.g. "shorter, less formal". The current entry is sent along with it.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  feedback?: string;
}
