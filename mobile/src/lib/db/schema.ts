/**
 * Local SQLite schema. Snippets are the source of truth on the device (the server copy follows via
 * the outbox in Task 07); days and entries are read-through caches of server state.
 *
 * After changing this file, run `npm run db:generate` to write a new migration.
 */

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const snippetSources = ['text', 'voice', 'share'] as const;
export type SnippetSource = (typeof snippetSources)[number];

export const dayStatuses = ['open', 'interviewing', 'drafted', 'finalized'] as const;
export type DayStatus = (typeof dayStatuses)[number];

export const snippets = sqliteTable(
  'snippets',
  {
    /** Generated on the device; the server dedupes on (userId, clientId). */
    clientId: text('client_id').primaryKey(),
    text: text('text').notNull(),
    source: text('source', { enum: snippetSources }).notNull().default('text'),
    capturedAt: integer('captured_at', { mode: 'timestamp_ms' }).notNull(),
    /** `YYYY-MM-DD`, fixed at capture time using the rollover hour. */
    localDate: text('local_date').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
    /** Null, or older than `updatedAt`, means the change still needs pushing. */
    syncedAt: integer('synced_at', { mode: 'timestamp_ms' }),
  },
  (t) => [index('snippets_local_date_idx').on(t.localDate, t.capturedAt)],
);

export const days = sqliteTable('days', {
  localDate: text('local_date').primaryKey(),
  serverId: text('server_id'),
  status: text('status', { enum: dayStatuses }).notNull().default('open'),
  interviewRound: integer('interview_round').notNull().default(0),
  finalizedAt: integer('finalized_at', { mode: 'timestamp_ms' }),
  entryTitle: text('entry_title'),
  /** Server time of the entry's last change; a cached entry older than this is stale. */
  entryUpdatedAt: integer('entry_updated_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  /** When this row was last refreshed from the server. */
  fetchedAt: integer('fetched_at', { mode: 'timestamp_ms' }).notNull(),
});

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  localDate: text('local_date').notNull().unique(),
  title: text('title'),
  body: text('body').notNull(),
  aiDraft: text('ai_draft').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  model: text('model'),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  fetchedAt: integer('fetched_at', { mode: 'timestamp_ms' }).notNull(),
});

/** Device settings and sync cursors. Values are JSON-encoded. */
export const kv = sqliteTable('kv', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type Snippet = typeof snippets.$inferSelect;
export type Day = typeof days.$inferSelect;
export type Entry = typeof entries.$inferSelect;
