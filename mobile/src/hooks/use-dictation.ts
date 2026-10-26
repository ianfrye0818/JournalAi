import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorCode,
} from 'expo-speech-recognition';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import {
  deniedIssue,
  issueForError,
  joinTranscript,
  levelFromVolume,
  pickInstalledLocale,
  unavailableIssue,
  type DictationIssue,
} from '@/lib/dictation';

export type DictationStatus = 'idle' | 'starting' | 'listening' | 'stopping';

/** Errors that mean the on-device model can't serve this request, so the network might. */
const onDeviceFallbackErrors: ExpoSpeechRecognitionErrorCode[] = [
  'language-not-supported',
  'service-not-allowed',
];

const isAndroid = process.env.EXPO_OS === 'android';
const isWeb = process.env.EXPO_OS === 'web';
// Continuous mode (stay open until the user taps stop) needs Android 13+.
const supportsContinuous = !isAndroid || (Platform.Version as number) >= 33;

const deviceLocale = () => Intl.DateTimeFormat().resolvedOptions().locale;

type Session = {
  /** Text in the box when dictation started; the transcript is appended to it. */
  base: string;
  /** Finalized segments so far (Android continuous mode finalizes per pause). */
  committed: string;
  lang: string;
  onDevice: boolean;
  heard: boolean;
  /** Set when an on-device attempt failed before hearing anything; `end` restarts over the network. */
  retryOnNetwork: boolean;
};

/** Returns the locale to run offline with, or null if this device can't recognize `lang` offline. */
async function offlineLocale(lang: string): Promise<string | null> {
  if (isWeb || !ExpoSpeechRecognitionModule.supportsOnDeviceRecognition()) return null;
  // iOS reports on-device support per recognizer; Android needs the language model installed.
  if (!isAndroid) return lang;
  try {
    const { installedLocales } = await ExpoSpeechRecognitionModule.getSupportedLocales({});
    return pickInstalledLocale(lang, installedLocales);
  } catch {
    return null;
  }
}

async function ensurePermission(onDevice: boolean): Promise<boolean> {
  // Browsers prompt on their own when recognition starts.
  if (isWeb) return true;
  // On iOS, on-device recognition needs only the mic; server recognition also needs Speech.
  const response =
    onDevice && !isAndroid
      ? await ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync()
      : await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return response.granted;
}

export type UseDictationOptions = {
  /** The text the transcript is appended to. Captured when dictation starts. */
  value: string;
  /** Receives the box's full text (original + transcript) on every partial result. */
  onChangeText: (text: string) => void;
};

export type Dictation = {
  status: DictationStatus;
  /** True while the mic is open or opening; the text box should be read-only. */
  active: boolean;
  /** 0..1 input level, smoothed, for the mic ring. */
  level: SharedValue<number>;
  issue: DictationIssue | null;
  /** Whether any speech was transcribed since the last `reset()`; decides the snippet source. */
  dictated: boolean;
  /** Starts dictation, or stops it (keeping the transcript) if it's running. */
  toggle: () => void;
  /** Ends dictation immediately, keeping what's already in the box. Use before saving. */
  cancel: () => void;
  dismissIssue: () => void;
  /** Clears `dictated` and any issue, e.g. after the snippet was saved. */
  reset: () => void;
  /** Android: asks the system to download the offline model for the device language. */
  downloadOfflineModel: (() => Promise<void>) | null;
};

/**
 * Tap-to-talk dictation into a text box. Prefers on-device recognition so it works offline,
 * and falls back to the platform's server recognizer when no offline model is available.
 *
 * The recognizer is a single native resource, but every mounted hook hears its events, so each
 * instance only reacts while it owns the current session.
 */
