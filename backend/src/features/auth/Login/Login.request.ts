import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ format: 'email', example: 'me@example.com' })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  // No MinLength here: a short password is just a wrong password.
  @ApiProperty({ maxLength: 128 })
  @IsString()
  @MaxLength(128)
  password!: string;
}
