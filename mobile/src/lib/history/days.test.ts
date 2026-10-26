import type { EntrySearchParams, EntryWithDate } from '@/lib/api/types';
import { addDays } from '@/lib/dates';
import { ENTRY_PAGE_SIZE, fetchEntriesFor, mergeHistory, staleEntryDates } from '@/lib/history/days';

describe('mergeHistory', () => {
  it('adds device snippet counts to cached days and sorts newest first', () => {
    const merged = mergeHistory(
      [
        { localDate: '2026-10-24', status: 'finalized', entryTitle: 'Rain' },
        { localDate: '2026-10-25', status: 'drafted', entryTitle: null },
      ],
      [{ localDate: '2026-10-24', count: 3 }],
    );
    expect(merged).toEqual([
      { date: '2026-10-25', status: 'drafted', snippetCount: 0, entryTitle: null },
      { date: '2026-10-24', status: 'finalized', snippetCount: 3, entryTitle: 'Rain' },
    ]);
  });

  it('shows days only captured on the device as open', () => {
    expect(mergeHistory([], [{ localDate: '2026-10-26', count: 2 }])).toEqual([
      { date: '2026-10-26', status: 'open', snippetCount: 2, entryTitle: null },
    ]);
  });
});

describe('staleEntryDates', () => {
  const day = (date: string, status: 'finalized' | 'drafted', entryUpdatedAt: string | null) => ({
    date,
    status,
    entryUpdatedAt,
  });

  it('picks finalized days with a missing or older cached entry, newest first', () => {
    const cached = new Map([
      ['2026-10-24', Date.parse('2026-10-24T22:00:00Z')],
      ['2026-10-23', Date.parse('2026-10-23T22:00:00Z')],
    ]);
    const stale = staleEntryDates(
      [
        day('2026-10-22', 'finalized', '2026-10-22T22:00:00Z'), // not cached
        day('2026-10-23', 'finalized', '2026-10-23T22:00:00Z'), // up to date
        day('2026-10-24', 'finalized', '2026-10-25T09:00:00Z'), // edited since
        day('2026-10-25', 'drafted', '2026-10-25T22:00:00Z'), // not finalized
        day('2026-10-26', 'finalized', null), // no entry
      ],
      cached,
    );
    expect(stale).toEqual(['2026-10-24', '2026-10-22']);
  });
});

describe('fetchEntriesFor', () => {
  const entry = (date: string): EntryWithDate => ({
    id: `e-${date}`,
    date,
    title: null,
    body: 'Body',
    aiDraft: 'Body',
    tags: [],
    mood: null,
    model: null,
    createdAt: `${date}T20:00:00Z`,
    updatedAt: `${date}T20:00:00Z`,
  });

  it('does nothing for no dates', async () => {
    const search = jest.fn();
    expect(await fetchEntriesFor([], search)).toEqual([]);
    expect(search).not.toHaveBeenCalled();
  });

  it('searches the covering range once and keeps only the wanted days', async () => {
    const search = jest.fn(async () => [entry('2026-10-25'), entry('2026-10-24'), entry('2026-10-20')]);
    const found = await fetchEntriesFor(['2026-10-20', '2026-10-25'], search);
    expect(search).toHaveBeenCalledWith({ from: '2026-10-20', to: '2026-10-25', limit: ENTRY_PAGE_SIZE });
    expect(found.map((e) => e.date)).toEqual(['2026-10-25', '2026-10-20']);
  });

  it('pages back from the oldest entry of a full page', async () => {
    // Every day has an entry, newest first, like the server.
    const all = Array.from({ length: ENTRY_PAGE_SIZE + 5 }, (_, i) => entry(addDays('2026-10-26', -i)));
    const from = all[all.length - 1].date;
    const search = jest.fn(async ({ to }: EntrySearchParams) =>
      all.filter((e) => e.date <= to! && e.date >= from).slice(0, ENTRY_PAGE_SIZE),
    );

    const found = await fetchEntriesFor(all.map((e) => e.date), search);

    expect(search).toHaveBeenCalledTimes(2);
    expect(search.mock.calls[1][0].to).toBe(addDays(all[ENTRY_PAGE_SIZE - 1].date, -1));
    expect(found).toHaveLength(all.length);
  });
});
