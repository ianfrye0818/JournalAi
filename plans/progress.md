# Progress

Last updated: 2026-10-26 (end of session). To resume, open a new thread with `plans/_context.md`, this file, and the next task file.

## Status

| Task | Status |
| --- | --- |
| 01–11 (foundation, auth, capture, voice, sync, AI interview, draft/finalize, end-of-day flow, history/search) | Done, committed (latest `b1a4a8e`) |
| 12 Markdown export | Code complete, **uncommitted**, not yet tested on a device |
| 13 Settings: style, rollover, reminders, account | Not started (some backend groundwork exists) |
| 14 Deploy backend & ship APK | Not started |
| 15 Backlog | Unscheduled |

## Task 12: what's done

The Task 12 code is in the working tree and hasn't been committed. Typecheck and lint are clean, and all 95 mobile tests pass.

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

## Next: Task 13 (`plans/tasks/13-settings-style-reminders.md`)

Already in place:
- **Backend:** `style-profile` has a Get feature and an Upsert feature (`PUT /style-profile`).
- **Backend auth:** has GetMe, Login, Logout, and Register. **Still missing: `UpdateMe` (`PATCH /auth/me`) and `DeleteAccount` (`DELETE /auth/me`).** Generate them with `cqrs-gen`, as the task file says.
- **Mobile:** `src/lib/settings.ts` has `getRolloverHour` / `useRolloverHour` / `setRolloverHour`, and the `kv` table holds settings.

Still to do:
- **Settings rows are hardcoded.** "New day starts at 4:00 AM" and "Writing style: Not set" in `src/app/(tabs)/settings.tsx` aren't wired up yet.
- **Sub-screens:**
  - writing style (paste 1–3 entries plus notes)
  - rollover hour and timezone, which syncs to the server and the local kv
  - evening reminder (`expo-notifications`; needs an Android channel; check the v58 docs)
  - account deletion
- **Account deletion must cascade.** Every model has a `userId` relation, so check `onDelete: Cascade` in the schema. Also clear the Redis tokens and wipe local data.
- **New Export card in Settings.** The new screens should sit alongside the "Obsidian export" card added in Task 12.

## Then: Task 14 (`plans/tasks/14-deploy-and-apk.md`)
- No `backend/Dockerfile` yet.
- `mobile/eas.json` preview and production still point at `https://CHANGE-ME.example.com/api`.
- The hosting pick (Railway or Fly.io) was deferred to this task; record it in `_decisions.md`.

## Housekeeping
- **Test account:** a dev test account is saved in the repo-root `test-account.local.md`. Delete it before the final build.
- **Context file:** `plans/_context.md` "What exists" has a Task 12 entry. Add one after each task.
