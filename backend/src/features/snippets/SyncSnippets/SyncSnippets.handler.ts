import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { localDateToDb } from '../shared/local-date';
import { SyncSnippetsCommand } from './SyncSnippets.command';
import { SyncSnippetItem } from './SyncSnippets.request';
import {
  SyncSnippetResult,
  SyncSnippetsResponse,
} from './SyncSnippets.response';

type StoredSnippet = { id: string; clientUpdatedAt: Date };

/**
 * Upserts a batch from the device outbox. Idempotent on (userId, clientId) and last-write-wins on
 * the device's `updatedAt`, so retries and out-of-order batches are safe. Items are applied one by
 * one and each gets its own result; a failed batch is simply retried by the device.
 */
@CommandHandler(SyncSnippetsCommand)
export class SyncSnippetsHandler implements ICommandHandler<
  SyncSnippetsCommand,
  SyncSnippetsResponse
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({
    userId,
    request,
  }: SyncSnippetsCommand): Promise<SyncSnippetsResponse> {
    const { snippets } = request;
    const sessionIds = await this.upsertSessions(
      userId,
      snippets.map((s) => s.localDate),
    );

    const existing = await this.prisma.snippet.findMany({
      where: { userId, clientId: { in: snippets.map((s) => s.clientId) } },
      select: { id: true, clientId: true, clientUpdatedAt: true },
    });
    const stored = new Map<string, StoredSnippet>(
      existing.map((s) => [s.clientId, s]),
    );

    // Sequential, so a clientId repeated within one batch resolves against its own earlier write.
    const results: SyncSnippetResult[] = [];
    for (const item of snippets) {
      const sessionId = sessionIds.get(item.localDate)!;
      results.push(await this.apply(userId, item, sessionId, stored));
    }
    return { results };
  }

  private async upsertSessions(
    userId: string,
    localDates: string[],
  ): Promise<Map<string, string>> {
    const ids = new Map<string, string>();
    for (const localDate of new Set(localDates)) {
      const date = localDateToDb(localDate);
      const session = await this.prisma.dailySession.upsert({
        where: { userId_date: { userId, date } },
        create: { userId, date },
        update: {},
        select: { id: true },
      });
      ids.set(localDate, session.id);
    }
    return ids;
  }

  private async apply(
    userId: string,
    item: SyncSnippetItem,
    sessionId: string,
    stored: Map<string, StoredSnippet>,
  ): Promise<SyncSnippetResult> {
    const { clientId } = item;
    const data = {
      text: item.text,
      source: item.source,
      capturedAt: item.capturedAt,
      clientUpdatedAt: item.updatedAt,
      deletedAt: item.deletedAt ?? null,
      sessionId,
    };

    let current = stored.get(clientId);
    if (!current) {
      try {
        const created = await this.prisma.snippet.create({
          data: { ...data, clientId, userId },
          select: { id: true, clientUpdatedAt: true },
        });
        stored.set(clientId, created);
        return { clientId, id: created.id, status: 'created' };
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
        // A concurrent batch created it first; fall through and compare against that copy.
        current = await this.prisma.snippet.findUniqueOrThrow({
          where: { userId_clientId: { userId, clientId } },
          select: { id: true, clientUpdatedAt: true },
        });
      }
    }

    const incoming = item.updatedAt.getTime();
    const known = current.clientUpdatedAt.getTime();
    if (incoming === known) {
      return { clientId, id: current.id, status: 'unchanged' };
    }
    if (incoming < known) return { clientId, id: current.id, status: 'stale' };

    // Conditional, so a newer edit that landed after our read is never overwritten.
    const { count } = await this.prisma.snippet.updateMany({
      where: {
        id: current.id,
        userId,
        clientUpdatedAt: { lt: item.updatedAt },
      },
      data,
    });
    if (count === 0) return { clientId, id: current.id, status: 'stale' };

    stored.set(clientId, { id: current.id, clientUpdatedAt: item.updatedAt });
    return { clientId, id: current.id, status: 'updated' };
  }
}

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';
