# 01 — Backend foundation & Prisma fixes

**Goal:** Clean schema, deps and tooling so every later task builds on solid ground.

## Findings this task fixes
- `DailySession.date @unique` is global → two users can't journal the same date.
- `Question.sessionId @unique` → only one question per day.
- Relations are optional (`DailySession?`) while their FKs are required; no `onDelete: Cascade` (account deletion would fail).
- `source` / `status` are strings with comments instead of enums.
- `redis` and `dotenv` are imported but not declared in package.json (transitive only).
- Jest has no alias mapping for `@src/*` / `@prisma/generated`.
- Stray `backend/generated/` from the first output path; `*.tsbuildinfo` files are tracked in git.
- Swagger title says "Fleet Management API"; `.env.example` uses `//` comments.

## Data model (target)
- `enum SnippetSource { text voice share }`, `enum DayStatus { open interviewing drafted finalized }`
- `User`: + `timezone String @default("UTC")`, `dayRolloverHour Int @default(4)`; `StyleProfile?` (1:1)
- `Snippet`: `source SnippetSource @default(text)`, required `sessionId`, `capturedAt` (no default — device sets it), `updatedAt`, `deletedAt DateTime?`, `@@unique([userId, clientId])`, `@@index([userId, updatedAt])`; drop `mediaUrl`
- `DailySession`: `date DateTime @db.Date`, `status DayStatus @default(open)`, `interviewRound Int @default(0)`, `createdAt`, `updatedAt`, `finalizedAt DateTime?`, `@@unique([userId, date])`
- `Question`: `sessionId` not unique; + `round Int`, `options String[]`, `rationale String?`, `answeredAt DateTime?`, `@@unique([sessionId, round, order])`
- `Entry`: + `title String?`, `tags String[]`, `model String?`, `createdAt`
- `StyleProfile`: `userId String @unique`, `updatedAt`
- All relations required, `onDelete: Cascade`

## Files
- `backend/prisma/schema.prisma`: apply the model above
- `backend/prisma/migrations/`: delete both existing migrations; `prisma migrate reset` + `migrate dev --name init` (**wipes the local dev DB — confirm with user first**)
- Delete `backend/generated/` (**confirm first**); add `*.tsbuildinfo` to `.gitignore` and `git rm --cached` them
- `backend/package.json`: add `dotenv` explicitly; `jest.moduleNameMapper` for `^@src/(.*)$` and `^@prisma/generated$`
- `backend/src/services/prisma.service.ts`: take DATABASE_URL from `ConfigService`; format with prettier
- `backend/src/services/configService/config.schema.ts` + `.env.example`: drop unused DB_HOST/PORT/NAME/USER/PASSWORD and duplicate REDIS_URL; add `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`; `#` comments in .env.example
- `backend/src/config/index.ts`: Swagger title "JournalAI API"
- Remove `backend/src/features/transcribe/` and its import in `app.module.ts`
- `backend/docker-compose.yml` (commit it; remove from .gitignore): postgres:17 + redis:7 for local dev

## cqrs-gen
None.

## Acceptance
- `npm run db:generate && npm run typecheck && npm test && npm run build` all pass
- `npm run dev` boots; `GET /api/health` → `OK`

## Out of scope
Auth, any feature endpoints, mobile.
