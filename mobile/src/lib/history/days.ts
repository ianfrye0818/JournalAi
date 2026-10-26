import type { DayStatus, DaySummary, EntrySearchParams, EntryWithDate } from '@/lib/api/types';
import { addDays } from '@/lib/dates';

/** One row of the Days history, as the device knows it. */
export type HistoryDay = {
  date: string;
  status: DayStatus;
  /** Live snippets on this device. */
  snippetCount: number;
  entryTitle: string | null;
};

/**
 * Joins the cached server day list with the device's own snippet counts, newest first. Days
 * captured offline aren't on the server yet, so they show up from their snippets alone as `open`.
 */
export function mergeHistory(
  cached: readonly { localDate: string; status: DayStatus; entryTitle: string | null }[],
  snippetCounts: readonly { localDate: string; count: number }[],
): HistoryDay[] {
  const byDate = new Map<string, HistoryDay>();
  for (const row of cached) {
    byDate.set(row.localDate, {
      date: row.localDate,
      status: row.status,
      snippetCount: 0,
      entryTitle: row.entryTitle,
    });
  }
  for (const { localDate, count } of snippetCounts) {
    if (count === 0) continue;
    const day = byDate.get(localDate);
    if (day) day.snippetCount = count;
    else byDate.set(localDate, { date: localDate, status: 'open', snippetCount: count, entryTitle: null });
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Finalized days whose entry is missing from the cache or older than the server's copy, newest
 * first. `cachedVersions` maps a date to its cached entry's `updatedAt` in ms.
 */
export function staleEntryDates(
  days: readonly Pick<DaySummary, 'date' | 'status' | 'entryUpdatedAt'>[],
  cachedVersions: ReadonlyMap<string, number>,
): string[] {
  return days
    .filter((day) => {
      if (day.status !== 'finalized' || !day.entryUpdatedAt) return false;
      const cached = cachedVersions.get(day.date);
      return cached === undefined || cached < new Date(day.entryUpdatedAt).getTime();
    })
    .map((day) => day.date)
    .sort()
    .reverse();
}

/** The largest page `GET /entries` serves (`MAX_SEARCH_LIMIT` in the backend). */
export const ENTRY_PAGE_SIZE = 200;

/**
 * Fetches the entries for `dates` with as few requests as the range allows: one date range,
 * paged newest first. Each day has at most one entry, so the next page ends the day before the
 * oldest entry of the last one.
 */
export async function fetchEntriesFor(
  dates: readonly string[],
  search: (params: EntrySearchParams) => Promise<EntryWithDate[]>,
): Promise<EntryWithDate[]> {
  if (dates.length === 0) return [];
  const wanted = new Set(dates);
  const sorted = [...wanted].sort();
  const from = sorted[0];
  let to = sorted[sorted.length - 1];

  const found: EntryWithDate[] = [];
  while (to >= from) {
    const page = await search({ from, to, limit: ENTRY_PAGE_SIZE });
    found.push(...page.filter((entry) => wanted.has(entry.date)));
    if (page.length < ENTRY_PAGE_SIZE) break;
    to = addDays(page[page.length - 1].date, -1);
  }
  return found;
}
