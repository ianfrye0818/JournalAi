import { ApiProperty } from '@nestjs/swagger';
import type { Entry } from '@prisma/generated';

export class EntryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, nullable: true })
  title!: string | null;

  @ApiProperty({ description: 'The user-edited entry' })
  body!: string;

  @ApiProperty({ description: 'What the AI originally wrote' })
  aiDraft!: string;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Model that wrote aiDraft',
  })
  model!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static from(entry: Entry): EntryResponse {
    return {
      id: entry.id,
      title: entry.title,
      body: entry.body,
      aiDraft: entry.aiDraft,
      tags: entry.tags,
      model: entry.model,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
