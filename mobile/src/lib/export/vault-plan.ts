/**
 * The decisions behind a vault write, kept free of native modules so they can be tested.
 */

export type VaultWritePlan =
  /** No file by that name yet. */
  | 'create'
  /** The file is what we last wrote, so replacing it loses nothing. */
  | 'overwrite'
  /** The file already holds exactly this export. */
  | 'unchanged'
  /** The file changed since our last export (edited in Obsidian), or we never wrote it. */
  | 'conflict';

/**
 * `currentHash` is the file in the vault (null if there is none), `lastHash` what this app last
 * wrote there (null if nothing it remembers), `nextHash` the export about to be written.
 */
export function planVaultWrite({
  currentHash,
  lastHash,
  nextHash,
}: {
  currentHash: string | null;
  lastHash: string | null;
  nextHash: string;
}): VaultWritePlan {
  if (currentHash === null) return 'create';
  if (currentHash === nextHash) return 'unchanged';
  if (currentHash === lastHash) return 'overwrite';
  return 'conflict';
}

/**
 * A readable name for a SAF tree URI, e.g.
 * `content://com.android.externalstorage.documents/tree/primary%3ADocuments%2FVault` → `Documents/Vault`.
 */
export function describeVaultUri(uri: string): string {
  const tree = uri.split('/tree/')[1];
  if (!tree) return uri;
  let id: string;
  try {
    id = decodeURIComponent(tree.split('/')[0]);
  } catch {
    return uri;
  }
  // The ID is `<volume>:<path>`; the primary volume is the phone's own storage.
  const colon = id.indexOf(':');
  if (colon === -1) return id;
  const volume = id.slice(0, colon);
  const path = id.slice(colon + 1);
  if (volume === 'primary') return path || 'Internal storage';
  return path ? `${volume}/${path}` : volume;
}
