import { ApiProperty } from '@nestjs/swagger';
import type { StyleProfile } from '@prisma/generated';

export class StyleProfileResponse {
  @ApiProperty({ description: 'A few past entries, as the user wrote them' })
  samples!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'first person, dry humor, no emojis',
  })
  notes!: string | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Null until the profile is first saved',
  })
  updatedAt!: Date | null;

  static from(profile: StyleProfile | null): StyleProfileResponse {
    return {
      samples: profile?.samples ?? '',
      notes: profile?.notes ?? null,
      updatedAt: profile?.updatedAt ?? null,
    };
  }
}
