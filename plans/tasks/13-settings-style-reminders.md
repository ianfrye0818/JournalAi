# 13 — Settings: writing style, day rollover, reminders, account

**Goal:** Personalize the AI and nudge you to journal.

## cqrs-gen (run in `backend/`)
```
cqrs-gen --name UpdateMe      --out ./src/features/auth --type command
cqrs-gen --name DeleteAccount --out ./src/features/auth --type command
```

## Files
- `src/app/(tabs)/settings.tsx` + sub-screens:
  - Writing style: paste 1–3 past entries + notes → `PUT /style-profile`
  - Day rollover hour + timezone → `PATCH /auth/me`
  - Evening reminder: expo-notifications local daily notification at a chosen time (Android channel)
  - Account: email, logout, delete account → `DELETE /auth/me` (cascades; required for the Play Store)

## Acceptance
- Reminder fires at the set time
- Style notes visibly change the next draft
- Deleting the account removes all server data

## Out of scope
Email verification / password reset.
