import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertStyleProfileRequest {
  @ApiProperty({
    maxLength: 50_000,
    description: 'A few past entries, pasted as-is. Empty clears them.',
  })
  @IsString()
  @MaxLength(50_000)
  samples!: string;

  @ApiProperty({
    required: false,
    type: String,
    nullable: true,
    maxLength: 2000,
    example: 'first person, dry humor, no emojis',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
