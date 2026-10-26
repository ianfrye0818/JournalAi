import { and, count, desc, eq, isNull, ne, notInArray, or, sql, type Column } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { DaySummary, DayView, Entry as ApiEntry } from '@/lib/api/types';
import { db } from '@/lib/db/client';
import { days, entries, snippets } from '@/lib/db/schema';

/**
 * Read-through cache of server days and entries, so history reads offline and export has the
 * text on hand. The server stays the source of truth: every write here mirrors a response.
 */

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function upsertEntry(tx: Tx, date: string, entry: ApiEntry, now: Date) {
  // One entry per day; drop a stale row for the date if the server's entry has a new id.
  await tx.delete(entries).where(and(eq(entries.localDate, date), ne(entries.id, entry.id)));
  const values = {
    localDate: date,
    title: entry.title,
    body: entry.body,
    aiDraft: entry.aiDraft,
    tags: entry.tags,
    mood: entry.mood,
    model: entry.model,
    updatedAt: new Date(entry.updatedAt),
    fetchedAt: now,
  };
  await tx
    .insert(entries)
    .values({ id: entry.id, ...values })
    .onConflictDoUpdate({ target: entries.id, set: values });
}

/** `'50%'` should match literally; `\` escapes LIKE's wildcards. */
const likeAny = (column: Column, needle: string) =>
  sql`${column} LIKE ${`%${needle.replace(/[\\%_]/g, '\\$&')}%`} ESCAPE '\\'`;

export const historyCache = {
  /** Mirrors `GET /days`: upserts every day it lists and forgets days it no longer does. */
  async saveDayList(list: DaySummary[]) {
    const now = new Date();
    const dates = list.map((d) => d.date);
    await db.transaction(async (tx) => {
      for (const day of list) {
        const values = {
          status: day.status,
          entryTitle: day.entryTitle,
          entryUpdatedAt: day.entryUpdatedAt ? new Date(day.entryUpdatedAt) : null,
          fetchedAt: now,
        };
        await tx
          .insert(days)
          .values({ localDate: day.date, updatedAt: now, ...values })
          .onConflictDoUpdate({ target: days.localDate, set: values });
      }
      await tx.delete(days).where(dates.length ? notInArray(days.localDate, dates) : undefined);
      await tx.delete(entries).where(dates.length ? notInArray(entries.localDate, dates) : undefined);
    });
  },

  /** Mirrors one `DayView` (from `GET /days/:date` or a flow mutation), entry included. */
  async saveDay(day: DayView) {
    // An untouched day comes back with no id; don't let it add an empty row to the history.
    if (!day.id && !day.entry) return;
    const now = new Date();
    const values = {
      serverId: day.id,
      status: day.status,
      interviewRound: day.interviewRound,
      finalizedAt: day.finalizedAt ? new Date(day.finalizedAt) : null,
      entryTitle: day.entry?.title ?? null,
      entryUpdatedAt: day.entry ? new Date(day.entry.updatedAt) : null,
      updatedAt: now,
      fetchedAt: now,
    };
    await db.transaction(async (tx) => {
      await tx
        .insert(days)
        .values({ localDate: day.date, ...values })
        .onConflictDoUpdate({ target: days.localDate, set: values });
      if (day.entry) await upsertEntry(tx, day.date, day.entry, now);
    });
  },

  async saveEntries(list: (ApiEntry & { date: string })[]) {
    if (list.length === 0) return;
    const now = new Date();
    await db.transaction(async (tx) => {
      for (const entry of list) await upsertEntry(tx, entry.date, entry, now);
    });
  },

  /** Cached entry `updatedAt` (ms) by date, for deciding what to refetch. */
  async entryVersions(): Promise<Map<string, number>> {
    const rows = await db
      .select({ localDate: entries.localDate, updatedAt: entries.updatedAt })
      .from(entries);
    return new Map(rows.map((r) => [r.localDate, r.updatedAt.getTime()]));
  },

  /** Offline search over cached entries. SQLite's LIKE ignores case for ASCII, like the server's ILIKE. */
  search(q: string, limit = 50) {
    return db
      .select()
      .from(entries)
      .where(or(likeAny(entries.title, q), likeAny(entries.body, q)))
      .orderBy(desc(entries.localDate))
      .limit(limit);
  },
};

/** The cached day list, live. `loaded` is false until the first read finishes. */
export function useCachedDays() {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ localDate: days.localDate, status: days.status, entryTitle: days.entryTitle })
      .from(days),
  );
  return { data, loaded: updatedAt !== undefined };
}

/** Live (non-deleted) snippet counts per day on this device. */
export function useSnippetCounts() {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ localDate: snippets.localDate, count: count() })
      .from(snippets)
      .where(isNull(snippets.deletedAt))
      .groupBy(snippets.localDate),
  );
  return { data, loaded: updatedAt !== undefined };
}

/** One cached day and its entry, live. */
export function useCachedDay(date: string) {
  const day = useLiveQuery(db.select().from(days).where(eq(days.localDate, date)), [date]);
  const entry = useLiveQuery(db.select().from(entries).where(eq(entries.localDate, date)), [date]);
  return {
    day: day.data[0],
    entry: entry.data[0],
    loaded: day.updatedAt !== undefined && entry.updatedAt !== undefined,
  };
}
