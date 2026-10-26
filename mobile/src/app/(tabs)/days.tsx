import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RetryCard } from '@/components/day/retry-card';
import { ThemedText } from '@/components/themed-text';
import { Card, EmptyState, Screen, Skeleton } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DayStatus, DaySummary } from '@/lib/api/types';
import { parseLocalDate } from '@/lib/dates';
import { dayHref, stepForStatus } from '@/lib/days/flow';
import { useDayList } from '@/lib/days/queries';

const statusLabels: Record<DayStatus, string> = {
  open: 'Not started',
  interviewing: 'In progress',
  drafted: 'Drafted',
  finalized: 'Finalized',
};

// A plain list for now; Task 11 brings the calendar strip, streaks, search, and offline cache.
export default function DaysScreen() {
  const days = useDayList();

  return (
    <Screen eyebrow="Your journal" title="Days">
      {days.isPending ? (
        [0, 1, 2].map((i) => (
          <Card key={i}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="75%" height={20} />
          </Card>
        ))
      ) : days.isError ? (
        <RetryCard error={days.error} title="Couldn't load your days" onRetry={() => void days.refetch()} />
      ) : days.data.length === 0 ? (
        <Card>
          <EmptyState
            icon={{ ios: 'book', android: 'auto_stories', web: 'auto_stories' }}
            title="No entries yet"
            description="Days you capture and wrap up show up here, newest first."
          />
        </Card>
      ) : (
        days.data.map((day) => <DayRow key={day.date} day={day} />)
      )}
    </Screen>
  );
}

function DayRow({ day }: { day: DaySummary }) {
  const theme = useTheme();
  const label = parseLocalDate(day.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const finalized = day.status === 'finalized';
  const snippets = day.snippetCount === 1 ? '1 snippet' : `${day.snippetCount} snippets`;

  return (
    <Card
      onPress={() => router.push(dayHref(day.date, stepForStatus(day.status)))}
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
