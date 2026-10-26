# Progress

Last updated: 2026-10-26 (end of session). To resume, open a new thread with `plans/_context.md`, this file, and the next task file.

## Status

| Task | Status |
| --- | --- |
| 01–11 (foundation, auth, capture, voice, sync, AI interview, draft/finalize, end-of-day flow, history/search) | Done, committed (latest `b1a4a8e`) |
| 12 Markdown export | Committed (`59dff34`), not yet tested on a device |
| 13 Settings: style, rollover, reminders, account | Code complete, uncommitted; device/live-server acceptance pending |
| 14 Deploy backend & ship APK | Not started |
| 15 Backlog | Unscheduled |

## Task 12: what's done

The Task 12 code was committed as `59dff34`. Typecheck and lint are clean, and all 95 mobile tests pass.

- `mobile/src/lib/export/`
  - `markdown.ts`: frontmatter, title, body, optional `## Snippets`, and the filename template (default `YYYY-MM-DD`).
  - `vault-plan.ts`: create/overwrite/unchanged/conflict logic and the SAF URI label.
  - `vault.ts`: the SAF folder picker and vault writes. Each write saves a hash in kv `export.last.<date>`.
  - `share.ts`, `zip.ts`: share one day as `.md`, or a month as a zip.
  - `days.ts`: loads export data from the cache and local snippets.
  - `settings.ts`: preferences in kv `settings.export.*`.
  - `actions.ts`: the dialogs, plus `autoExportFinalized`, which `useFinalizeDay` calls.
- UI changes:
  - The day page's Export button now works.
  - The Days tab has an "Export {Month}" zip button.
  - `components/settings/export-settings.tsx` adds an "Obsidian export" card in Settings.
- New dependencies: `expo-file-system`, `expo-sharing`, and `jszip`. `expo-sharing` was also added to the `app.json` plugins.

### Before calling Task 12 done
1. **Rebuild the dev client.** There are new native modules: `eas build --profile development`.
2. **Check the acceptance criteria on an Android phone:**
   - Pick the Obsidian daily-notes folder in Settings, finalize a day, and confirm the note appears in Obsidian.
   - Export a month from Days and confirm the zip opens with the right files.
   - Edit a note in Obsidian, then use Export → Save to vault on that day. You should get the replace prompt.
3. **Commit** (e.g. `/commit`).

### Known limits (by design, see the comments in `vault.ts`)
- **Vault folder is Android-only.** On iOS a picked folder only lasts for the session, so iOS uses share and zip.
- **Overwrites delete and recreate the file.** Some SAF providers don't truncate files opened in "w" mode.
- **Notes are written as `application/octet-stream`.** This stops Android from renaming them to `.md.txt`.
- **Files are matched by name from the decoded URI.** This works for vaults on phone storage, but not for cloud providers with opaque IDs.
- **The month zip only includes finalized days.**

## Task 13: what's done

- Generated and implemented `UpdateMe` (`PATCH /auth/me`) and `DeleteAccount` (`DELETE /auth/me`).
- Rollover hour is validated as an integer from 0–23; timezone is validated as an IANA timezone.
- Deletion revokes all Redis tokens, then deletes the user. All user-owned Prisma relations already have `onDelete: Cascade`; no schema migration was needed. If Redis fails, data is retained. If the database fails after revocation, sign in again to retry.
- Added protected Settings sub-screens for writing style, rollover/timezone, and evening reminders, alongside the existing export card.
- Writing style loads/saves samples and notes through `/style-profile`. The existing draft handler already includes them in its system prompt.
- Rollover saves to the server and local kv; login and cold-start profile refresh also restore the server value. Existing snippets keep their date. Capture dates remain based on the device's local calendar, as designed.
- Added `expo-notifications` and its config plugin. Reminders use one stable daily notification ID, an Android channel, notification permission checks, and a chosen local HH:MM time. Turn off cancels it. Android delivery uses best-effort timing and may be delayed by battery settings.
- Sign-out cancels the reminder. Confirmed account deletion stops and waits for sync, deletes the server account, then clears local journal data, token, and query cache. Exported vault files remain untouched.
- Verification: mobile typecheck + lint clean, **99 tests pass**; backend typecheck + auth lint clean, **92 tests pass**. New tests cover profile validation/scoping, token revocation/deletion, and reminder scheduling/permission/disable behavior.

### Before calling Task 13 fully accepted

1. Rebuild the development client for the new notifications native module.
2. On Android, enable a reminder a few minutes ahead; check foreground/background delivery, changed time, turn off, and sign-out cancellation.
3. Save distinct style notes, generate the next draft, and confirm the writing changes.
4. Change rollover/timezone, relaunch/sign in, and confirm the setting persists and new snippets use the expected day.
5. With a disposable account on a live server, delete it; verify every related database row and Redis token is removed, local data is cleared, and the old token is rejected. Unit tests use mocks; live cascade deletion has not been exercised here.
6. Commit Task 13 when reviewed.

## Then: Task 14 (`plans/tasks/14-deploy-and-apk.md`)
- No `backend/Dockerfile` yet.
- `mobile/eas.json` preview and production still point at `https://CHANGE-ME.example.com/api`.
- The hosting pick (Railway or Fly.io) was deferred to this task; record it in `_decisions.md`.

## Housekeeping
- **Test account:** a dev test account is saved in the repo-root `test-account.local.md`. Delete it before the final build.
- **Context file:** `plans/_context.md` "What exists" has a Task 12 entry. Add one after each task.
