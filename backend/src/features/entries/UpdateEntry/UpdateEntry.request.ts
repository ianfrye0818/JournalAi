import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MAX_TAGS } from '../shared/tags';

/** Send any of the fields; omitted ones are left as they are. */
export class UpdateEntryRequest {
  @ApiProperty({
    required: false,
    maxLength: 200,
    description: 'An empty title clears it',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ required: false, maxLength: 100_000 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100_000)
  body?: string;

  @ApiProperty({ required: false, type: [String], maxItems: MAX_TAGS })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_TAGS)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[];
}
