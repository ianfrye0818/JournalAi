import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { UserResponse } from '../shared/user.response';
import { UpdateMeCommand } from './UpdateMe.command';
@CommandHandler(UpdateMeCommand)
export class UpdateMeHandler implements ICommandHandler<UpdateMeCommand> {
  constructor(private readonly prisma: PrismaService) {}
  async execute({ userId, request }: UpdateMeCommand) {
    return UserResponse.from(
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(request.dayRolloverHour != null
            ? { dayRolloverHour: request.dayRolloverHour }
            : {}),
          ...(request.timezone != null ? { timezone: request.timezone } : {}),
          ...(request.monthlyRecap != null
            ? { monthlyRecap: request.monthlyRecap }
            : {}),
        },
      }),
    );
  }
}
