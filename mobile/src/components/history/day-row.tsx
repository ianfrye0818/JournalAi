import { StyleSheet, View } from 'react-native';

import { statusLabels } from '@/components/history/month-calendar';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseLocalDate } from '@/lib/dates';
import type { HistoryDay } from '@/lib/history/days';

export function DayRow({ day, onPress }: { day: HistoryDay; onPress: () => void }) {
  const theme = useTheme();
  const label = parseLocalDate(day.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const finalized = day.status === 'finalized';
  const snippets =
    day.snippetCount === 0
      ? statusLabels[day.status]
      : day.snippetCount === 1
        ? '1 snippet'
        : `${day.snippetCount} snippets`;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${label}, ${statusLabels[day.status]}${day.entryTitle ? `: ${day.entryTitle}` : ''}`}>
      <View style={styles.meta}>
        <ThemedText type="caption" themeColor="textSecondary">
          {label}
        </ThemedText>
        <View style={styles.status}>
          <View
            style={[styles.dot, { backgroundColor: finalized ? theme.accent : theme.textTertiary }]}
          />
          <ThemedText type="small" themeColor="textTertiary">
            {statusLabels[day.status]}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="heading" themeColor={day.entryTitle ? 'text' : 'textSecondary'}>
        {day.entryTitle ?? snippets}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
