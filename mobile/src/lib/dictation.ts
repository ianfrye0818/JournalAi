import type { ExpoSpeechRecognitionErrorCode } from 'expo-speech-recognition';

/** Appends dictated text to what's already in the box, with exactly one space between them. */
export function joinTranscript(base: string, addition: string): string {
  const head = base.trimEnd();
  const tail = addition.trim();
  if (!tail) return base;
  if (!head) return tail;
  return `${head} ${tail}`;
}

/** Maps the recognizer's volume (-2..10, anything <= 0 is silence) onto 0..1 for the level ring. */
export function levelFromVolume(value: number): number {
  return Math.min(Math.max(value / 10, 0), 1);
}

const normalizeLocale = (locale: string) => locale.replace('_', '-').toLowerCase();

/**
 * Picks the installed offline locale that best matches `lang`: an exact match, else any variant of
 * the same language (so en-GB on an en-US-only device still runs offline). Null if none is installed.
 */
export function pickInstalledLocale(lang: string, installed: string[]): string | null {
  const wanted = normalizeLocale(lang);
  const exact = installed.find((locale) => normalizeLocale(locale) === wanted);
  if (exact) return exact;
  const language = wanted.split('-')[0];
  return installed.find((locale) => normalizeLocale(locale).split('-')[0] === language) ?? null;
}

export type DictationIssueKind = 'denied' | 'unavailable' | 'offline' | 'no-speech' | 'error' | 'info';

export type DictationIssue = {
  kind: DictationIssueKind;
  message: string;
};

export const deniedIssue: DictationIssue = {
  kind: 'denied',
  message: 'Microphone access is off. Turn it on in Settings to dictate, or keep typing.',
};

export const unavailableIssue: DictationIssue = {
  kind: 'unavailable',
  message:
    process.env.EXPO_OS === 'ios'
      ? 'Speech recognition is off. Turn on Siri & Dictation in Settings to dictate.'
      : "Speech recognition isn't available on this device.",
};

/** Turns a recognizer error into something to show the user. Null means stay quiet. */
export function issueForError(error: ExpoSpeechRecognitionErrorCode): DictationIssue | null {
  switch (error) {
    case 'aborted':
      return null;
    case 'not-allowed':
      return deniedIssue;
    case 'service-not-allowed':
    case 'language-not-supported':
      return unavailableIssue;
    case 'network':
      return {
        kind: 'offline',
        message: "You're offline and this device has no offline speech model for your language.",
      };
    case 'no-speech':
    case 'speech-timeout':
      return { kind: 'no-speech', message: "Didn't catch that. Tap the mic and try again." };
    case 'busy':
      return { kind: 'error', message: 'The microphone is busy in another app. Try again in a moment.' };
    case 'interrupted':
      return { kind: 'error', message: 'Dictation was interrupted. Your text so far is kept.' };
    default:
      return { kind: 'error', message: 'Dictation stopped unexpectedly. Your text so far is kept.' };
  }
}
