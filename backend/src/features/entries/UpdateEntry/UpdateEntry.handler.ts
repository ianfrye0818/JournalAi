import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { EntryResponse } from '../shared/entry.response';
import { normalizeTags } from '../shared/tags';
import { UpdateEntryCommand } from './UpdateEntry.command';
import { UpdateEntryResponse } from './UpdateEntry.response';

/** The user's edits to the entry body. `aiDraft` keeps what the AI wrote. */
@CommandHandler(UpdateEntryCommand)
export class UpdateEntryHandler implements ICommandHandler<
  UpdateEntryCommand,
  UpdateEntryResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    entryId,
    request,
  }: UpdateEntryCommand): Promise<UpdateEntryResponse> {
    const { title, body, tags, mood } = request;
    if (
      title === undefined &&
      body === undefined &&
      tags === undefined &&
      mood === undefined
    ) {
      throw new BadRequestException(
        'Send at least one of title, body, tags, mood',
      );
    }

    const entry = await this.prisma.entry.findFirst({
      where: { id: entryId, userId },
      select: { id: true, Session: { select: { status: true } } },
    });
    if (!entry) throw new NotFoundException('Entry not found');
    if (entry.Session.status === DayStatus.finalized) {
      throw new ConflictException('Reopen this day before editing its entry');
    }

    const updated = await this.prisma.entry.update({
      where: { id: entry.id },
      data: {
        title: title === undefined ? undefined : title.trim() || null,
        body,
        tags: tags && normalizeTags(tags),
        mood:
          mood === undefined ? undefined : mood.trim().toLowerCase() || null,
      },
    });
    return EntryResponse.from(updated);
  }
}
