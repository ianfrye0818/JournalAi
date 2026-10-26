# JournalAI — Implementation Context

> Paste this file at the start of every implementation thread, along with the task file you're working on.

## Goal
During the day, capture quick text or voice snippets in under 3 seconds, even offline. At night, an AI
agent reads the day's snippets, asks a few clarifying questions (tap a suggested answer, type your own,
or skip), and drafts a journal entry in your voice. You edit it, finalize the day, and export it as
markdown into an Obsidian vault.

Phase 1: Android APK through EAS (preview profile). Later: Play Store, App Store, home-screen widget.

## Stack
- **backend/**: NestJS 12, @nestjs/cqrs, Prisma 7.10 (`prisma-client` generator → `src/generated/prisma`,
  import as `@prisma/generated`), Postgres via `@prisma/adapter-pg`, Redis via `RedisService` (ioredis), Zod config,
  TypeScript 6. Prisma config: `backend/prisma7.config.ts` (holds DATABASE_URL; the schema has no url).
- **mobile/**: Expo SDK 58, RN 0.88, React 19.3, Expo Router (typed routes), React Compiler on.
  ALWAYS check https://docs.expo.dev/versions/v58.0.0/ — never write Expo APIs from memory.
  Add deps with `npx expo install`. Native modules → dev build (`eas build --profile development`).
- **AI**: Anthropic API, server side only. Default model `claude-sonnet-5-5`, configurable through `ANTHROPIC_MODEL`.
  Load the `claude-api` skill before writing AI code.

## Conventions
- Backend features: `src/features/<name>/<name>.module.ts` + controller. Each use case is a cqrs-gen folder:
  `cqrs-gen --name <PascalName> --out ./src/features/<name> --type command|query` →
  `<Name>/{.request,.response,.command|.query,.handler,.handler.spec}.ts`. Register handlers in the module's `providers`.
  Reference slice (after Task 02): `src/features/auth/Register/`.
- Controllers only dispatch via `CommandBus`/`QueryBus`. DTOs need class-validator decorators (global
  `whitelist` + `forbidNonWhitelisted`).
- Shared infra goes in `src/services/` (registered in `globalservices.module.ts`, `@Global`).
- Every query is scoped by `userId` from `@CurrentUser()`. Never trust a userId from the body.
- Auth: opaque bearer tokens (`Authorization: Bearer <token>`), stored hashed in Redis. No cookies, no JWT.
- Mobile: theme tokens in `src/constants/theme.ts`, read through `useTheme()`; themed primitives in `src/components/`.
  Routes in `src/app` only. Data/sync code in `src/lib/`.
- Dates: a "day" is a local calendar date string `YYYY-MM-DD`, computed on the device using the
  rollover hour (default 4am, so a 1am snippet belongs to the previous day). Sent with every snippet.
  The server stores it as `@db.Date` and never derives it from UTC.

## What exists
- Bootstrap/config: `backend/src/main.ts`, `src/config/index.ts` (CORS, ValidationPipe, Swagger, filters).
- Global services: Prisma, Redis, Config, Email, AppLogger (`src/services/`).
- `AuthGuard` + `@Public()` (session-based; Task 02 replaces it). Not registered globally.
- Stub modules: snippets, days, entries, questions, transcribe (transcribe is removed in Task 01), health.
- Mobile shell (after Task 03): `(tabs)` Today/Days/Settings, `(auth)/sign-in` stub, UI kit in `src/components/ui/`, `eas.json`.
- Local DB (after Task 05): `src/lib/db/` (drizzle schema/client/migrations; `npm run db:generate`), `src/lib/dates.ts`
  (`localDate`), `src/lib/snippets/repo.ts` (`snippetsRepo`, `useSnippetsByDate`), kv settings in `src/lib/settings.ts`,
  `capture` modal route.
- Snippet sync (after Task 07): `POST /api/snippets/batch`, `GET /api/snippets?since&afterId` (backend
  `src/features/snippets/`). `Snippet.clientUpdatedAt` is the device clock used for last-write-wins; `updatedAt`
  is the server clock and the pull cursor. Mobile `src/lib/sync/` (`syncEngine`, started/stopped by the auth
  context; `snippetsRepo` writes call `notifyLocalChange()`). Sign-out flushes, then wipes only if the outbox is
  empty; kv `sync.ownerId` wipes leftovers when a different account signs in.
- AI interview (after Task 08): global `AnthropicService.generateStructured({label, system, messages, schema})`
  (`src/services/anthropic.service.ts`): structured outputs + Zod validation, one retry on unusable output, then 502.
  `GET /api/days/:date`, `POST /api/days/:date/interview` (max 2 rounds), `PATCH /api/questions/:id`. Prompt in
  `src/features/days/prompts/interview.prompt.ts`. Shared DTOs: `QuestionResponse`, `EntryResponse`, `DayDateParams`.
- Obsidian export (after Task 12): `mobile/src/lib/export/` — `markdown.ts` (render + filename template), `vault.ts`
  (SAF folder picked via `Directory.pickDirectoryAsync`, Android only; last-written hash per day in kv `export.last.<date>`
  → confirm before replacing a file edited in Obsidian), `share.ts`/`zip.ts` (share one day / zip a month),
  `actions.ts` (dialogs; `autoExportFinalized` runs from `useFinalizeDay`). Prefs in kv `settings.export.*`.

- Settings (after Task 13): `PATCH /api/auth/me` updates timezone/rollover; `DELETE /api/auth/me` revokes all tokens and cascades user data. Mobile `src/app/settings/` has style/day/reminder screens; `src/lib/reminders.ts` owns a daily local notification and Android channel. Profile refresh restores rollover into local kv; account deletion drains sync before wiping local data. Reminders use phone-local best-effort delivery and are cancelled on sign-out/deletion.

## Gotchas
- Path aliases: Nest CLI rewrites them at build time, but Jest does not → `jest.moduleNameMapper` is required.
- After any schema change, run `npm run db:generate`. The generated client is gitignored.
- Snippet sync must be idempotent on `(userId, clientId)`; retries are normal.
- Expo Go cannot run speech recognition or the widget → use a dev build.
- Android SAF folder access returns `content://` URIs. Writing uses the SAF API, not plain paths.
- Never call the Anthropic API from the app. The key lives only in backend env.
