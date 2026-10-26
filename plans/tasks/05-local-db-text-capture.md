# 05 — Local database & text capture (Today screen)

**Goal:** Instant offline text snippets with a timeline for today.

## Files
- `npx expo install expo-sqlite`; add `drizzle-orm` + `drizzle-kit` (expo driver; inline-import `.sql` migrations)
- `src/lib/db/{schema.ts, client.ts, migrations/}`: `snippets` (clientId uuid pk, text, source, capturedAt, localDate, updatedAt, deletedAt, syncedAt), days cache, entries cache, kv settings
- `src/lib/dates.ts`: `localDate(now, rolloverHour)` + unit tests
- `src/lib/snippets/repo.ts`: add / edit / soft-delete, `listByDate` (useLiveQuery)
- `src/app/(tabs)/index.tsx` Today: header (date, count), timeline cards (time, source icon), composer pinned to the bottom (multiline, send), long-press edit/delete, haptics
- `src/app/capture.tsx`: modal quick-capture route, deep-linkable as `journalai://capture` (the widget reuses it later)

## Acceptance
- Airplane mode → add / edit / delete works and persists across restarts
- A 1am snippet lands on the previous day with the default rollover

## Out of scope
Network sync, voice.
