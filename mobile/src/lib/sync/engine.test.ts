import type { PullCursor, RemoteSnippet, SnippetPayload } from '@/lib/api/types';
import type { Snippet } from '@/lib/db/schema';

import { createSyncEngine, type SyncStore, type SyncTransport } from './engine';
import { fromRemote, isUnsynced, shouldApplyRemote } from './merge';

/** In-memory SyncStore with the same rules as the SQLite one. */
class MemoryStore implements SyncStore {
  rows = new Map<string, Snippet>();
  cursor: PullCursor | null = null;

  add(clientId: string, updatedAt = new Date('2026-10-26T14:00:00Z')) {
    this.rows.set(clientId, {
      clientId,
      text: `snippet ${clientId}`,
      source: 'text',
      capturedAt: updatedAt,
      localDate: '2026-10-26',
      updatedAt,
      deletedAt: null,
      syncedAt: null,
    });
  }

  async unsynced(limit: number) {
    return [...this.rows.values()]
      .filter(isUnsynced)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
      .slice(0, limit)
      .map((row) => ({ ...row }));
  }

  async countUnsynced() {
    return [...this.rows.values()].filter(isUnsynced).length;
  }

  async markSynced(rows: { clientId: string; updatedAt: Date }[]) {
    let marked = 0;
    for (const { clientId, updatedAt } of rows) {
      const row = this.rows.get(clientId);
      if (row && row.updatedAt.getTime() === updatedAt.getTime()) {
        row.syncedAt = updatedAt;
        marked += 1;
      }
    }
    return marked;
  }

  async applyRemote(remote: RemoteSnippet[], cursor: PullCursor | null) {
    for (const item of remote) {
      if (shouldApplyRemote(this.rows.get(item.clientId), item)) {
        this.rows.set(item.clientId, fromRemote(item));
      }
    }
    if (cursor) this.cursor = cursor;
  }

  async getPullCursor() {
    return this.cursor;
  }
}

const networkError = () => Object.assign(new Error('offline'), { isNetworkError: true });

const accept = (snippets: SnippetPayload[]) =>
  Promise.resolve({
    results: snippets.map((s) => ({ clientId: s.clientId, id: `id-${s.clientId}`, status: 'created' as const })),
  });

const remoteSnippet = (n: number): RemoteSnippet => ({
  id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
  clientId: `r-${n}`,
  text: `from server ${n}`,
  source: 'text',
  capturedAt: '2026-10-25T10:00:00.000Z',
  localDate: '2026-10-25',
  updatedAt: '2026-10-25T10:00:00.000Z',
  deletedAt: null,
  serverUpdatedAt: `2026-10-25T10:00:${String(n).padStart(2, '0')}.000Z`,
});

