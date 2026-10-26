import { ApiProperty } from '@nestjs/swagger';
import { SnippetSource, type Snippet } from '@prisma/generated';
import { dbToLocalDate } from './local-date';

export class SnippetResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Generated on the device' })
  clientId!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty({ enum: SnippetSource })
  source!: SnippetSource;

  @ApiProperty()
  capturedAt!: Date;

  @ApiProperty({ example: '2026-10-26' })
  localDate!: string;

  @ApiProperty({
    description: 'Device clock of the last edit (last write wins)',
  })
  updatedAt!: Date;

  @ApiProperty({ type: Date, nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({
    description: 'Server clock of the last change; pass it back as `since`',
  })
  serverUpdatedAt!: Date;

  static from(snippet: Snippet & { Session: { date: Date } }): SnippetResponse {
    return {
      id: snippet.id,
      clientId: snippet.clientId,
      text: snippet.text,
      source: snippet.source,
      capturedAt: snippet.capturedAt,
      localDate: dbToLocalDate(snippet.Session.date),
      updatedAt: snippet.clientUpdatedAt,
      deletedAt: snippet.deletedAt,
      serverUpdatedAt: snippet.updatedAt,
    };
  }
}
