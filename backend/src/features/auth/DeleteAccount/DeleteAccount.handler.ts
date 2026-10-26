import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import { DeleteAccountCommand } from './DeleteAccount.command';
@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
  ) {}
  async execute({ userId }: DeleteAccountCommand): Promise<void> {
    // Revoke first: Redis failure leaves the account intact and the request retryable.
    await this.tokens.revokeAll(userId);
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
