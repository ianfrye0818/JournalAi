import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '@src/services/email.service';
import { PrismaService } from '@src/services/prisma.service';
import { RedisService } from '@src/services/redis.service';
import { normalizeEmail } from '../shared/password';
import {
  generateResetCode,
  hashResetCode,
  RESET_CODE_TTL_SECONDS,
  RESET_COOLDOWN_SECONDS,
  resetCodeKey,
  resetCooldownKey,
} from '../shared/password-reset';
import { RequestPasswordResetCommand } from './RequestPasswordReset.command';

/**
 * Emails a short-lived reset code. Always succeeds from the caller's point of view, so the
 * endpoint can't be used to find out which emails have accounts.
 */
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetHandler implements ICommandHandler<RequestPasswordResetCommand> {
  private readonly logger = new Logger(RequestPasswordResetHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly email: EmailService,
  ) {}

  async execute({ request }: RequestPasswordResetCommand): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(request.email) },
      select: { id: true, email: true, isActive: true },
    });
    if (!user?.isActive) return;

    const client = this.redis.getClient();
    const fresh = await client.set(
      resetCooldownKey(user.id),
      '1',
      'EX',
      RESET_COOLDOWN_SECONDS,
      'NX',
    );
    if (!fresh) return;

    const code = generateResetCode();
    // Replaces any earlier code. The attempt counter is left alone, so new codes don't buy guesses.
    await client.set(
      resetCodeKey(user.id),
      hashResetCode(code),
      'EX',
      RESET_CODE_TTL_SECONDS,
    );

    // Not awaited: how long the provider takes would otherwise show whether the account exists.
    this.email
      .sendEmail({
        to: user.email,
        subject: 'Your JournalAI reset code',
        text: `Your JournalAI password reset code is ${code}.\n\nIt expires in 15 minutes. If you didn't ask to reset your password, you can ignore this email.`,
        html: `<p>Your JournalAI password reset code is</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p><p>It expires in 15 minutes. If you didn't ask to reset your password, you can ignore this email.</p>`,
      })
      .catch(() =>
        this.logger.error(`Password reset email failed for user ${user.id}`),
      );
  }
}
