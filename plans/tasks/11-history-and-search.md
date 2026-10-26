# 11 — Days history & search

**Goal:** Browse past days and read entries.

## Files
- `src/app/(tabs)/days.tsx`: month calendar strip + list, status dots, streak count
- `src/app/day/[date]/index.tsx`: read entry, snippets toggle, actions (edit / reopen / export)
- Search bar → `GET /entries?q`
- Cache finalized entries in local SQLite for offline reading and export

## Acceptance
- Past days load offline once cached
- Search returns matches

## Out of scope
Export implementation.
