# 03 — Mobile foundation, design system & EAS

**Goal:** Turn the starter into the JournalAI shell with a clean modern look, building as an APK.

## Files
- `mobile/app.json`: name "JournalAI", slug, scheme `journalai`, `android.package` (e.g. `dev.ianfrye.journalai`), remove web `server` output, splash/icon colors
- `mobile/eas.json`: `development` (developmentClient, apk), `preview` (internal distribution, `android.buildType: apk`), `production` (aab); `EXPO_PUBLIC_API_URL` per profile
- `src/constants/theme.ts`: extend into tokens — colors (warm paper light / ink dark, one accent), spacing, radius, typography scale; fonts via expo-font (Inter for UI, a serif such as Newsreader for entry text)
- `src/components/ui/`: Button, IconButton, Card, TextField, Chip, Screen, EmptyState (themed; follow `themed-text.tsx`)
- `src/app/_layout.tsx` + `src/components/app-tabs.tsx`: tabs Today / Days / Settings; `(auth)` group route stub
- Delete `explore.tsx`, `hint-row`, `web-badge` and other template-only pieces
- Providers: `QueryClientProvider` (@tanstack/react-query), SafeArea, GestureHandler

## Pattern reference
`src/constants/theme.ts`, `src/hooks/use-theme.ts`, `src/components/themed-text.tsx`, `src/components/app-tabs.tsx`

## Acceptance
- `npx expo lint` and `npx tsc --noEmit` clean
- `npx eas-cli@latest build -p android --profile development` produces an installable dev client
- Light and dark both look intentional

## Out of scope
API calls, storage, capture.
