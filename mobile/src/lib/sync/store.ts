import { and, asc, count, eq, inArray, isNull, lt, or } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { PullCursor } from '@/lib/api/types';
import { db } from '@/lib/db/client';
import { kv, snippets } from '@/lib/db/schema';
import type { SyncStore } from '@/lib/sync/engine';
import { fromRemote, shouldApplyRemote } from '@/lib/sync/merge';

const PULL_CURSOR_KEY = 'sync.pullCursor';
const OWNER_KEY = 'sync.ownerId';

const unsyncedWhere = or(isNull(snippets.syncedAt), lt(snippets.syncedAt, snippets.updatedAt));

async function getJson<T>(key: string): Promise<T | null> {
  const row = await db.select().from(kv).where(eq(kv.key, key)).get();
  return row ? (JSON.parse(row.value) as T) : null;
}

async function setJson(key: string, value: unknown, tx: Pick<typeof db, 'insert'> = db) {
  const json = JSON.stringify(value);
  await tx.insert(kv).values({ key, value: json }).onConflictDoUpdate({
    target: kv.key,
    set: { value: json },
  });
}

/** The SQLite side of the sync engine. */
export const syncStore: SyncStore = {
  unsynced: (limit) =>
    db.select().from(snippets).where(unsyncedWhere).orderBy(asc(snippets.updatedAt)).limit(limit),

  async countUnsynced() {
    const [row] = await db.select({ n: count() }).from(snippets).where(unsyncedWhere);
    return row?.n ?? 0;
  },

  async markSynced(rows) {
    let marked = 0;
    await db.transaction(async (tx) => {
      for (const { clientId, updatedAt } of rows) {
        // Matching updatedAt means a local edit made while the push was in flight stays unsynced.
        const updated = await tx
          .update(snippets)
          .set({ syncedAt: updatedAt })
          .where(and(eq(snippets.clientId, clientId), eq(snippets.updatedAt, updatedAt)))
          .returning({ clientId: snippets.clientId });
        marked += updated.length;
      }
    });
    return marked;
  },

  async applyRemote(remote, cursor) {
    await db.transaction(async (tx) => {
      if (remote.length > 0) {
        const local = await tx
          .select({ clientId: snippets.clientId, updatedAt: snippets.updatedAt })
          .from(snippets)
          .where(inArray(snippets.clientId, remote.map((r) => r.clientId)));
        const byId = new Map(local.map((row) => [row.clientId, row]));

        for (const item of remote) {
          if (!shouldApplyRemote(byId.get(item.clientId), item)) continue;
          const { clientId, ...row } = fromRemote(item);
          await tx
            .insert(snippets)
            .values({ clientId, ...row })
            .onConflictDoUpdate({ target: snippets.clientId, set: row });
        }
      }
      if (cursor) await setJson(PULL_CURSOR_KEY, cursor, tx);
    });
  },

  getPullCursor: () => getJson<PullCursor>(PULL_CURSOR_KEY),
};

/** The account whose snippets are on this device; null before the first sign-in. */
export const getSyncOwner = () => getJson<string>(OWNER_KEY);
export const setSyncOwner = (userId: string) => setJson(OWNER_KEY, userId);

/** Live count of snippets waiting to push. */
export function usePendingSnippetCount(): number {
  const { data } = useLiveQuery(db.select({ n: count() }).from(snippets).where(unsyncedWhere));
  return data[0]?.n ?? 0;
}
