# Progress

Last updated: 2026-10-26 (end of session). To resume, open a new thread with `plans/_context.md`, this file, and the next task file.

## Status

| Task | Status |
| --- | --- |
| 01–11 (foundation, auth, capture, voice, sync, AI interview, draft/finalize, end-of-day flow, history/search) | Done, committed (latest `b1a4a8e`) |
| 12 Markdown export | Committed (`59dff34`), not yet tested on a device |
| 13 Settings: style, rollover, reminders, account | Committed (`957fc1c`); device/live-server acceptance pending |
| Extras (unplanned, see below) | Committed through `d7e001c`, plus a review-fix pass; device testing pending |
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

## Extras done outside the task list (with Codex), reviewed 2026-10-26

- **Snippet actions:** swipe right to edit and left to delete, replacing long press (`snippet-card.tsx`). Screen readers get the same actions through accessibility actions.
- **Capture into a finalized day** (`lib/days/after-capture.ts`): prompts to keep the day finalized or reopen it into the draft.
- **Time format:** a 12h/24h setting (`lib/time.ts`, kv `settings.timeFormat`), used for snippet times, rollover and reminders. It is cached in memory and the cache resets on any `kv` change.
- **Email:** `EmailService` now uses the Resend HTTP API (`RESEND_API_KEY`, `FROM_EMAIL`); nodemailer and the SMTP settings are gone.
- **Monthly recap email** (`features/monthly-summary/`): an hourly cron sends an AI recap of last month at 9am on the 1st in each user's timezone.
  - **Opt-in:** controlled by `User.monthlyRecap` (default false) and toggled in Settings.
  - **Unsubscribe:** each email has a "Stop these emails" link and `List-Unsubscribe` headers that point to the public `/api/monthly-summary/unsubscribe?id=<recap id>`. GET shows a confirm page and POST unsubscribes.
  - **Delivery:** it is sent once per month, coordinated with database leases and Resend idempotency keys.
- **Android home-screen widget** (`modules/snippet-widget`, a local Expo module): shows today's snippet count and has Type and Dictate buttons (`journalai://capture` and `journalai://capture?dictate=1`). It reads the SQLite file read-only, and the app refreshes it through `useSnippetWidget`.
- **Password reset:** "Forgot password?" on sign-in opens `(auth)/forgot-password`, which emails a 6-digit code (`POST /auth/password/forgot`). Entering the code and a new password (`POST /auth/password/reset`) signs out every other device and signs in. See `backend/README.md` for the limits.
- **Share-sheet capture (Android):** `expo-share-intent` with a `text/*` filter. `useShareCapture` in the root layout opens Quick capture prefilled with the shared text, or the page title plus the link, and saves it with `source: 'share'`. The iOS extension is disabled (`disableIOS`) until there's an iOS build.
- **Mood:** the draft step now also returns a 1–3 word `mood`. It is stored on `Entry.mood`, can be edited or cleared through `PATCH /entries/:id`, appears as a chip next to the tags, and is written to the export frontmatter as `mood: "..."`. Entries drafted before this change have no mood until they are redrafted.

### Before calling the extras done
1. Run `npx prisma migrate deploy` (adds `monthly_summary`, `user.monthlyRecap` and `entry.mood`).
2. Rebuild the dev client (new local native module).
3. On Android, add the widget and check that the count updates after capture, sync, sign-out, and the rollover hour. Also check that tapping the widget opens capture.
4. Test swiping on Today and Review, and capturing into a finalized day (both the keep and reopen paths).
5. Reset the test account's password from the sign-in screen. Check that the email arrives, that a wrong code is rejected, and that the old session on any other device is signed out.
6. Share a link from Chrome and some text from another app to JournalAI. Check that Quick capture opens prefilled, and that sharing while signed out works after you sign in.
7. Draft a day and check the mood chip and the `mood:` line in the exported note.
8. Opt a test account into the recap, call `MonthlySummaryService.run()` with a date on the 1st, and confirm the email arrives. Then confirm that its unsubscribe link and Gmail's one-click unsubscribe both turn the setting off.

## Then: Task 14 (`plans/tasks/14-deploy-and-apk.md`)
- No `backend/Dockerfile` yet.
- `mobile/eas.json` preview and production still point at `https://CHANGE-ME.example.com/api`.
- The hosting pick (Railway or Fly.io) was deferred to this task; record it in `_decisions.md`.

## Housekeeping
- **Test account:** a dev test account is saved in the repo-root `test-account.local.md`. Delete it before the final build.
- **Context file:** `plans/_context.md` "What exists" has a Task 12 entry. Add one after each task.
