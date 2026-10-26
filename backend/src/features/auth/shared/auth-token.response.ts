import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class AuthTokenResponse {
  @ApiProperty({ description: 'Opaque bearer token' })
  token!: string;

  @ApiProperty({ type: UserResponse })
  user!: UserResponse;
}
