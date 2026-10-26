import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export const MAX_PULL_LIMIT = 500;

export class GetSnippetsSinceRequest {
  @ApiProperty({
    required: false,
    description:
      '`serverUpdatedAt` of the last snippet already pulled. Omit for a full restore.',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  since?: Date;

  @ApiProperty({
    required: false,
    format: 'uuid',
    description:
      '`id` of the last snippet already pulled; breaks ties on `since`',
  })
  @IsOptional()
  @IsUUID()
  afterId?: string;

  @ApiProperty({ required: false, maximum: MAX_PULL_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PULL_LIMIT)
  limit?: number;
}
