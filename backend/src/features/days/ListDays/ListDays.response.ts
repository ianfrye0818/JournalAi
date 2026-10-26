import { ApiProperty } from '@nestjs/swagger';
import { DayStatus } from '@prisma/generated';

export class ListDaysResponse {
  @ApiProperty({ example: '2026-10-26' })
  date!: string;

  @ApiProperty({ enum: DayStatus })
  status!: DayStatus;

  @ApiProperty({ description: 'Live (not deleted) snippets' })
  snippetCount!: number;

  @ApiProperty({ type: String, nullable: true })
  entryTitle!: string | null;
}
