import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { UnsubscribeCommand } from './Unsubscribe.command';
@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  constructor(private readonly prisma: PrismaService) {}
  async execute({ recapId }: UnsubscribeCommand): Promise<void> {
    // Unknown ids succeed silently so the endpoint can't be used to probe for recaps.
    const recap = await this.prisma.monthlySummary.findUnique({
      where: { id: recapId },
      select: { userId: true },
    });
    if (!recap) return;
    await this.prisma.user.update({
      where: { id: recap.userId },
      data: { monthlyRecap: false },
    });
  }
}
