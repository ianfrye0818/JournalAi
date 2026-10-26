import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { daysApi, entriesApi } from '@/lib/api/days';
import { ApiError } from '@/lib/api/client';
import type { DaySummary } from '@/lib/api/types';
import { historyCache, useCachedDays, useSnippetCounts } from '@/lib/history/cache';
import { fetchEntriesFor, mergeHistory, staleEntryDates } from '@/lib/history/days';

/**
 * Pulls the day list into the cache, then the finalized entries that are new or changed since
 * they were cached. Unchanged entries are never downloaded twice.
 */
export async function refreshHistory(): Promise<DaySummary[]> {
  const list = await daysApi.list();
  await historyCache.saveDayList(list);
  const stale = staleEntryDates(list, await historyCache.entryVersions());
  await historyCache.saveEntries(await fetchEntriesFor(stale, entriesApi.search));
  return list;
}

/** The Days history from the cache, newest first; works offline. */
export function useHistory() {
  const cached = useCachedDays();
  const counts = useSnippetCounts();
  const days = useMemo(() => mergeHistory(cached.data, counts.data), [cached.data, counts.data]);
  return { days, loaded: cached.loaded && counts.loaded };
}

export type SearchHit = { date: string; title: string | null; body: string };

export type SearchResult = {
  hits: SearchHit[];
  /** `local` means the server was unreachable and only entries saved on the device were searched. */
  source: 'server' | 'local';
};

export const searchKeys = {
  entries: (q: string) => ['entries', 'search', q] as const,
};

export function useEntrySearch(q: string) {
  return useQuery({
    queryKey: searchKeys.entries(q),
    queryFn: async (): Promise<SearchResult> => {
      try {
        const hits = await entriesApi.search({ q, limit: 50 });
        return { source: 'server', hits };
      } catch (err) {
        if (!(err instanceof ApiError && err.isNetworkError)) throw err;
        const rows = await historyCache.search(q);
        return { source: 'local', hits: rows.map((r) => ({ ...r, date: r.localDate })) };
      }
    },
    enabled: q.length > 0,
    // Keep the last results on screen while the next keystroke's search runs.
    placeholderData: keepPreviousData,
    // Offline falls back right away; retrying would only delay that.
    retry: false,
  });
}
