# 09 — Draft, edit, finalize & style profile (backend)

**Goal:** The AI writes the entry in your voice; you edit and finalize.

## cqrs-gen (run in `backend/`)
```
cqrs-gen --name DraftEntry         --out ./src/features/days          --type command
cqrs-gen --name FinalizeDay        --out ./src/features/days          --type command
cqrs-gen --name ReopenDay          --out ./src/features/days          --type command
cqrs-gen --name ListDays           --out ./src/features/days          --type query
cqrs-gen --name UpdateEntry        --out ./src/features/entries       --type command
cqrs-gen --name SearchEntries      --out ./src/features/entries       --type query
cqrs-gen --name GetStyleProfile    --out ./src/features/style-profile --type query
cqrs-gen --name UpsertStyleProfile --out ./src/features/style-profile --type command
```

## Files
- `src/features/days/prompts/draft.prompt.ts`: snippets in chronological order + answered questions + style samples/notes; prompt-cache the style block; output `{title, body (markdown), tags[]}`
- `src/features/style-profile/{style-profile.module,style-profile.controller}.ts`; wire up entries controller

## Logic
- `DraftEntry` upserts Entry (`aiDraft = body = output`); regenerating with `feedback` keeps the previous body in context; status → `drafted`
- `FinalizeDay` requires an entry; sets `finalizedAt`. `ReopenDay` → `drafted`

## API
```
GET   /api/days?from&to                → [{date,status,snippetCount,entryTitle}]
POST  /api/days/:date/draft {feedback?} → entry
POST  /api/days/:date/finalize          → day
POST  /api/days/:date/reopen            → day
PATCH /api/entries/:id {title?,body?,tags?} → entry
GET   /api/entries?q&from&to            → entries
GET   /api/style-profile ; PUT /api/style-profile {samples,notes}
```

## Acceptance
- Specs for status transitions and ownership
- Regenerating with feedback changes the tone
- Search matches title/body (ILIKE; full-text search is backlog)

## Out of scope
Mobile.
