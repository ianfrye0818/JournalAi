import { and, asc, eq, gte, isNull, lte } from 'drizzle-orm';

import type { DayView, Entry } from '@/lib/api/types';
import { db } from '@/lib/db/client';
import { days, entries, snippets } from '@/lib/db/schema';
import type { ExportDay, ExportSnippet } from '@/lib/export/markdown';
import { refreshHistory } from '@/lib/history/queries';
import { snippetsRepo } from '@/lib/snippets/repo';

/**
 * Gathers what an export needs. Snippets come from the device, which owns them; the server's copy
 * only fills in for a day this device has none of (e.g. right after a fresh install).
 */

type EntryText = Pick<Entry, 'title' | 'body' | 'tags'>;

const toExportSnippet = (s: { text: string; capturedAt: Date }): ExportSnippet => ({
  text: s.text,
  capturedAt: s.capturedAt,
});

function remoteSnippets(day: DayView | undefined): ExportSnippet[] {
  return (day?.snippets ?? [])
    .filter((s) => !s.deletedAt)
    .map((s) => ({ text: s.text, capturedAt: new Date(s.capturedAt) }));
}

/** One day for export, or null if it has no entry to export. */
export async function loadExportDay(
  date: string,
  entry: EntryText | null,
  serverDay?: DayView,
): Promise<ExportDay | null> {
  if (!entry) return null;
  const local = await snippetsRepo.listByDate(date);
  return {
    date,
    title: entry.title,
    body: entry.body,
    tags: entry.tags,
    snippets: local.length > 0 ? local.map(toExportSnippet) : remoteSnippets(serverDay),
  };
}

/**
 * Every finalized day from `from` to `to` (inclusive), oldest first. Refreshes the history cache
 * first when online; offline it exports what the cache already holds.
 */
export async function loadFinalizedDays(from: string, to: string): Promise<ExportDay[]> {
  try {
    await refreshHistory();
  } catch (err) {
    console.warn('Refreshing history before export failed; using the cache', err);
  }

  const rows = await db
    .select({ date: entries.localDate, title: entries.title, body: entries.body, tags: entries.tags })
    .from(entries)
    .innerJoin(days, eq(days.localDate, entries.localDate))
    .where(and(eq(days.status, 'finalized'), gte(entries.localDate, from), lte(entries.localDate, to)))
    .orderBy(asc(entries.localDate));
  if (rows.length === 0) return [];

  const local = await db
    .select({ localDate: snippets.localDate, text: snippets.text, capturedAt: snippets.capturedAt })
    .from(snippets)
    .where(and(isNull(snippets.deletedAt), gte(snippets.localDate, from), lte(snippets.localDate, to)))
    .orderBy(asc(snippets.capturedAt));
  const byDate = new Map<string, ExportSnippet[]>();
  for (const s of local) {
    const list = byDate.get(s.localDate) ?? [];
    list.push(toExportSnippet(s));
    byDate.set(s.localDate, list);
  }

  return rows.map((row) => ({ ...row, snippets: byDate.get(row.date) ?? [] }));
}
