import type { RemoteSnippet, SnippetPayload } from '@/lib/api/types';
import type { Snippet } from '@/lib/db/schema';

/** Null, or older than `updatedAt`, means the change still needs pushing. */
export function isUnsynced(row: Pick<Snippet, 'updatedAt' | 'syncedAt'>): boolean {
  return !row.syncedAt || row.syncedAt.getTime() < row.updatedAt.getTime();
}

/**
 * Last write wins on the device clock, same as the server. A tie means the server already has
 * this version, so taking the remote copy just marks it synced. A newer local edit is kept and
 * the next push sends it.
 */
export function shouldApplyRemote(
  local: Pick<Snippet, 'updatedAt'> | undefined,
  remote: Pick<RemoteSnippet, 'updatedAt'>,
): boolean {
  return !local || new Date(remote.updatedAt).getTime() >= local.updatedAt.getTime();
}

export function toPayload(row: Snippet): SnippetPayload {
  return {
    clientId: row.clientId,
    text: row.text,
    source: row.source,
    capturedAt: row.capturedAt.toISOString(),
    localDate: row.localDate,
    updatedAt: row.updatedAt.toISOString(),
    deletedAt: row.deletedAt?.toISOString() ?? null,
  };
}

/** A pulled snippet as a local row, already in sync with the server. */
export function fromRemote(remote: RemoteSnippet): Snippet {
  const updatedAt = new Date(remote.updatedAt);
  return {
    clientId: remote.clientId,
    text: remote.text,
    source: remote.source,
    capturedAt: new Date(remote.capturedAt),
    localDate: remote.localDate,
    updatedAt,
    deletedAt: remote.deletedAt ? new Date(remote.deletedAt) : null,
    syncedAt: updatedAt,
  };
}
