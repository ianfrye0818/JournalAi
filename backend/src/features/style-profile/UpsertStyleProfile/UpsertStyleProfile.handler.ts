import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@src/services/prisma.service';
import { StyleProfileResponse } from '../shared/style-profile.response';
import { UpsertStyleProfileCommand } from './UpsertStyleProfile.command';
import { UpsertStyleProfileResponse } from './UpsertStyleProfile.response';

/** Replaces the whole profile (PUT semantics); omitted `notes` clears them. */
@CommandHandler(UpsertStyleProfileCommand)
export class UpsertStyleProfileHandler implements ICommandHandler<
  UpsertStyleProfileCommand,
  UpsertStyleProfileResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: UpsertStyleProfileCommand): Promise<UpsertStyleProfileResponse> {
    const data = {
      samples: request.samples.trim(),
      notes: request.notes?.trim() || null,
    };
    const profile = await this.prisma.styleProfile.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
    return StyleProfileResponse.from(profile);
  }
}
