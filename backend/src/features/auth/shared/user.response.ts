import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/generated';

export class UserResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ example: 'UTC' })
  timezone!: string;

  @ApiProperty({ description: 'Local hour a new day starts', example: 4 })
  dayRolloverHour!: number;

  @ApiProperty({ description: 'Opted in to the monthly recap email' })
  monthlyRecap!: boolean;

  @ApiProperty()
  createdAt!: Date;

  static from(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      timezone: user.timezone,
      dayRolloverHour: user.dayRolloverHour,
      monthlyRecap: user.monthlyRecap,
      createdAt: user.createdAt,
    };
  }
}
