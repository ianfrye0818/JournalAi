import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DayStatus } from '@prisma/generated';
import { EntryResponse } from '@src/features/entries/shared/entry.response';
import { normalizeTags } from '@src/features/entries/shared/tags';
import { localDateToDb } from '@src/features/snippets/shared/local-date';
import { AnthropicService } from '@src/services/anthropic.service';
import { PrismaService } from '@src/services/prisma.service';
import {
  buildDraftMessage,
  buildDraftSystem,
  draftOutputSchema,
} from '../prompts/draft.prompt';
import { DraftEntryCommand } from './DraftEntry.command';
import { DraftEntryResponse } from './DraftEntry.response';

/**
 * Has the AI write (or rewrite) the day's entry in the user's voice. The new draft replaces both
 * `aiDraft` and the editable `body`; with `feedback`, the current body goes along as context.
 */
@CommandHandler(DraftEntryCommand)
export class DraftEntryHandler implements ICommandHandler<
  DraftEntryCommand,
  DraftEntryResponse
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anthropic: AnthropicService,
  ) {}

  async execute({
    userId,
    timezone,
    date,
    request,
  }: DraftEntryCommand): Promise<DraftEntryResponse> {
    const [session, style] = await Promise.all([
      this.prisma.dailySession.findUnique({
        where: { userId_date: { userId, date: localDateToDb(date) } },
        include: {
          Snippets: {
            where: { deletedAt: null },
            orderBy: { capturedAt: 'asc' },
          },
          Questions: { orderBy: [{ round: 'asc' }, { order: 'asc' }] },
          Entry: true,
        },
      }),
      this.prisma.styleProfile.findUnique({
        where: { userId },
        select: { samples: true, notes: true },
      }),
    ]);
    if (!session || session.Snippets.length === 0) {
      throw new UnprocessableEntityException(
        'Capture at least one snippet before drafting the entry',
      );
    }
    if (session.status === DayStatus.finalized) {
      throw new ConflictException('Reopen this day before redrafting it');
    }

    const feedback = request.feedback?.trim() || undefined;
    const { output, model } = await this.anthropic.generateStructuredWithModel({
      label: 'draft',
      system: buildDraftSystem(style),
      messages: [
        {
          role: 'user',
          content: buildDraftMessage({
            date,
            timezone,
            snippets: session.Snippets,
            questions: session.Questions,
            previous: session.Entry ?? undefined,
            feedback,
          }),
        },
      ],
      schema: draftOutputSchema,
    });

    const draft = {
      title: output.title.trim(),
      body: output.body,
      aiDraft: output.body,
      tags: normalizeTags(output.tags),
      mood: output.mood.trim().toLowerCase() || null,
      model,
    };
    const entry = await this.prisma.$transaction(async (tx) => {
      // Conditional, so a finalize that landed while the AI was writing isn't silently undone.
      const { count } = await tx.dailySession.updateMany({
        where: {
          id: session.id,
          userId,
          status: { not: DayStatus.finalized },
        },
        data: { status: DayStatus.drafted },
      });
      if (count === 0) {
        throw new ConflictException('This day was finalized; reload it');
      }
      return tx.entry.upsert({
        where: { sessionId: session.id },
        create: { ...draft, sessionId: session.id, userId },
        update: draft,
      });
    });

    return EntryResponse.from(entry);
  }
}
