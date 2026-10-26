import { useTimeFormat } from '@/lib/settings';
import { formatTime } from '@/lib/time';
import { useRef } from 'react';
import Swipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Icon, type IconName } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
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
  onEdit?: () => void;
  onDelete?: () => void;
};

export function SnippetCard({ snippet, editing = false, onEdit, onDelete }: SnippetCardProps) {
  const swipeable = useRef<SwipeableMethods>(null);
  const theme = useTheme();
  const actionable = !!(onEdit || onDelete);

  const timeFormat = useTimeFormat();
  const time = formatTime(
    snippet.capturedAt.getHours(),
    snippet.capturedAt.getMinutes(),
    timeFormat,
  );

  const card = (
    <Card
      accessible
      accessibilityActions={[
        ...(onEdit ? [{ name: 'edit', label: 'Edit snippet' }] : []),
        ...(onDelete ? [{ name: 'delete', label: 'Delete snippet' }] : []),
      ]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'edit') onEdit?.();
        if (nativeEvent.actionName === 'delete') onDelete?.();
      }}
      accessibilityLabel={`${sourceLabels[snippet.source]} snippet at ${time}: ${snippet.text}`}
      accessibilityHint={actionable ? 'Swipe right to edit or left to delete' : undefined}
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

  if (!actionable) return card;

  return (
    <Swipeable
      ref={swipeable}
      leftThreshold={72}
      rightThreshold={72}
      dragOffsetFromLeft={20}
      dragOffsetFromRight={-20}
      overshootLeft={false}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
      renderLeftActions={
        onEdit
          ? () => (
              <View
                accessible={false}
                style={[styles.swipeAction, { backgroundColor: theme.accentSoft }]}>
                <ThemedText themeColor="accent" type="smallBold">
                  Edit
                </ThemedText>
              </View>
            )
          : undefined
      }
      renderRightActions={
        onDelete
          ? () => (
              <View
                accessible={false}
                style={[styles.swipeAction, { backgroundColor: theme.danger }]}>
                <ThemedText style={{ color: theme.background }} type="smallBold">
                  Delete
                </ThemedText>
              </View>
            )
          : undefined
      }
      onSwipeableOpen={(direction) => {
        swipeable.current?.reset();
        if (direction === SwipeDirection.RIGHT) onEdit?.();
        else onDelete?.();
      }}>
      {card}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: { borderRadius: Radius.lg },
  swipeAction: { width: 96, alignItems: 'center', justifyContent: 'center' },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  editing: {
    opacity: 0.5,
  },
});
