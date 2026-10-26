import { Linking, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, IconButton } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Dictation } from '@/hooks/use-dictation';

const canOpenSettings = process.env.EXPO_OS !== 'web';

export type DictationNoticeProps = {
  dictation: Dictation;
};

/** Inline explanation when dictation can't run, with the action that fixes it where there is one. */
export function DictationNotice({ dictation }: DictationNoticeProps) {
  const { issue, dismissIssue, downloadOfflineModel } = dictation;
  if (!issue) return null;

  const openSettings =
    canOpenSettings && (issue.kind === 'denied' || issue.kind === 'unavailable');
  const download = issue.kind === 'offline' ? downloadOfflineModel : null;

  return (
    <View accessibilityRole="alert" style={styles.root}>
      <View style={styles.row}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
          {issue.message}
        </ThemedText>
        <IconButton
          icon={{ ios: 'xmark', android: 'close', web: 'close' }}
          accessibilityLabel="Dismiss"
          size={28}
          onPress={dismissIssue}
        />
      </View>
      {(openSettings || download) && (
        <View style={styles.actions}>
          {openSettings && (
            <Button title="Open Settings" variant="secondary" onPress={() => Linking.openSettings()} />
          )}
          {download && (
            <Button title="Download offline model" variant="secondary" onPress={download} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  message: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
