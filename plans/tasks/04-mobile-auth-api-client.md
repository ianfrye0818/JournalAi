# 04 — Mobile auth & API client

**Goal:** Sign up / sign in, token persistence, typed API client.

## Files
- `src/lib/api/client.ts`: fetch wrapper (base URL from `EXPO_PUBLIC_API_URL`, `Authorization: Bearer`, JSON, typed `ApiError`, 401 → sign out)
- `src/lib/api/types.ts`: response types matching backend response classes (hand-written; codegen is backlog)
- `src/lib/auth/token-store.ts` (expo-secure-store), `src/lib/auth/auth-context.tsx`
- `src/app/(auth)/sign-in.tsx`, `src/app/(auth)/sign-up.tsx`; redirect logic in `src/app/_layout.tsx` (protected routes — check the v58 Expo Router docs)

## Acceptance
- Fresh install → sign up → lands on Today
- Kill the app → still signed in
- Logout clears the token and local data

## Out of scope
Offline data, snippets.
