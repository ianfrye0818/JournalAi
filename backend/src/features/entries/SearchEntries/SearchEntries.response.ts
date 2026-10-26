import { ApiProperty } from '@nestjs/swagger';
import type { Entry } from '@prisma/generated';
import { dbToLocalDate } from '@src/features/snippets/shared/local-date';
import { EntryResponse } from '../shared/entry.response';

export class SearchEntriesResponse extends EntryResponse {
  @ApiProperty({
    example: '2026-10-26',
    description: 'The day this entry is for',
  })
  date!: string;

  static fromWithDate(
    entry: Entry & { Session: { date: Date } },
  ): SearchEntriesResponse {
    return {
      ...EntryResponse.from(entry),
      date: dbToLocalDate(entry.Session.date),
    };
  }
}
