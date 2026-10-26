import { requireOptionalNativeModule } from 'expo';
import { addDatabaseChangeListener } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

const widget = Platform.OS === 'android'
  ? requireOptionalNativeModule<{ refresh(signedIn: boolean): Promise<void> }>('SnippetWidget')
  : null;

/** Mounted after migrations; catches local writes, sync merges, resets, and day setting changes. */
export function useSnippetWidget(status: string) {
  useEffect(() => {
    if (!widget || status === 'loading') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      void widget.refresh(status === 'signedIn').catch((error: unknown) => {
        console.warn('Could not refresh snippet widget', error);
      });
    };
    const changes = addDatabaseChangeListener(({ tableName }) => {
      if (tableName !== 'snippets' && tableName !== 'kv') return;
      // SQLite change callbacks can arrive before a multi-row transaction commits.
      clearTimeout(timer);
      timer = setTimeout(refresh, 150);
    });
    const resume = AppState.addEventListener('change', (state) => {
      if (state === 'active' || state === 'background') refresh();
    });
    const interval = setInterval(refresh, 60_000);
    refresh();
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      changes.remove();
      resume.remove();
    };
  }, [status]);
}