function setup({ pushBatchSize }: { pushBatchSize?: number } = {}) {
  const store = new MemoryStore();
  const transport = {
    batch: jest.fn<ReturnType<SyncTransport['batch']>, Parameters<SyncTransport['batch']>>(accept),
    since: jest.fn<ReturnType<SyncTransport['since']>, Parameters<SyncTransport['since']>>(() =>
      Promise.resolve({ snippets: [], hasMore: false }),
    ),
  };
  let foreground = () => {};
  let connectivity = (_online: boolean) => {};
  const engine = createSyncEngine({
    transport,
    store,
    pushBatchSize,
    debounceMs: 1_000,
    triggers: {
      onForeground: (cb) => ((foreground = cb), () => {}),
      onConnectivity: (cb) => ((connectivity = cb), () => {}),
    },
  });
  return {
    store,
    transport,
    engine,
    foreground: () => foreground(),
    setOnline: (online: boolean) => connectivity(online),
  };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('createSyncEngine', () => {
  it('pushes 20 offline snippets once the device is back online', async () => {
    const { store, transport, engine, setOnline } = setup();
    engine.start();
    setOnline(false);
    await jest.runOnlyPendingTimersAsync();
    transport.batch.mockClear();

    for (let i = 0; i < 20; i++) {
      store.add(`c-${i}`);
      engine.notifyLocalChange();
    }
    await jest.advanceTimersByTimeAsync(5_000);
    expect(transport.batch).not.toHaveBeenCalled();
    expect(engine.getState().phase).toBe('offline');

    setOnline(true);
    await jest.advanceTimersByTimeAsync(0);

    expect(transport.batch).toHaveBeenCalledTimes(1);
    expect(transport.batch.mock.calls[0][0]).toHaveLength(20);
    expect(await store.countUnsynced()).toBe(0);
    expect(engine.getState().phase).toBe('idle');
  });

  it('debounces local writes into one push', async () => {
    const { store, transport, engine } = setup();
    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    for (const id of ['a', 'b', 'c']) {
      store.add(id);
      engine.notifyLocalChange();
      await jest.advanceTimersByTimeAsync(500);
    }
    expect(transport.batch).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1_000);
    expect(transport.batch).toHaveBeenCalledTimes(1);
    expect(transport.batch.mock.calls[0][0].map((s) => s.clientId)).toEqual(['a', 'b', 'c']);
  });

  it('splits a large outbox into batches', async () => {
    const { store, transport, engine } = setup({ pushBatchSize: 50 });
    for (let i = 0; i < 120; i++) store.add(`c-${i}`, new Date(Date.UTC(2026, 9, 26, 0, 0, i)));

    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    expect(transport.batch.mock.calls.map(([batch]) => batch.length)).toEqual([50, 50, 20]);
    expect(await store.countUnsynced()).toBe(0);
  });

  it('keeps a snippet edited mid-push in the outbox', async () => {
    const { store, transport, engine } = setup();
    store.add('a');
    transport.batch.mockImplementationOnce(async (snippets) => {
      store.rows.get('a')!.updatedAt = new Date('2026-10-26T15:00:00Z');
      return accept(snippets);
    });

    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    expect(await store.countUnsynced()).toBe(1);
  });

  it('restores from the server on start, paging with the cursor', async () => {
    const { store, transport, engine } = setup();
    transport.since
      .mockResolvedValueOnce({ snippets: [remoteSnippet(1), remoteSnippet(2)], hasMore: true })
      .mockResolvedValueOnce({ snippets: [remoteSnippet(3)], hasMore: false });

    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    expect(transport.since.mock.calls.map(([cursor]) => cursor)).toEqual([
      null,
      { since: remoteSnippet(2).serverUpdatedAt, afterId: remoteSnippet(2).id },
    ]);
    expect([...store.rows.keys()]).toEqual(['r-1', 'r-2', 'r-3']);
    expect(await store.countUnsynced()).toBe(0);
    expect(store.cursor).toEqual({ since: remoteSnippet(3).serverUpdatedAt, afterId: remoteSnippet(3).id });
  });

  it('pulls after a push the server called stale', async () => {
    const { store, transport, engine } = setup();
    engine.start();
    await jest.advanceTimersByTimeAsync(0);
    transport.since.mockClear();

    store.add('a');
    transport.batch.mockResolvedValueOnce({ results: [{ clientId: 'a', id: 'id-a', status: 'stale' }] });
    await engine.sync();

    expect(transport.since).toHaveBeenCalledTimes(1);
  });

  it('pushes and pulls when the app returns to the foreground', async () => {
    const { store, transport, engine, foreground } = setup();
    engine.start();
    await jest.advanceTimersByTimeAsync(0);
    transport.since.mockClear();

    store.add('a');
    foreground();
    await jest.advanceTimersByTimeAsync(0);

    expect(transport.batch).toHaveBeenCalledTimes(1);
    expect(transport.since).toHaveBeenCalledTimes(1);
  });

  it('retries a server error with backoff', async () => {
    const { store, transport, engine } = setup();
    store.add('a');
    transport.batch.mockRejectedValueOnce(new Error('500')).mockRejectedValueOnce(new Error('500'));

    engine.start();
    await jest.advanceTimersByTimeAsync(0);
    expect(engine.getState().phase).toBe('error');

    await jest.advanceTimersByTimeAsync(5_000);
    expect(transport.batch).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(9_999);
    expect(transport.batch).toHaveBeenCalledTimes(2);
    await jest.advanceTimersByTimeAsync(1);
    expect(transport.batch).toHaveBeenCalledTimes(3);
    expect(engine.getState().phase).toBe('idle');
    expect(await store.countUnsynced()).toBe(0);
  });

  it('runs one sync at a time and queues one more', async () => {
    const { store, transport, engine } = setup();
    let release!: () => void;
    transport.batch.mockImplementationOnce(
      (snippets) => new Promise((resolve) => (release = () => resolve(accept(snippets)))),
    );
    store.add('a');
    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    store.add('b');
    void engine.sync();
    void engine.sync();
    expect(transport.batch).toHaveBeenCalledTimes(1);

    release();
    await jest.advanceTimersByTimeAsync(0);
    expect(transport.batch).toHaveBeenCalledTimes(2);
    expect(transport.batch.mock.calls[1][0].map((s) => s.clientId)).toEqual(['b']);
  });

  it('flush reports whether the outbox emptied', async () => {
    const { store, transport, engine } = setup();
    engine.start();
    await jest.advanceTimersByTimeAsync(0);

    store.add('a');
    transport.batch.mockRejectedValueOnce(networkError());
    expect(await engine.flush()).toBe(false);

    expect(await engine.flush()).toBe(true);
  });

  it('does nothing after stop', async () => {
    const { store, transport, engine } = setup();
    engine.start();
    await jest.advanceTimersByTimeAsync(0);
    engine.stop();

    store.add('a');
    engine.notifyLocalChange();
    await jest.advanceTimersByTimeAsync(10_000);
    await engine.sync();

    expect(transport.batch).not.toHaveBeenCalled();
  });
});
