import type {
  GetSnippetsSinceResponse,
  PullCursor,
  RemoteSnippet,
  SnippetPayload,
  SyncSnippetsResponse,
} from '@/lib/api/types';
import type { Snippet } from '@/lib/db/schema';
import { toPayload } from '@/lib/sync/merge';

/**
 * Snippet sync. Pushes the local outbox (rows whose `syncedAt` is behind `updatedAt`) and pulls
 * server changes after a cursor. Both sides are last-write-wins on the device clock and the server
 * is idempotent on clientId, so a run can fail or repeat at any point without harm.
 *
 * Runs are single-flight: a trigger during a run queues one more run instead of overlapping.
 * Dependencies are injected so this file has no native imports; `@/lib/sync` wires the real ones.
 */

export type SyncPhase = 'idle' | 'syncing' | 'offline' | 'error';
export type SyncState = { phase: SyncPhase; lastSyncedAt: Date | null };

export type SyncTransport = {
  batch(snippets: SnippetPayload[]): Promise<SyncSnippetsResponse>;
  since(cursor: PullCursor | null): Promise<GetSnippetsSinceResponse>;
};

export type SyncStore = {
  /** Oldest edits first. */
  unsynced(limit: number): Promise<Snippet[]>;
  countUnsynced(): Promise<number>;
  /** Marks rows synced only if they still have that `updatedAt`. Returns how many it marked. */
  markSynced(rows: { clientId: string; updatedAt: Date }[]): Promise<number>;
  /** Applies a pulled page and saves the cursor in one transaction. */
  applyRemote(rows: RemoteSnippet[], cursor: PullCursor | null): Promise<void>;
  getPullCursor(): Promise<PullCursor | null>;
};

export type SyncTriggers = {
  /** Calls back when the app comes to the foreground. Returns an unsubscribe. */
  onForeground(callback: () => void): () => void;
  /** Calls back on every connectivity change. Returns an unsubscribe. */
  onConnectivity(callback: (online: boolean) => void): () => void;
};

export type SyncEngineOptions = {
  transport: SyncTransport;
  store: SyncStore;
  triggers: SyncTriggers;
  /** Snippets per POST; the server accepts up to 200. */
  pushBatchSize?: number;
  /** Quiet period after a local write before pushing. */
  debounceMs?: number;
};

const RETRY_BASE_MS = 5_000;
const RETRY_MAX_MS = 5 * 60_000;

export type SyncEngine = ReturnType<typeof createSyncEngine>;

