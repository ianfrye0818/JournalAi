# 07 — Snippet sync (backend + mobile)

**Goal:** The device pushes its outbox reliably and can restore from the server.

## cqrs-gen (run in `backend/`)
```
cqrs-gen --name SyncSnippets      --out ./src/features/snippets --type command
cqrs-gen --name GetSnippetsSince  --out ./src/features/snippets --type query
```

## Backend
- `SyncSnippets`: upsert `DailySession` by `(userId, localDate)`, then upsert each snippet by `(userId, clientId)` only if `incoming.updatedAt > stored.updatedAt`; max 200 per batch; per-item result
- `GET /snippets?since=ISO`

```
POST /api/snippets/batch {snippets:[{clientId,text,source,capturedAt,localDate,updatedAt,deletedAt?}]}
  → {results:[{clientId,id,status}]}
GET  /api/snippets?since=ISO → changed snippets
```

## Mobile
- `src/lib/sync/engine.ts`: push unsynced (`syncedAt` null or < `updatedAt`) on snippet write (debounced), app foreground (AppState), and reconnect (`@react-native-community/netinfo`); pull since `lastPulledAt` after sign-in
- Sync status indicator in the Today header

## Acceptance
- Specs: duplicate batch is idempotent; stale update ignored; same clientId across users stays isolated
- 20 offline snippets sync once back online
- Reinstall + sign-in restores snippets

## Out of scope
Entries/days sync (Task 11 uses TanStack Query).