export function useDictation({ value, onChangeText }: UseDictationOptions): Dictation {
  const [status, setStatus] = useState<DictationStatus>('idle');
  const [issue, setIssue] = useState<DictationIssue | null>(null);
  const [dictated, setDictated] = useState(false);
  const level = useSharedValue(0);
  const session = useRef<Session | null>(null);

  const finish = () => {
    session.current = null;
    setStatus('idle');
    level.set(withTiming(0, { duration: 200 }));
  };

  const begin = (s: Session) => {
    ExpoSpeechRecognitionModule.start({
      lang: s.lang,
      interimResults: true,
      maxAlternatives: 1,
      continuous: supportsContinuous,
      requiresOnDeviceRecognition: s.onDevice,
      // Android only punctuates with the on-device model.
      addsPunctuation: s.onDevice || !isAndroid,
      iosTaskHint: 'dictation',
      volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
    });
  };

  const start = async () => {
    setIssue(null);
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setIssue(unavailableIssue);
      return;
    }
    const lang = deviceLocale();
    const s: Session = {
      base: value,
      committed: '',
      lang,
      onDevice: false,
      heard: false,
      retryOnNetwork: false,
    };
    session.current = s;
    setStatus('starting');
    try {
      const offline = await offlineLocale(lang);
      if (offline) {
        s.lang = offline;
        s.onDevice = true;
      }
      if (!(await ensurePermission(s.onDevice))) {
        finish();
        setIssue(deniedIssue);
        return;
      }
      // Cancelled while the permission prompt was up.
      if (session.current !== s) return;
      begin(s);
    } catch {
      finish();
      setIssue(issueForError('unknown'));
    }
  };

  const toggle = () => {
    if (status === 'idle') {
      void start();
    } else if (status === 'listening') {
      setStatus('stopping');
      // Emits the final result, then `end`.
      ExpoSpeechRecognitionModule.stop();
    } else if (status === 'starting') {
      cancel();
    }
  };

  const cancel = () => {
    if (!session.current) return;
    finish();
    ExpoSpeechRecognitionModule.abort();
  };

  useSpeechRecognitionEvent('start', () => {
    if (session.current) setStatus((current) => (current === 'starting' ? 'listening' : current));
  });

  useSpeechRecognitionEvent('result', (event) => {
    const s = session.current;
    if (!s) return;
    const text = event.results[0]?.transcript ?? '';
    // iOS sends cumulative partials and one final; Android continuous mode finalizes each segment.
    // Treating every final as a committed segment handles both.
    if (event.isFinal) s.committed = joinTranscript(s.committed, text);
    onChangeText(joinTranscript(s.base, event.isFinal ? s.committed : joinTranscript(s.committed, text)));
    if (text.trim() && !s.heard) {
      s.heard = true;
      setDictated(true);
    }
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    if (session.current) level.set(withTiming(levelFromVolume(event.value), { duration: 100 }));
  });

  useSpeechRecognitionEvent('error', (event) => {
    const s = session.current;
    if (!s) return;
    if (s.onDevice && !s.heard && onDeviceFallbackErrors.includes(event.error)) {
      s.retryOnNetwork = true;
      return;
    }
    setIssue(issueForError(event.error));
  });

  // Always the last event of a session, including after errors.
  useSpeechRecognitionEvent('end', () => {
    const s = session.current;
    if (!s) return;
    if (s.retryOnNetwork) {
      s.retryOnNetwork = false;
      s.onDevice = false;
      s.lang = deviceLocale();
      void ensurePermission(false).then((granted) => {
        if (session.current !== s) return;
        if (granted) begin(s);
        else {
          finish();
          setIssue(deniedIssue);
        }
      });
      return;
    }
    finish();
  });

  // Leaving the screen mid-dictation shouldn't leave the mic open.
  useEffect(
    () => () => {
      if (session.current) {
        session.current = null;
        ExpoSpeechRecognitionModule.abort();
      }
    },
    [],
  );

  const downloadOfflineModel = isAndroid
    ? async () => {
        try {
          const { status: result } = await ExpoSpeechRecognitionModule.androidTriggerOfflineModelDownload({
            locale: deviceLocale(),
          });
          setIssue(
            result === 'download_scheduled'
              ? { kind: 'info', message: 'The offline model will download when you are on Wi-Fi.' }
              : null,
          );
        } catch {
          setIssue({ kind: 'error', message: "This device can't download an offline speech model." });
        }
      }
    : null;

  return {
    status,
    active: status !== 'idle',
    level,
    issue,
    dictated,
    toggle,
    cancel,
    dismissIssue: () => setIssue(null),
    reset: () => {
      setDictated(false);
      setIssue(null);
    },
    downloadOfflineModel,
  };
}
