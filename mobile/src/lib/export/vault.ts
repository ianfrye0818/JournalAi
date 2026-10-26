import { eq } from 'drizzle-orm';
import { CryptoDigestAlgorithm, digestStringAsync } from 'expo-crypto';
import { Directory, File } from 'expo-file-system';
import { Platform } from 'react-native';

import { db } from '@/lib/db/client';
import { kv } from '@/lib/db/schema';
import { filenameFor, renderMarkdown, type ExportDay } from '@/lib/export/markdown';
import type { ExportSettings } from '@/lib/export/settings';
import { planVaultWrite } from '@/lib/export/vault-plan';

/**
 * Writes days into an Obsidian vault folder picked through Android's Storage Access Framework.
 * The picker grants a persistable permission, so the saved `content://` URI keeps working across
 * restarts until the user revokes it. On iOS a picked folder only lasts for the session, so the
 * vault is Android only and iOS exports through the share sheet.
 */

export const vaultSupported = Platform.OS === 'android';

export class VaultError extends Error {
  constructor(readonly reason: 'not-set' | 'unavailable') {
    super(
      reason === 'not-set'
        ? 'Choose your vault folder in Settings first.'
        : 'Can’t reach your vault folder. Choose it again in Settings.',
    );
    this.name = 'VaultError';
  }
}

/**
 * `application/octet-stream` keeps the name as given. With a text type, some document providers
 * append the type's own extension and save `2026-10-25.md.txt`.
 */
const NOTE_MIME = 'application/octet-stream';

/** Opens the system folder picker. Resolves null if the user backs out. */
export async function pickVaultFolder(current?: string | null): Promise<string | null> {
  try {
    const dir = await Directory.pickDirectoryAsync(current ?? undefined);
    return dir.uri;
  } catch (err) {
    if (err instanceof Error && /cancel/i.test(err.message)) return null;
    throw err;
  }
}

const sha256 = (text: string) => digestStringAsync(CryptoDigestAlgorithm.SHA256, text);

/** What this app last wrote for a day, so an edit made in Obsidian can be told apart from ours. */
type ExportRecord = { vaultUri: string; name: string; hash: string };

const recordKey = (date: string) => `export.last.${date}`;

function readRecord(date: string): ExportRecord | null {
  const row = db.select().from(kv).where(eq(kv.key, recordKey(date))).get();
  if (!row) return null;
  try {
    return JSON.parse(row.value) as ExportRecord;
  } catch {
    return null;
  }
}

async function saveRecord(date: string, record: ExportRecord) {
  const value = JSON.stringify(record);
  await db.insert(kv).values({ key: recordKey(date), value }).onConflictDoUpdate({
    target: kv.key,
    set: { value },
  });
}

export type VaultWriteResult = {
  /** `kept` means the file had changed outside the app and the user chose not to replace it. */
  outcome: 'written' | 'unchanged' | 'kept';
  name: string;
};

/**
 * Writes one day's note into the vault. If the file there changed since this app last wrote it,
 * asks `confirmReplace` before overwriting.
 */
export async function writeDayToVault(
  day: ExportDay,
  settings: ExportSettings,
  confirmReplace: (name: string) => Promise<boolean>,
): Promise<VaultWriteResult> {
  const { vaultUri } = settings;
  if (!vaultSupported || !vaultUri) throw new VaultError('not-set');
  const dir = new Directory(vaultUri);
  if (!dir.exists) throw new VaultError('unavailable');

  const name = filenameFor(settings.filenameTemplate, day.date);
  const content = renderMarkdown(day, { includeSnippets: settings.includeSnippets });
  // SAF URIs can't be joined like paths, so find the file by name. `File.name` comes from the
  // decoded URI, which ends in the file name on local storage (document IDs like
  // `primary:Vault/2026-10-25.md`); providers with opaque IDs wouldn't match.
  const existing = dir.list().find((f): f is File => f instanceof File && f.name === name);
  const [nextHash, currentHash] = await Promise.all([
    sha256(content),
    existing ? existing.text().then(sha256) : null,
  ]);
  const record = readRecord(day.date);
  const lastHash = record?.vaultUri === vaultUri && record.name === name ? record.hash : null;

  const plan = planVaultWrite({ currentHash, lastHash, nextHash });
  if (plan === 'conflict' && !(await confirmReplace(name))) return { outcome: 'kept', name };
  if (plan !== 'unchanged') {
    // SAF writes open the file in "w" mode, which some providers don't truncate, so a shorter
    // export would keep the old file's tail. Replace the file instead of writing over it.
    existing?.delete();
    await dir.createFile(name, NOTE_MIME).write(content);
  }
  await saveRecord(day.date, { vaultUri, name, hash: nextHash });
  return { outcome: plan === 'unchanged' ? 'unchanged' : 'written', name };
}
