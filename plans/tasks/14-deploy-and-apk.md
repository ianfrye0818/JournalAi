# 14 — Deploy backend & ship the APK

**Goal:** Your phone talks to a hosted API.

## Files
- `backend/Dockerfile`: multi-stage; run `prisma migrate deploy` on start
- Hosting config (recommend Railway or Fly.io: app + Postgres + Redis); prod env vars
- `mobile/eas.json`: preview `EXPO_PUBLIC_API_URL` → prod API
- README "release an APK": `npx eas-cli@latest build -p android --profile preview`
- EAS Update channel for OTA JS fixes

## Acceptance
- The APK installed from the EAS link works end to end on mobile data
- An OTA update reaches the device

## Out of scope
Store listings.
