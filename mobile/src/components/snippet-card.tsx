import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Icon, type IconName } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Snippet, SnippetSource } from '@/lib/db/schema';

const sourceIcons: Record<SnippetSource, IconName> = {
  text: { ios: 'text.alignleft', android: 'notes', web: 'notes' },
  voice: { ios: 'waveform', android: 'mic', web: 'mic' },
  share: { ios: 'square.and.arrow.down', android: 'share', web: 'share' },
};

const sourceLabels: Record<SnippetSource, string> = {
  text: 'Typed',
  voice: 'Voice',
  share: 'Shared',
};

export type SnippetCardProps = {
  snippet: Snippet;
  /** Highlights the card while its text is loaded in the composer. */
  editing?: boolean;
  onLongPress?: () => void;
};

export function SnippetCard({ snippet, editing = false, onLongPress }: SnippetCardProps) {
  const time = snippet.capturedAt.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Card
      onLongPress={onLongPress}
      accessibilityLabel={`${sourceLabels[snippet.source]} snippet at ${time}: ${snippet.text}`}
      accessibilityHint="Long press to edit or delete"
      style={editing && styles.editing}>
      <View style={styles.meta}>
        <Icon name={sourceIcons[snippet.source]} size={14} themeColor="textTertiary" />
        <ThemedText type="small" themeColor="textTertiary">
          {time}
        </ThemedText>
      </View>
      <ThemedText>{snippet.text}</ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  editing: {
    opacity: 0.5,
  },
});
