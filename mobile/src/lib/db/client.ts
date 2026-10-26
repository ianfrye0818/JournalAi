import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';

import migrations from './migrations/migrations';
import * as schema from './schema';

export const DATABASE_NAME = 'journalai.db';

// The change listener is what lets drizzle's useLiveQuery re-run when a table is written.
const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
expoDb.execSync('PRAGMA journal_mode = WAL');

export const db = drizzle(expoDb, { schema });

/** Applies pending migrations on launch. Render nothing that touches `db` until `success`. */
export function useDatabaseMigrations() {
  return useMigrations(db, migrations);
}

/** Deletes every local row, e.g. when the account on this device changes. */
export async function clearLocalData() {
  await db.transaction(async (tx) => {
    await tx.delete(schema.snippets);
    await tx.delete(schema.days);
    await tx.delete(schema.entries);
    await tx.delete(schema.kv);
  });
}
