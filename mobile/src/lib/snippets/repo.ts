import { and, asc, eq, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { randomUUID } from 'expo-crypto';

import { db } from '@/lib/db/client';
import { snippets, type Snippet, type SnippetSource } from '@/lib/db/schema';
import { localDate } from '@/lib/dates';
import { getRolloverHour } from '@/lib/settings';

/**
 * Local snippet writes. Every change bumps `updatedAt` and leaves `syncedAt` behind it, which is
 * how the sync engine (Task 07) finds what to push. Deletes are soft so they can sync too.
 */
export const snippetsRepo = {
  async add(text: string, { source = 'text' }: { source?: SnippetSource } = {}): Promise<Snippet> {
    const body = text.trim();
    if (!body) throw new Error('Snippet text is empty');
    const now = new Date();
    const [row] = await db
      .insert(snippets)
      .values({
        clientId: randomUUID(),
        text: body,
        source,
        capturedAt: now,
        localDate: localDate(now, getRolloverHour()),
        updatedAt: now,
      })
      .returning();
    return row;
  },

  /** Changes the text only; the snippet keeps its original capture time and day. */
  async edit(clientId: string, text: string) {
    const body = text.trim();
    if (!body) throw new Error('Snippet text is empty');
    await db
      .update(snippets)
      .set({ text: body, updatedAt: new Date() })
      .where(and(eq(snippets.clientId, clientId), isNull(snippets.deletedAt)));
  },

  async remove(clientId: string) {
    const now = new Date();
    await db
      .update(snippets)
      .set({ deletedAt: now, updatedAt: now })
      .where(and(eq(snippets.clientId, clientId), isNull(snippets.deletedAt)));
  },

  /** Live (non-deleted) snippets for a day, oldest first. */
  listByDate(date: string) {
    return db
      .select()
      .from(snippets)
      .where(and(eq(snippets.localDate, date), isNull(snippets.deletedAt)))
      .orderBy(asc(snippets.capturedAt));
  },
};

/** Re-renders whenever the snippets table changes. */
export function useSnippetsByDate(date: string) {
  return useLiveQuery(snippetsRepo.listByDate(date), [date]);
}