export function createSyncEngine({
  transport,
  store,
  triggers,
  pushBatchSize = 50,
  debounceMs = 1_500,
}: SyncEngineOptions) {
  let state: SyncState = { phase: 'idle', lastSyncedAt: null };
  const listeners = new Set<() => void>();

  let enabled = false;
  let online = true;
  let running: Promise<void> | null = null;
  let queued: { pull: boolean } | null = null;
  let failures = 0;
  let unsubscribers: (() => void)[] = [];
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;

  const setState = (patch: Partial<SyncState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };

  async function push(): Promise<{ stale: boolean }> {
    let stale = false;
    for (;;) {
      const rows = await store.unsynced(pushBatchSize);
      if (rows.length === 0) return { stale };

      // Snapshot the versions being sent before awaiting, so later edits can't be marked synced.
      const sentAt = new Map(rows.map((row) => [row.clientId, row.updatedAt]));
      const { results } = await transport.batch(rows.map(toPayload));
      // Every status means the server has seen this version; stale ones come back on the pull.
      const marked = await store.markSynced(
        results.flatMap(({ clientId }) => {
          const updatedAt = sentAt.get(clientId);
          return updatedAt ? [{ clientId, updatedAt }] : [];
        }),
      );
      stale ||= results.some((result) => result.status === 'stale');

      // A short page is the end of the outbox. If nothing got marked (every row was edited
      // mid-flight), stop rather than spin; the debounce from those edits pushes them next.
      if (rows.length < pushBatchSize || marked === 0) return { stale };
    }
  }

  async function pull() {
    let cursor = await store.getPullCursor();
    for (;;) {
      const page = await transport.since(cursor);
      const last = page.snippets.at(-1);
      if (last) cursor = { since: last.serverUpdatedAt, afterId: last.id };
      await store.applyRemote(page.snippets, cursor);
      if (!page.hasMore || !last) return;
    }
  }

  async function run(withPull: boolean) {
    setState({ phase: 'syncing' });
    try {
      const { stale } = await push();
      if (withPull || stale) await pull();
      failures = 0;
      setState({ phase: 'idle', lastSyncedAt: new Date() });
    } catch (err) {
      // Signed out mid-run (a 401 lands here too): nothing to retry.
      if (!enabled) return;
      failures += 1;
      setState({ phase: isNetworkError(err) || !online ? 'offline' : 'error' });
      scheduleRetry(withPull);
    }
  }

  function scheduleRetry(withPull: boolean) {
    clearTimeout(retryTimer);
    // While the device is offline, the reconnect trigger is the retry.
    if (!online) return;
    const delay = Math.min(RETRY_BASE_MS * 2 ** (failures - 1), RETRY_MAX_MS);
    retryTimer = setTimeout(() => void sync({ pull: withPull }), delay);
  }

  /** Pushes the outbox, then pulls if asked (or if the server held newer copies). */
  function sync({ pull: withPull = false }: { pull?: boolean } = {}): Promise<void> {
    if (!enabled) return Promise.resolve();
    clearTimeout(debounceTimer);
    clearTimeout(retryTimer);
    if (!online) {
      setState({ phase: 'offline' });
      return Promise.resolve();
    }
    if (running) {
      queued = { pull: withPull || !!queued?.pull };
      return running;
    }

    running = run(withPull).finally(() => {
      running = null;
      const next = queued;
      queued = null;
      if (next && enabled) void sync(next);
    });
    return running;
  }

  async function settle() {
    while (running) await running;
  }

  return {
    getState: () => state,

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },

    /** Starts syncing for the signed-in account: an immediate push + pull, then on every trigger. */
    start() {
      if (enabled) return;
      enabled = true;
      unsubscribers = [
        triggers.onForeground(() => void sync({ pull: true })),
        triggers.onConnectivity((next) => {
          const wasOnline = online;
          online = next;
          if (!next) {
            if (!running) setState({ phase: 'offline' });
          } else if (!wasOnline) {
            void sync({ pull: true });
          }
        }),
      ];
      void sync({ pull: true });
    },

    /** Stops all triggers and timers. A run already in flight finishes but schedules nothing. */
    stop() {
      enabled = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribers = [];
      clearTimeout(debounceTimer);
      clearTimeout(retryTimer);
      queued = null;
      failures = 0;
      online = true;
      setState({ phase: 'idle', lastSyncedAt: null });
    },

    /** Wait for the current run after stopping triggers, before erasing local data. */
    settle,

    sync,

    /** Call after every local snippet write; pushes once writes go quiet. */
    notifyLocalChange() {
      if (!enabled) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => void sync(), debounceMs);
    },

    /** Pushes everything now. Resolves true only if the outbox ended up empty. */
    async flush(timeoutMs = 10_000): Promise<boolean> {
      const work = (async () => {
        await settle();
        await sync();
        await settle();
      })();
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<void>((resolve) => {
        timer = setTimeout(resolve, timeoutMs);
      });
      await Promise.race([work, timeout]);
      clearTimeout(timer);
      return (await store.countUnsynced()) === 0;
    },
  };
}

// Duck-typed so this file doesn't import the API client (and its env checks) at runtime.
function isNetworkError(err: unknown): boolean {
  return (err as { isNetworkError?: boolean } | null)?.isNetworkError === true;
}
