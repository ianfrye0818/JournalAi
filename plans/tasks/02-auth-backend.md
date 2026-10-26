# 02 — Auth (bearer tokens) — establishes the CQRS reference slice

**Goal:** register / login / logout / me with opaque bearer tokens and a global guard. The `Register` folder becomes the reference implementation for every later backend task.

## cqrs-gen (run in `backend/`)
```
cqrs-gen --name Register --out ./src/features/auth --type command
cqrs-gen --name Login    --out ./src/features/auth --type command
cqrs-gen --name Logout   --out ./src/features/auth --type command
cqrs-gen --name GetMe    --out ./src/features/auth --type query
```

## Files
- `src/features/auth/{auth.module,auth.controller}.ts`; request classes get class-validator decorators (`IsEmail`, `MinLength(10)`); register in `app.module.ts`
- `src/services/token.service.ts` (global): issue → random 32 bytes base64url; store `sha256(token)` → userId at `auth:token:<hash>` (TTL 90d, refreshed at most once a day); revoke; revoke-all via `auth:user:<userId>` set
- `src/guards/auth.guard.ts`: read `Authorization: Bearer`, resolve user, attach `req.user`; keep `@Public()` support; register as `APP_GUARD`
- `src/decorators/current-user.decorator.ts`
- `src/types.d.ts`: `Express.Request.user` typing; remove `SessionData`
- `src/main.ts` / `src/config/index.ts`: remove express-session, the `redis` client and `createSessionOptions`; uninstall `express-session`, `connect-redis`, `redis`, `@types/express-session`; drop `SESSION_SECRET`
- `@nestjs/throttler` on `/auth/login` and `/auth/register`
- Swagger `addBearerAuth()`; mark `HealthController` `@Public()`
- Passwords: `@node-rs/argon2`

## API
```
POST /api/auth/register (public) {email,password} → {token,user}
POST /api/auth/login    (public) {email,password} → {token,user}
POST /api/auth/logout                             → 204
GET  /api/auth/me                                 → user
```

## Acceptance
- Handler specs: duplicate email → 409; bad password → 401 with the same message as unknown email (no user enumeration)
- curl: register → me → logout → me = 401
- Health stays public

## Out of scope
Email verification, password reset (backlog), mobile.
