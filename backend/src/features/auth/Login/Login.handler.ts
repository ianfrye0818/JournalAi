import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import {
  burnPasswordVerify,
  normalizeEmail,
  verifyPassword,
} from '../shared/password';
import { UserResponse } from '../shared/user.response';
import { LoginCommand } from './Login.command';
import { LoginResponse } from './Login.response';

// Same message for unknown email, wrong password and inactive user.
export const INVALID_CREDENTIALS = 'Invalid email or password';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<
  LoginCommand,
  LoginResponse
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async execute({ request }: LoginCommand): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(request.email) },
    });

    if (!user) {
      await burnPasswordVerify(request.password);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const valid = await verifyPassword(user.passwordHash, request.password);
    if (!valid || !user.isActive) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const token = await this.tokenService.issue(user.id);
    return { token, user: UserResponse.from(user) };
  }
}
