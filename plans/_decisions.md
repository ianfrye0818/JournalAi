# Decisions (append-only)

Format: `date: decision — why`. Add new entries at the bottom; don't edit old ones (supersede them instead).

- 2026-10-26: Real accounts with opaque bearer tokens stored hashed (sha256) in Redis (sliding 90-day TTL); remove express-session/connect-redis/redis. — Ready for public release; RN cookie handling is flaky; instant revocation via key delete. Rejected: cookie sessions (RN cookie jar issues), JWT access+refresh (more moving parts, hard to revoke without a Redis denylist anyway), single-user API key (redo later).
- 2026-10-26: Passwords hashed with @node-rs/argon2. — Prebuilt binaries, no node-gyp. Rejected: bcrypt (native build pain).
- 2026-10-26: Offline-first capture: expo-sqlite + drizzle-orm locally, outbox sync to POST /snippets/batch, device wins on conflicts (last updatedAt). — Capture can never fail; the widget needs local writes. Rejected: online-only (fails without signal), WatermelonDB (heavy, its own sync protocol).
- 2026-10-26: Voice uses on-device speech-to-text (expo-speech-recognition); no audio stored. — Free, instant, private. Snippet.mediaUrl and TranscribeModule removed. Rejected: server Whisper (cost + storage).
- 2026-10-26: The device decides the day (YYYY-MM-DD with a rollover hour, default 4am). — Timezones and late nights; the server can't know local time reliably.
- 2026-10-26: Interview runs in rounds: the AI returns 0–5 questions per round, each with 2–4 suggested answers, plus readyToDraft. Max 2 rounds. — Bounded cost and latency, and still lets the agent follow up. Rejected: free-form chat agent (unbounded, harder UI), single fixed batch (can't follow up).
- 2026-10-26: Structured AI output via tool use / JSON schema, validated with Zod on the server. — Typed results; no fragile parsing.
- 2026-10-26: Default model claude-sonnet-5-5, overridable via ANTHROPIC_MODEL. — Good writing quality at reasonable cost.
- 2026-10-26: Markdown is built on the device from cached entries. — Export works offline; one formatter. Rejected: server-rendered markdown endpoint.
- 2026-10-26: Obsidian export via an SAF-picked vault folder (auto-write on finalize), plus single-day share and range zip (jszip + expo-sharing). If the vault file changed since the last export, ask before overwriting.
- 2026-10-26: Mobile styling extends the template's theme.ts + StyleSheet + useTheme pattern with tokens. — Follows the existing pattern. Rejected: NativeWind/Tamagui (new pattern, extra build config).
- 2026-10-26: Server state uses TanStack Query; local data uses drizzle useLiveQuery. Tokens go in expo-secure-store.
- 2026-10-26: `days` interview/draft routes are POST (the stub comments said GET). — They call the AI and aren't idempotent.
- 2026-10-26: Existing migrations squashed into a fresh init. — Dev-only data; the history drops and recreates tables.
- 2026-10-26: Hosting recommendation: Railway or Fly.io (app + Postgres + Redis). — Final pick deferred to Task 14; doesn't affect earlier tasks.
