import type { RemoteSnippet } from '@/lib/api/types';
import type { Snippet } from '@/lib/db/schema';

import { fromRemote, isUnsynced, shouldApplyRemote, toPayload } from './merge';

const at = (iso: string) => new Date(iso);

const row = (overrides: Partial<Snippet> = {}): Snippet => ({
  clientId: 'c-1',
  text: 'Coffee with Sam',
  source: 'text',
  capturedAt: at('2026-10-26T14:00:00Z'),
  localDate: '2026-10-26',
  updatedAt: at('2026-10-26T14:00:00Z'),
  deletedAt: null,
  syncedAt: null,
  ...overrides,
});

const remote = (overrides: Partial<RemoteSnippet> = {}): RemoteSnippet => ({
  id: 's-1',
  clientId: 'c-1',
  text: 'Coffee with Sam',
  source: 'text',
  capturedAt: '2026-10-26T14:00:00.000Z',
  localDate: '2026-10-26',
  updatedAt: '2026-10-26T14:00:00.000Z',
  deletedAt: null,
  serverUpdatedAt: '2026-10-26T14:00:01.000Z',
  ...overrides,
});

describe('isUnsynced', () => {
  it('is true for a row never pushed', () => {
    expect(isUnsynced(row())).toBe(true);
  });

  it('is true when edited after the last push', () => {
    expect(isUnsynced(row({ syncedAt: at('2026-10-26T13:00:00Z') }))).toBe(true);
  });

  it('is false once syncedAt catches up', () => {
    expect(isUnsynced(row({ syncedAt: at('2026-10-26T14:00:00Z') }))).toBe(false);
  });
});

describe('shouldApplyRemote', () => {
  it('takes snippets the device has never seen', () => {
    expect(shouldApplyRemote(undefined, remote())).toBe(true);
  });

  it('takes a newer remote edit', () => {
    expect(shouldApplyRemote(row(), remote({ updatedAt: '2026-10-26T15:00:00.000Z' }))).toBe(true);
  });

  it('takes the same version so the row is marked synced', () => {
    expect(shouldApplyRemote(row(), remote())).toBe(true);
  });

  it('keeps a newer local edit for the next push', () => {
    expect(shouldApplyRemote(row({ updatedAt: at('2026-10-26T16:00:00Z') }), remote())).toBe(false);
  });
});

describe('payload mapping', () => {
  it('round-trips a deleted snippet through the wire format', () => {
    const local = row({ deletedAt: at('2026-10-26T15:00:00Z'), updatedAt: at('2026-10-26T15:00:00Z') });
    const wire = toPayload(local);

    expect(wire).toEqual({
      clientId: 'c-1',
      text: 'Coffee with Sam',
      source: 'text',
      capturedAt: '2026-10-26T14:00:00.000Z',
      localDate: '2026-10-26',
      updatedAt: '2026-10-26T15:00:00.000Z',
      deletedAt: '2026-10-26T15:00:00.000Z',
    });
    expect(fromRemote({ ...wire, id: 's-1', serverUpdatedAt: wire.updatedAt })).toEqual({
      ...local,
      syncedAt: local.updatedAt,
    });
  });
});
