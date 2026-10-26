import NetInfo from '@react-native-community/netinfo';
import { useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import { snippetsApi } from '@/lib/api/snippets';
import { createSyncEngine, type SyncState } from '@/lib/sync/engine';
import { syncStore } from '@/lib/sync/store';

export { getSyncOwner, setSyncOwner, usePendingSnippetCount } from '@/lib/sync/store';

/** The app's one sync engine. The auth context starts it on sign-in and stops it on sign-out. */
export const syncEngine = createSyncEngine({
  transport: snippetsApi,
  store: syncStore,
  triggers: {
    onForeground(callback) {
      const sub = AppState.addEventListener('change', (next) => {
        if (next === 'active') callback();
      });
      return () => sub.remove();
    },
    // isConnected is null until the first check; treat unknown as online and let fetch decide.
    onConnectivity: (callback) => NetInfo.addEventListener((s) => callback(s.isConnected !== false)),
  },
});

export function useSyncState(): SyncState {
  return useSyncExternalStore(syncEngine.subscribe, syncEngine.getState);
}
