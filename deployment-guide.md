# JournalAI deployment and build guide

Last checked: October 26, 2026. Written for this repository's Expo SDK 58 mobile app and NestJS/Prisma 7 backend.

This is the manual runbook for [Task 14](plans/tasks/14-deploy-and-apk.md). Writing this guide does not deploy the backend, configure OTA updates, change build settings, or mark that task's acceptance checks complete. Configuration examples below are changes **you make when ready**.

## Contents

- [Choose a workflow](#1-choose-your-workflow)
- [Repository facts](#2-repository-facts-to-know-first)
- [Local prerequisites](#3-install-local-prerequisites)
- [Local backend](#4-run-the-backend-locally)
- [Hosted backend and Docker template](#5-deploy-the-backend)
- [Mobile API address and Google services](#6-set-the-mobile-api-address)
- [Daily local development builds](#7-daily-local-development-builds)
- [Build profiles, versions, and signing](#8-prepare-signed-builds-and-version-numbers)
- [Signed builds compiled locally](#9-signed-builds-compiled-locally)
- [EAS cloud builds](#10-optional-eas-cloud-builds)
- [Stores and TestFlight](#11-optional-future-storetestflight-distribution)
- [OTA updates](#12-optional-ota-javascript-updates-including-locally-built-apps)
- [Release checks](#13-release-checks)
- [Troubleshooting](#14-troubleshooting)
- [Next personal Android release](#15-short-path-for-the-next-personal-android-release)

## 1. Choose your workflow

For now: use Expo CLI for daily local development, and EAS Build **with `--local`** when you want signed installable artifacts. Cloud builds are optional.

| Goal | Method | Result |
| --- | --- | --- |
| Develop on Android | `expo run:android` | Development app; JavaScript served by Metro |
| Develop on iPhone or iOS Simulator | `expo run:ios` on a Mac | Development app; JavaScript served by Metro |
| Install a standalone Android app yourself | EAS `preview --local` | Signed APK; no Metro required |
| Install a standalone app on registered iPhones | EAS `preview --local` on a Mac | Ad hoc IPA; paid Apple Developer membership |
| Test an iOS release on Simulator | Simulator build profile | Simulator artifact, not an iPhone IPA |
| Later distribute through stores/TestFlight | EAS `production --local`, or Xcode archive | Android AAB or App Store IPA/archive |
| Compile without local native tools | EAS cloud build | Same profile's artifact, built remotely |

Local EAS builds still authenticate with Expo and can retrieve signing credentials. They compile on your computer; they are not an entirely offline workflow. Android local EAS builds support macOS/Linux; iOS requires macOS/Xcode. For Windows, use Expo CLI with Android Studio or EAS cloud. [Local EAS build reference](https://docs.expo.dev/build-reference/local-builds/).

The backend is a separate deployment. A locally built app can talk to either your laptop or a hosted API.

## 2. Repository facts to know first

- Run backend commands from `backend/` and mobile commands from `mobile/`. There is no root npm workspace.
- Both projects use npm lockfiles: use `npm ci` for reproducible installs.
- API paths start with `/api`. The app needs `EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api`.
- Android package and iOS bundle identifier: `dev.ianfrye.journalai`.
- Existing Expo project: owner `ianfrye.dev`, slug `journalai`, project ID `eb3049dd-01dd-4e19-8c2d-639f9e0b6737`. Use the account with access to this project. Do not initialize a replacement project accidentally.
- `mobile/eas.json` currently points development at the Android emulator's host address. Preview/production still contain `CHANGE-ME` URLs.
- `eas.json` currently uses remote build numbers. Section 8 explains switching to local numbering.
- The app uses native speech recognition, SQLite, secure storage, notifications, filesystem, and sharing. Use a development build for full testing.
- Native `android/` and `ios/` folders are generated and ignored. Keep native configuration in app config/plugins. Regenerating them removes manual native edits.
- OTA is **not configured yet**: `expo-updates`, update URL, runtime version, and channels need setup before updates can reach installed builds.
- Backend Prisma CLI configuration is `prisma7.config.ts`, not the conventional filename. Every Prisma command in this guide passes it explicitly.

## 3. Install local prerequisites

Use Node.js 24 LTS and its npm for this runbook. Install Docker for local Postgres/Redis and optional backend image builds.

For Android, install Android Studio, its recommended SDK/build tools and emulator, a compatible JDK, and Android platform tools (`adb`). Configure the SDK/JDK paths using Expo's [Android environment setup](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build&buildEnv=local).

For iOS, use a Mac with Xcode, its command-line tools, Simulator runtimes, and CocoaPods. Open Xcode once and finish setup/license prompts. Local EAS iOS builds also require Fastlane. Follow the tool versions supported by SDK 58 and your installed Xcode, rather than copying an old SDK's prerequisites. [Local native build overview](https://docs.expo.dev/guides/local-app-development/).

Install JavaScript dependencies:

```sh
# From repository root
cd backend
npm ci
npx prisma generate --config prisma7.config.ts
cd ../mobile
npm ci
npx expo-doctor
```

Use `npx expo install PACKAGE` for new Expo/native dependencies. If Expo Doctor reports a mismatch, review it before using `npx expo install --fix`; that command changes dependency versions.

## 4. Run the backend locally

From `backend/`:

```sh
cp .env.example .env
docker compose up -d
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npm run dev
```

Copy `.env.example` only if you do not already have a configured `.env`. Set a valid `ANTHROPIC_API_KEY` before testing interviews/drafts, and choose an `ANTHROPIC_MODEL` actually available to that account. The repository's default model string is configurable; its presence in the code is not proof of availability.

The compose file supplies Postgres 17 and Redis 7 with development credentials and host ports. It is a laptop setup, not a production database deployment.

Check from another terminal:

```sh
curl --fail http://localhost:3000/api/health
```

Expected response: `OK`. Development Swagger is at `http://localhost:3000/api/swagger`. The health endpoint is only a process check: it does not query Postgres, Redis, or Anthropic.

`migrate deploy` applies the committed migrations. Use `migrate dev` only when creating a new migration against a development database. Never use `migrate reset`, `db push`, or the repository's `db:migrate` development script as your production migration command. [Prisma production migration guidance](https://docs.prisma.io/docs/orm/v7/prisma-client/deployment/deploy-migrations-from-a-local-environment).

## 5. Deploy the backend

### Required configuration

Create a separate hosted Postgres database and Redis instance. Use provider-injected environment variables; do not upload `backend/.env`.

| Variable | Value / behavior in this repository |
| --- | --- |
| `NODE_ENV` | `production`; development mode logs request bodies, including journal content |
| `PORT` | Host-assigned port, or `3000` on your own container host |
| `API_URL` | Public HTTPS origin, e.g. `https://journal-api.example.com`; required by validation |
| `DATABASE_URL` | Hosted PostgreSQL connection string; include provider-required TLS settings |
| `REDIS_HOST` | Private Redis hostname reachable from the API |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password if configured |
| `SMTP_HOST` | Your SMTP hostname; currently needed during startup |
| `SMTP_PORT` | Your SMTP port; currently needed during startup |
| `FROM_EMAIL` | Valid sender address; configure even though email flows are not exposed yet |
| `ANTHROPIC_API_KEY` | Server-only API key, required for working AI features |
| `ANTHROPIC_MODEL` | Model identifier available to your Anthropic account |
| `FRONTEND_URL` | Optional browser frontend origin; native apps do not need CORS allowlisting |
| `CORS_ORIGIN` | Optional JSON array of extra browser origins, e.g. `["https://journal.example.com"]` |

Two implementation details affect provider selection:

1. SMTP fields are optional in Zod, but `EmailService` calls the throwing config getter for host/port at startup. Supply them. SMTP authentication is not implemented, and the transport currently disables certificate verification. Harden this service before enabling real email features; simply adding SMTP username/password variables will not configure authentication.
2. `RedisService` accepts host/port/password only. It does not read `REDIS_URL`, a username, or TLS options. Use private-network Redis compatible with this connection style. A TLS-only/HTTP Redis provider needs a code change first. Redis stores login sessions, so persistence and availability matter; losing its data signs users out.

### Option A: Railway dashboard deployment

This is a concrete hosting example, not a recorded hosting decision. You can use another container/Node host with equivalent Postgres and Redis services.

1. Create a Railway project with Postgres and Redis in the same environment.
2. Add an API service from this Git repository; set its root directory to `/backend`.
3. Set the environment variables above, using service-reference variables for database/Redis credentials. For a private hostname, verify all services share the same private network/environment.
4. Use these commands in the API service settings:

   ```sh
   # Build
   npm ci --include=dev && npx prisma generate --config prisma7.config.ts && npm run build

   # Pre-deploy
   npx prisma migrate deploy --config prisma7.config.ts

   # Start
   node dist/main.js
   ```

5. Ensure the runtime retains the Prisma CLI and its config dependencies: they are dev dependencies needed by the pre-deploy command. Do not prune them before that step. If automatic buildpack behavior makes this unreliable, use the Docker template below.
6. Generate a public HTTPS domain, route it to the application's `PORT`, and set health check path `/api/health`.
7. Deploy, inspect startup/migration logs, then test the public health URL and register/sign in through the app.

Root-directory behavior and pre-deploy settings are documented in [Railway monorepos](https://docs.railway.com/deployments/monorepo) and [Railway pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command).

### Option B: build a backend container locally

The repository does not yet have a Dockerfile. When ready, create `backend/Dockerfile` with this starting template:

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
# Generation needs a config URL, not access to the production database.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    npx prisma generate --config prisma7.config.ts
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma7.config.ts ./prisma7.config.ts
USER node
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --config prisma7.config.ts && exec node dist/main.js"]
```

Create `backend/.dockerignore` before building:

```text
node_modules
dist
coverage
.env
.env.*
!.env.example
.git
*.log
*.tsbuildinfo
src/generated/prisma
```

This template deliberately retains build dependencies so Prisma can run at startup. It builds native npm dependencies inside Linux rather than copying macOS `node_modules`. Build and test it before relying on it in production; this guide did not execute the template.

From repository root:

```sh
docker build -t journalai-api:manual ./backend
```

For a remote Linux/amd64 host when building on Apple Silicon:

```sh
docker buildx build --platform linux/amd64 --load -t journalai-api:manual ./backend
```

On a machine with access to your hosted/private dependencies, run the image with a protected environment file:

```sh
docker run --name journalai-api --restart unless-stopped \
  --env-file /secure/path/journalai-api.env \
  -p 127.0.0.1:3000:3000 journalai-api:manual
```

On your own server, put an HTTPS reverse proxy in front of port 3000. On a managed container host, publish the image to your registry and configure its environment/domain/health check there. `localhost` inside a container means that container, not your laptop or database container.

The image migrates on startup, as Task 14 proposes. For multiple replicas, prefer one controlled migration/release job before rollout and use `node dist/main.js` as the app command. Do not run migrations in both the release job and the startup command unnecessarily. Back up Postgres before applying schema changes.

### Verify and operate the hosted API

```sh
curl --fail https://YOUR-API-HOST/api/health
```

Then register a disposable account in the app, sign out/in, sync a snippet, and generate a draft. Those checks exercise dependencies that `/health` does not.

Keep Postgres backups, Redis persistence, service logs, and an API spending limit/alert. Keep database ports private. Preserve backwards-compatible APIs for older installed apps; shipping a new backend does not update their JavaScript automatically. To roll back, redeploy the previous image/commit only if it remains compatible with the migrated schema; database rollback is a separate reviewed operation.

## 6. Set the mobile API address

Use `mobile/.env.local` for local Expo CLI builds. Preserve any existing configuration before editing it.

| Where the app runs | Local backend URL |
| --- | --- |
| Android Studio emulator | `http://10.0.2.2:3000/api` |
| iOS Simulator on the backend Mac | `http://localhost:3000/api` |
| Physical Android/iPhone over Wi-Fi | `http://YOUR-MAC-LAN-IP:3000/api` |
| Android device with `adb reverse tcp:3000 tcp:3000` | `http://127.0.0.1:3000/api` |
| Any device on mobile data | `https://YOUR-API-HOST/api` |

For a physical phone, check the firewall and use the same LAN. Metro and the API are separate connections: an Expo tunnel does not tunnel your backend.

For installable builds, prefer the hosted HTTPS URL. Android cleartext restrictions and iOS App Transport Security can block plain HTTP depending on native build configuration. Do not weaken production transport settings to make a laptop URL work.

Example `mobile/.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api
```

The variable is bundled into client JavaScript. Restart Metro after changing it; rebuild standalone binaries unless you deliberately distribute the URL change through a configured OTA update. Keep Anthropic keys, database credentials, SMTP credentials, and signing passwords out of all `EXPO_PUBLIC_*` variables. EAS profile variables do not automatically apply to `expo run:*`. [Expo environment variables](https://docs.expo.dev/guides/environment-variables/).

### Android Google services configuration

`app.json` currently references `./google-services.json`, but that file is absent in this checkout. Resolve that before an Android build:

- For the current **local daily reminders**, FCM registration is not required. If you are not configuring remote push, remove the unused `android.googleServicesFile` property and regenerate the Android project.
- If you intend remote push, supply the Firebase Android configuration matching `dev.ianfrye.journalai`. For cloud builds, explicitly include it in the build upload or use a file environment variable with dynamic app config; an ignored local file will not magically be present on EAS.

Never substitute a Firebase service-account private key for `google-services.json`. Remote push is additional work; current reminders schedule locally. [SDK 58 notifications](https://docs.expo.dev/versions/v58.0.0/sdk/notifications/) and [EAS file environment variables](https://docs.expo.dev/eas/environment-variables/manage/).

## 7. Daily local development builds

All commands in this and subsequent mobile sections run from `mobile/` unless stated otherwise.

### Android emulator or physical device

Start an emulator, or enable USB debugging on a connected phone and authorize your computer:

```sh
adb devices
npx expo run:android --device
```

For later JavaScript-only work:

```sh
npx expo start --dev-client
```

### iOS Simulator or physical iPhone

```sh
# Simulator
npx expo run:ios

# Connected iPhone / device selector
npx expo run:ios --device
```

On iPhone, enable Developer Mode if prompted and select your Apple signing team. Local development signing can use an Apple ID/Personal Team, subject to Apple's restrictions and provisioning expiry. It is not a way to distribute an app to arbitrary users. [Development build options](https://docs.expo.dev/develop/development-builds/introduction/?buildenv=local).

Expo CLI generates native projects when absent, then builds/installs and starts Metro. When a native dependency or plugin changes, regenerate the relevant native project before rebuilding:

```sh
npx expo prebuild --clean --platform android
# Or, on macOS:
npx expo prebuild --clean --platform ios
```

`--clean` replaces that platform's generated directory. Preserve any deliberate native work first. Then rerun the corresponding `expo run:*` command. Changes to notifications, speech permissions, native modules, or OTA configuration require a new binary. [Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/).

## 8. Prepare signed builds and version numbers

### Local-first numbering

For one clear source of truth across local and cloud builds, change `mobile/eas.json` to use local app version numbers. This is a proposed replacement, not the file's current contents:

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "environment": "development",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "environment": "preview",
      "android": { "buildType": "apk" }
    },
    "ios-simulator": {
      "extends": "preview",
      "ios": { "simulator": true }
    },
    "production": {
      "environment": "production",
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": { "production": {} }
}
```

Merge these fields into the existing `expo.android` and `expo.ios` objects in `app.json`:

```json
{
  "version": "1.0.0",
  "android": { "versionCode": 1 },
  "ios": { "buildNumber": "1" }
}
```

Increment `android.versionCode` and `ios.buildNumber` for each new store upload; keep them above any numbers already uploaded. Increase `expo.version` for a new user-visible version. This example intentionally omits `autoIncrement`: you manage and commit the numbers yourself. If retaining remote numbering instead, use EAS version synchronization for native IDE builds. [App version management](https://docs.expo.dev/build-reference/app-versions/).

All current profiles share one application ID. Development and release builds replace one another if signing permits. Different Android signing certificates prevent replacement; uninstalling loses local data. Export/sync first. Side-by-side dev/prod installs would need separate identifiers and matching native service configuration.

### Configure EAS access and environments

```sh
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest project:info
```

Confirm the existing project and account. With the replacement profiles above, configure the public URL in EAS environments:

```sh
npx eas-cli@latest env:set --environment preview --name EXPO_PUBLIC_API_URL --value https://YOUR-API-HOST/api --visibility plaintext
npx eas-cli@latest env:set --environment production --name EXPO_PUBLIC_API_URL --value https://YOUR-API-HOST/api --visibility plaintext
npx eas-cli@latest env:list --environment preview
```

Set `development` to the target device's local URL, or the hosted API if preferred. Alternatively manage these values in the Expo dashboard. Avoid conflicting values in profile `env`, EAS environments, and local dotenv files. The URL is public by design. [EAS environment management](https://docs.expo.dev/eas/environment-variables/manage/).

For local EAS builds, explicitly provide the URL in your shell as shown below. EAS variables with Secret visibility are not available to local EAS builds; supply any required local-only build inputs yourself.

### Signing credentials

EAS can create/manage Android keystores and Apple certificates/profiles even when compilation is local:

```sh
npx eas-cli@latest credentials --platform android
npx eas-cli@latest credentials --platform ios
```

Back up signing credentials and passwords securely. Reuse the Android signing identity for APK upgrades. Apple device distribution needs valid provisioning; an IPA is not universally installable like an APK.

If you prefer managing credentials yourself, configure `credentialsSource: "local"` on the build profile and supply `mobile/credentials.json` using Expo's documented schema. Ignore that file and all referenced private keys/profiles. [Local signing credentials](https://docs.expo.dev/app-signing/local-credentials/).

## 9. Signed builds compiled locally

The command flags below use the [EAS CLI build reference](https://docs.expo.dev/eas/cli/). Keep the CLI current when following this guide later.

### Android: standalone APK for your phone

After configuring `preview` and its URL:

```sh
mkdir -p ../artifacts
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx eas-cli@latest build \
  --platform android --profile preview --local --output ../artifacts/journalai-preview.apk
adb install -r ../artifacts/journalai-preview.apk
```

Alternatively copy the APK to your phone and allow installation from the app opening it. An APK installs directly; an AAB is for Play distribution. A preview build bundles JavaScript and works without Metro. [APK build/install reference](https://docs.expo.dev/build-reference/apk/).

### Android: release-mode smoke test without EAS

```sh
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx expo run:android --variant release --device
```

This tests release behavior with embedded JavaScript. It is **not evidence of production signing**: inspect signing before sharing, and use the signed EAS-local workflow for distributable artifacts. The generated Gradle project's release signing must be configured if you choose a fully manual Android release pipeline. [Manual Android release signing](https://docs.expo.dev/guides/local-app-production/).

### iPhone: standalone ad hoc build

Use a paid Apple Developer membership and register each target iPhone:

```sh
npx eas-cli@latest device:create
mkdir -p ../artifacts
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx eas-cli@latest build \
  --platform ios --profile preview --local --output ../artifacts/journalai-preview.ipa
```

Install the signed IPA onto an included connected device with Xcode's Devices and Simulators window or Apple Configurator. Adding a new UDID requires a new provisioning profile and rebuild/re-sign. The ad hoc profile only permits registered devices and expires; it is not public distribution. [Internal iOS distribution](https://docs.expo.dev/build/internal-distribution/).

### iOS Simulator: standalone build

```sh
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx eas-cli@latest build \
  --platform ios --profile ios-simulator --local
```

Use the artifact path printed by EAS. Extract it if archived, boot Simulator, then install its `.app`:

```sh
xcrun simctl install booted /absolute/path/to/JournalAI.app
xcrun simctl launch booted dev.ianfrye.journalai
```

A simulator app cannot be installed on an iPhone. Local EAS outputs are local files; a local build does not automatically create a cloud installation link. Keep artifacts outside version control.

### iOS: local Xcode archive alternative

On a Mac, generate the iOS project with the desired API environment, then open its workspace in Xcode:

```sh
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx expo prebuild --platform ios
```

1. Open the `.xcworkspace` in `mobile/ios/`, not the `.xcodeproj`.
2. Select the app target, confirm bundle ID, choose your signing team, and enable automatic signing if appropriate.
3. Check version/build number and configure the scheme's Archive action to Release.
4. Choose a generic physical iOS destination, then Product → Archive.
5. In Organizer, validate/distribute the archive using a method supported by your signing team.

Ensure the Release bundle phase sees `EXPO_PUBLIC_API_URL` too: set `mobile/.env.local` before archiving; the prebuild command's one-off variable does not persist into an Xcode GUI session. Keep native changes reproducible through app config/plugins. [Xcode archive and upload walkthrough](https://docs.expo.dev/submit/ios-manual/).

## 10. Optional EAS cloud builds

Use the same profiles, project, environment variables, and signing credentials. Omit `--local` and `--output`:

```sh
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
npx eas-cli@latest build --platform ios --profile ios-simulator
```

Cloud builds upload source/build inputs to Expo. Confirm the upload excludes local credentials and `test-account.local.md` if your build context includes it. Ensure required ignored files are explicitly supplied through the appropriate build configuration.

Install from the build's link/dashboard. Android preview produces an APK; iOS preview remains restricted to provisioned devices. Treat internal installation links as shared access to the binary. [Internal build distribution](https://docs.expo.dev/build/internal-distribution/).

## 11. Optional future store/TestFlight distribution

Store listings are outside Task 14, but the build paths are:

```sh
# Android Play bundle, compiled locally
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx eas-cli@latest build \
  --platform android --profile production --local --output ../artifacts/journalai-production.aab

# iOS App Store/TestFlight IPA, compiled locally on macOS
EXPO_PUBLIC_API_URL=https://YOUR-API-HOST/api npx eas-cli@latest build \
  --platform ios --profile production --local --output ../artifacts/journalai-production.ipa
```

For cloud compilation, use the same production commands without `--local --output ...`.

For Android, create the Play Console app and complete the first manual upload/setup. Later, configure the Google Play service account for EAS Submit:

```sh
npx eas-cli@latest submit --platform android --profile production --path ../artifacts/journalai-production.aab
```

Choose a test track before production. The service-account upload credential is separate from the app's Firebase configuration. [Android submission](https://docs.expo.dev/submit/android/).

For iOS, create the App Store Connect app with the matching bundle ID, configure the submit profile/account as prompted, and upload:

```sh
npx eas-cli@latest submit --platform ios --profile production --path ../artifacts/journalai-production.ipa
```

After processing, use TestFlight; external testers can require beta review. Uploading a build does not publish an App Store listing. Complete privacy disclosures, permission descriptions, screenshots, review requirements, and account-deletion checks before wider release. [iOS submission](https://docs.expo.dev/submit/ios/).

## 12. Optional OTA JavaScript updates, including locally built apps

You can build locally and still use EAS Update. Skip this section if installing a new binary for each change is sufficient for now.

### One-time setup

```sh
npx expo install expo-updates
npx eas-cli@latest update:configure
```

Review the resulting `updates.url`, `runtimeVersion`, and existing project ID. Add `"channel": "preview"` and `"channel": "production"` to the corresponding `eas.json` build profiles. The simulator profile inherits preview's channel.

For binaries built using `expo run:*` or Xcode instead of EAS Build, add this under `expo` in app config for a **preview** binary:

```json
{
  "updates": {
    "url": "https://u.expo.dev/eb3049dd-01dd-4e19-8c2d-639f9e0b6737",
    "requestHeaders": { "expo-channel-name": "preview" }
  },
  "runtimeVersion": { "policy": "appVersion" }
}
```

Use the production channel for a production binary. Do not leave a preview request header in production app config; use dynamic config if regularly switching direct native builds between channels. Regenerate native projects after configuration and build/install new binaries. Existing binaries without `expo-updates` cannot receive their first OTA setup through an update. [EAS Update setup](https://docs.expo.dev/eas-update/getting-started/).

With `appVersion`, bump `expo.version` whenever native compatibility changes and ship a new binary. Alternatively adopt the `fingerprint` policy for automatic runtime compatibility calculation, then verify build/update fingerprints match. OTA cannot add missing native modules, change signing/permissions, or replace the backend. [Runtime compatibility](https://docs.expo.dev/eas-update/runtime-versions/).

### Publish and verify

First configure matching URL values in EAS `preview`/`production` environments (section 8). Then publish a small visible JS change:

```sh
npx eas-cli@latest update --channel preview --environment preview --message "Verify preview update"
```

SDK 58 requires the environment argument. Variables from a build profile's `env` are not automatically used by `eas update`; a wrong environment can bundle a wrong API URL. [Update environments](https://docs.expo.dev/eas/environment-variables/usage/).

Test on the standalone preview binary, not Metro. Open it online to download, close and reopen it, and allow another launch if needed. Confirm the visible change and API connectivity. After validation, publish the intended code to production with its production environment/channel. If an update breaks the app, use EAS Update's rollback/republish controls to restore a known compatible update; do not roll back SQLite schema code blindly after a migration has run.

## 13. Release checks

Run automated checks before packaging:

```sh
# backend/
npx prisma generate --config prisma7.config.ts
npm run typecheck
npm test -- --runInBand
npm run build

# mobile/
npx tsc --noEmit
npm run lint
npm test -- --runInBand
npx expo-doctor
```

On real Android and iPhone devices before supporting each platform:

- Fresh registration, sign-in/out, relaunch, and account recovery after an expired/revoked session.
- Text capture offline, reconnect/sync, swipe edit, swipe-delete confirmation, and microphone/speech permission handling.
- Interview, answers/skips, draft, manual edits, finalize, capture-after-finalize prompt, reopen, regenerate, and finalize again.
- Rollover/timezone, writing style, 12/24-hour display, reminder enable/change/disable, foreground/background delivery, and cancellation on sign-out.
- History/search, single-day sharing, month ZIP, and export contents.
- Android: pick an Obsidian folder, auto-export on finalize, and confirm before replacing a note edited in Obsidian.
- iOS: sharing and ZIP export. Persistent SAF vault export is Android-only in this implementation; do not expect the Android folder workflow on iOS.
- Delete a disposable account: confirm related server rows/tokens and local data disappear; previously exported files remain.
- Test a standalone build with Metro stopped. Turn Wi-Fi off and verify the hosted API works over mobile data.
- If OTA is enabled, verify a compatible update reaches the installed binary.

Before widening access, remove the repo-root `test-account.local.md` from shared/release material, rotate any shared test password, and review public registration/AI usage controls. The current credential endpoint throttle is not a complete spending or abuse limit for public AI access.

## 14. Troubleshooting

| Symptom | Check |
| --- | --- |
| Backend cannot find Prisma config or database URL | Run from `backend/`; pass `--config prisma7.config.ts`; check injected `DATABASE_URL` |
| Backend starts locally but not on host | Required Zod variables, SMTP host/port getters, `PORT`, and correct Node version |
| Redis errors / login fails | Separate host/port/password; private DNS reachability; this client has no TLS/Redis URL support |
| Health says OK but AI fails | Test auth/DB/Redis separately; check Anthropic key, available model, billing, and logs |
| App cannot reach API | `/api` suffix, emulator vs physical-device address, firewall, HTTP restrictions, and build-time URL |
| Android build cannot find Google services file | Resolve the existing `googleServicesFile` reference as described in section 6 |
| Missing native module | Regenerate and rebuild native app; Metro reload or OTA cannot install native code |
| Android APK upgrade fails | Existing installation has another signing key or a higher version code; sync/export before uninstalling |
| iOS IPA will not install | Device UDID, provisioning expiry, signing method, Developer Mode, and device-vs-simulator artifact |
| Local EAS build misses a secret | Secret-visibility variables are not provided locally; supply local build inputs explicitly |
| App still needs laptop | Installed development build, or bundled API URL still points at laptop; use preview + hosted HTTPS |
| Reminder is late | Notification permissions, Android channel settings, battery restrictions, iOS Focus; timing is best effort |
| OTA never appears | `expo-updates` in installed binary, correct URL/channel/platform/runtime, matching environment, and restart cycle |
| Obsidian auto-export unavailable on iOS | Expected current platform limitation; use sharing/ZIP |

## 15. Short path for the next personal Android release

1. Deploy the backend using section 5 and verify login/sync/AI through its HTTPS endpoint.
2. Resolve `googleServicesFile`; configure preview URL, signing, and version numbering.
3. Run the automated checks in section 13.
4. Build `preview` with `--local`, install the APK, and complete the device checks.
5. Record the Git commit, API URL, version/build number, signing identity, and artifact location.
6. Configure OTA only if you want it; build a fresh binary after its one-time setup and verify delivery.

This completes the manual equivalent of Task 14 only after the installed app works over mobile data and, if enabled, OTA delivery has been verified.
