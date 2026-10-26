import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui';
import { Spacing, type ThemeColor } from '@/constants/theme';
import { useSyncState, usePendingSnippetCount } from '@/lib/sync';
import type { SyncPhase } from '@/lib/sync/engine';

type Display = { icon: IconName; label: string; color: ThemeColor };

const icons = {
  syncing: { ios: 'arrow.triangle.2.circlepath', android: 'sync', web: 'sync' },
  offline: { ios: 'icloud.slash', android: 'cloud_off', web: 'cloud_off' },
  error: { ios: 'exclamationmark.icloud', android: 'sync_problem', web: 'sync_problem' },
  pending: { ios: 'icloud.and.arrow.up', android: 'cloud_upload', web: 'cloud_upload' },
  synced: { ios: 'checkmark.icloud', android: 'cloud_done', web: 'cloud_done' },
} satisfies Record<string, IconName>;

function describe(phase: SyncPhase, pending: number): Display {
  const waiting = `${pending} waiting`;
  switch (phase) {
    case 'syncing':
      return { icon: icons.syncing, label: 'Syncing…', color: 'textTertiary' };
    case 'offline':
      return {
        icon: icons.offline,
        label: pending > 0 ? `Offline · ${waiting}` : 'Offline',
        color: 'textTertiary',
      };
    case 'error':
      return {
        icon: icons.error,
        label: pending > 0 ? `Sync paused · ${waiting}` : 'Sync paused',
        color: 'danger',
      };
    case 'idle':
      return pending > 0
        ? { icon: icons.pending, label: waiting, color: 'textTertiary' }
        : { icon: icons.synced, label: 'Synced', color: 'textTertiary' };
  }
}

/** Compact sync indicator for screen headers. */
export function SyncStatus() {
  const { phase } = useSyncState();
  const pending = usePendingSnippetCount();
  const { icon, label, color } = describe(phase, pending);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Sync status: ${label}`}
      accessibilityLiveRegion="polite">
      <Icon name={icon} size={14} themeColor={color} />
      <ThemedText type="small" themeColor={color}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
