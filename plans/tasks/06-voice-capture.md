# 06 — Voice capture (on-device speech-to-text)

**Goal:** Tap-to-talk with a live transcript; edit, then save as a snippet with `source=voice`.

## Files
- `npx expo install expo-speech-recognition`; config plugin + RECORD_AUDIO permission in `app.json` (verify the API against the current package README)
- `src/hooks/use-dictation.ts`: start / stop, partial results, errors, permission flow; prefer on-device recognition, fall back gracefully
- `src/components/capture/MicButton.tsx` (animated level ring via reanimated); integrate into the Today composer and capture modal

## Acceptance (on device, dev build)
- Speak → live text → save
- Denying permission shows a helpful state
- Works offline where the device supports on-device models

## Out of scope
Storing audio, server transcription.
