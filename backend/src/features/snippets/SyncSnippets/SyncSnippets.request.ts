import { ApiProperty } from '@nestjs/swagger';
import { SnippetSource } from '@prisma/generated';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { LOCAL_DATE_PATTERN } from '../shared/local-date';

export const MAX_SYNC_BATCH = 200;

export class SyncSnippetItem {
  @ApiProperty({ description: 'Generated on the device; unique per user' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  clientId!: string;

  @ApiProperty({ maxLength: 10_000 })
  @IsString()
  @MaxLength(10_000)
  text!: string;

  @ApiProperty({ enum: SnippetSource })
  @IsEnum(SnippetSource)
  source!: SnippetSource;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  capturedAt!: Date;

  @ApiProperty({ example: '2026-10-26', description: 'Computed on the device' })
  @Matches(LOCAL_DATE_PATTERN, { message: 'localDate must be YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  localDate!: string;

  @ApiProperty({ description: 'Device clock of the last edit' })
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAt?: Date | null;
}

export class SyncSnippetsRequest {
  @ApiProperty({ type: [SyncSnippetItem], maxItems: MAX_SYNC_BATCH })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_SYNC_BATCH)
  @ValidateNested({ each: true })
  @Type(() => SyncSnippetItem)
  snippets!: SyncSnippetItem[];
}
