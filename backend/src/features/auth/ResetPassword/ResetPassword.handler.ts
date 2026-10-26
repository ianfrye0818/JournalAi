import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { RedisService } from '@src/services/redis.service';
import { TokenService } from '@src/services/token.service';
import { hashPassword, normalizeEmail } from '../shared/password';
import {
  MAX_RESET_ATTEMPTS,
  RESET_ATTEMPTS_WINDOW_SECONDS,
  resetAttemptsKey,
  resetCodeKey,
  resetCodeMatches,
} from '../shared/password-reset';
import { UserResponse } from '../shared/user.response';
import { ResetPasswordCommand } from './ResetPassword.command';
import { ResetPasswordResponse } from './ResetPassword.response';

// Same message for unknown email, no code, expired code and wrong code.
export const INVALID_RESET_CODE = 'That code is wrong or has expired';
export const TOO_MANY_RESET_ATTEMPTS =
  'Too many wrong codes. Try again in an hour.';

/** Sets a new password, signs out every device, and signs this one in. */
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<
  ResetPasswordCommand,
  ResetPasswordResponse
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly tokens: TokenService,
  ) {}

  async execute({
    request,
  }: ResetPasswordCommand): Promise<ResetPasswordResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(request.email) },
      select: { id: true, isActive: true },
    });
    if (!user?.isActive) throw new BadRequestException(INVALID_RESET_CODE);

    const client = this.redis.getClient();
    const attempts = await client.incr(resetAttemptsKey(user.id));
    if (attempts === 1) {
      await client.expire(
        resetAttemptsKey(user.id),
        RESET_ATTEMPTS_WINDOW_SECONDS,
      );
    }
    if (attempts > MAX_RESET_ATTEMPTS) {
      throw new BadRequestException(TOO_MANY_RESET_ATTEMPTS);
    }

    const stored = await client.get(resetCodeKey(user.id));
    if (!stored || !resetCodeMatches(stored, request.code)) {
      throw new BadRequestException(INVALID_RESET_CODE);
    }
    // Single use: spend the code before changing anything.
    await client.del(resetCodeKey(user.id), resetAttemptsKey(user.id));

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(request.password) },
    });
    await this.tokens.revokeAll(user.id);
    const token = await this.tokens.issue(user.id);
    return { token, user: UserResponse.from(updated) };
  }
}
