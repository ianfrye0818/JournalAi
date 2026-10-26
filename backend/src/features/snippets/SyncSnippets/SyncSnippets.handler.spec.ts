import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { FakeSnippetPrisma } from '../shared/fake-prisma';
import { SyncSnippetsCommand } from './SyncSnippets.command';
import { SyncSnippetsHandler } from './SyncSnippets.handler';
import { SyncSnippetItem } from './SyncSnippets.request';

const ALICE = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const BOB = '2d6f1d0b-8a3c-4c1e-b7a9-5e0f4c2a9b11';

const item = (overrides: Partial<SyncSnippetItem> = {}): SyncSnippetItem => ({
  clientId: 'c-1',
  text: 'Coffee with Sam',
  source: 'text',
  capturedAt: new Date('2026-10-26T14:00:00Z'),
  localDate: '2026-10-26',
  updatedAt: new Date('2026-10-26T14:00:00Z'),
  ...overrides,
});

describe(SyncSnippetsHandler, () => {
  let handler: SyncSnippetsHandler;
  let prisma: FakeSnippetPrisma;

  const sync = (userId: string, snippets: SyncSnippetItem[]) =>
    handler.execute(new SyncSnippetsCommand(userId, { snippets }));

  beforeEach(async () => {
    prisma = new FakeSnippetPrisma();
    const moduleRef = await Test.createTestingModule({
      providers: [
        SyncSnippetsHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(SyncSnippetsHandler);
  });

  it('creates new snippets under the day session for their localDate', async () => {
    const { results } = await sync(ALICE, [
      item(),
      item({ clientId: 'c-2', localDate: '2026-10-25' }),
    ]);

    expect(results.map((r) => r.status)).toEqual(['created', 'created']);
    expect(prisma.sessions.map((s) => s.date.toISOString())).toEqual([
      '2026-10-26T00:00:00.000Z',
      '2026-10-25T00:00:00.000Z',
    ]);
    const stored = prisma.find(ALICE, 'c-1')!;
    expect(stored.sessionId).toBe(prisma.sessions[0].id);
    expect(stored.clientUpdatedAt).toEqual(item().updatedAt);
    expect(results[0].id).toBe(stored.id);
  });

  it('reuses the existing session for a day', async () => {
    await sync(ALICE, [item()]);
    await sync(ALICE, [item({ clientId: 'c-2' })]);

    expect(prisma.sessions).toHaveLength(1);
  });

  it('is idempotent when the same batch is sent twice', async () => {
    const batch = [item(), item({ clientId: 'c-2', text: 'Walked home' })];
    const first = await sync(ALICE, batch);
    const before = structuredClone(prisma.snippets);

    const second = await sync(ALICE, batch);

    expect(second.results).toEqual(
      first.results.map((r) => ({ ...r, status: 'unchanged' })),
    );
    expect(prisma.snippets).toEqual(before);
    expect(prisma.sessions).toHaveLength(1);
  });

  it('applies a newer edit', async () => {
    await sync(ALICE, [item()]);
    const editedAt = new Date('2026-10-26T15:00:00Z');

    const { results } = await sync(ALICE, [
      item({ text: 'Coffee with Sam and Ana', updatedAt: editedAt }),
    ]);

    expect(results[0].status).toBe('updated');
    expect(prisma.find(ALICE, 'c-1')).toMatchObject({
      text: 'Coffee with Sam and Ana',
      clientUpdatedAt: editedAt,
    });
  });

  it('ignores a stale update', async () => {
    const newer = new Date('2026-10-26T16:00:00Z');
    await sync(ALICE, [item({ text: 'Newest text', updatedAt: newer })]);

    const { results } = await sync(ALICE, [
      item({ text: 'Older text', updatedAt: new Date('2026-10-26T15:00:00Z') }),
    ]);

    expect(results[0].status).toBe('stale');
    expect(prisma.find(ALICE, 'c-1')).toMatchObject({
      text: 'Newest text',
      clientUpdatedAt: newer,
    });
    expect(prisma.snippet.updateMany).not.toHaveBeenCalled();
  });

  it('syncs a delete as a newer edit', async () => {
    await sync(ALICE, [item()]);
    const deletedAt = new Date('2026-10-26T17:00:00Z');

    const { results } = await sync(ALICE, [
      item({ updatedAt: deletedAt, deletedAt }),
    ]);

    expect(results[0].status).toBe('updated');
    expect(prisma.find(ALICE, 'c-1')!.deletedAt).toEqual(deletedAt);
  });

  it('keeps the same clientId isolated across users', async () => {
    await sync(ALICE, [item({ text: "Alice's" })]);

    const { results } = await sync(BOB, [
      item({ text: "Bob's", updatedAt: new Date('2026-10-27T00:00:00Z') }),
    ]);

    expect(results[0].status).toBe('created');
    expect(prisma.snippets).toHaveLength(2);
    expect(prisma.find(ALICE, 'c-1')!.text).toBe("Alice's");
    expect(prisma.find(BOB, 'c-1')!.text).toBe("Bob's");
    expect(prisma.find(ALICE, 'c-1')!.sessionId).not.toBe(
      prisma.find(BOB, 'c-1')!.sessionId,
    );
  });

  it('resolves a clientId repeated within one batch to the newest copy', async () => {
    const { results } = await sync(ALICE, [
      item({ text: 'v2', updatedAt: new Date('2026-10-26T15:00:00Z') }),
      item({ text: 'v1', updatedAt: new Date('2026-10-26T14:00:00Z') }),
      item({ text: 'v3', updatedAt: new Date('2026-10-26T16:00:00Z') }),
    ]);

    expect(results.map((r) => r.status)).toEqual([
      'created',
      'stale',
      'updated',
    ]);
    expect(prisma.find(ALICE, 'c-1')!.text).toBe('v3');
  });

  it('falls back to compare-and-update when a concurrent batch created the row first', async () => {
    // Simulate the race: the row appears between our findMany and our create.
    prisma.snippet.findMany.mockResolvedValueOnce([]);
    await sync(ALICE, [item()]);

    prisma.snippet.findMany.mockResolvedValueOnce([]);
    const { results } = await sync(ALICE, [
      item({ text: 'edited', updatedAt: new Date('2026-10-26T15:00:00Z') }),
    ]);

    expect(results[0].status).toBe('updated');
    expect(prisma.snippets).toHaveLength(1);
    expect(prisma.find(ALICE, 'c-1')!.text).toBe('edited');
  });
});
