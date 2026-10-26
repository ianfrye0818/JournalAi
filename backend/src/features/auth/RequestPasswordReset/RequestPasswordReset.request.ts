import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class RequestPasswordResetRequest {
  @ApiProperty({ format: 'email', example: 'me@example.com' })
  @IsEmail()
  @MaxLength(254)
  email!: string;
}
