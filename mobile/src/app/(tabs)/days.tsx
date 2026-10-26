import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { describeError, RetryCard } from '@/components/day/retry-card';
import { DayRow } from '@/components/history/day-row';
import { MonthCalendar } from '@/components/history/month-calendar';
import { SearchResults } from '@/components/history/search-results';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, EmptyState, Icon, IconButton, Screen, Skeleton, TextField } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalDate } from '@/hooks/use-local-date';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/lib/api/client';
import { parseLocalDate } from '@/lib/dates';
import { dayPageHref } from '@/lib/days/flow';
import { useDayList } from '@/lib/days/queries';
import { shareMonth } from '@/lib/export/actions';
import { finalizedStreak, monthOf } from '@/lib/history/calendar';
import { useHistory } from '@/lib/history/queries';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * History: a month calendar over the days list, plus search. Everything renders from the SQLite
 * cache, so past days load offline; the server list refreshes the cache in the background.
 */
export default function DaysScreen() {
  const today = useLocalDate();
  const refresh = useDayList();
  const { days, loaded } = useHistory();
  const [month, setMonth] = useState(() => monthOf(today));
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query.trim(), SEARCH_DEBOUNCE_MS);
  // Typing waits for a pause; clearing goes back to the calendar at once.
  const q = query.trim() ? debounced : '';

  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const streak = useMemo(
    () => finalizedStreak(new Set(days.filter((d) => d.status === 'finalized').map((d) => d.date)), today),
    [days, today],
  );
  const inMonth = days.filter((d) => monthOf(d.date) === month);
  const finalizedInMonth = inMonth.filter((d) => d.status === 'finalized').length;
  const [exporting, setExporting] = useState(false);
  const exportMonth = () => {
    setExporting(true);
    void shareMonth(month).finally(() => setExporting(false));
  };
  const monthName = parseLocalDate(`${month}-01`).toLocaleDateString(undefined, { month: 'long' });
  const open = (date: string) => router.push(dayPageHref(date));

  let body;
  if (q) {
    body = <SearchResults q={q} />;
  } else if (!loaded || (days.length === 0 && refresh.isPending)) {
    body = [0, 1, 2].map((i) => (
      <Card key={i}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="75%" height={20} />
      </Card>
    ));
  } else if (days.length === 0 && refresh.isError) {
    body = (
      <RetryCard
        error={refresh.error}
        title="Couldn't load your days"
        onRetry={() => void refresh.refetch()}
      />
    );
  } else if (days.length === 0) {
    body = (
      <Card>
        <EmptyState
          icon={{ ios: 'book', android: 'auto_stories', web: 'auto_stories' }}
          title="No entries yet"
          description="Days you capture and wrap up show up here, newest first."
        />
      </Card>
    );
  } else {
    body = (
      <>
        {refresh.isError && (
          <View style={styles.notice}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.grow}>
              {refresh.error instanceof ApiError && refresh.error.isNetworkError
                ? "You're offline. Showing days saved on this phone."
                : `Couldn't refresh: ${describeError(refresh.error)}`}
            </ThemedText>
            <Button
              title="Retry"
              variant="ghost"
              loading={refresh.isFetching}
              onPress={() => void refresh.refetch()}
            />
          </View>
        )}
        <MonthCalendar month={month} onChangeMonth={setMonth} days={byDate} today={today} onPressDay={open} />
        {finalizedInMonth > 0 && (
          <View style={styles.export}>
            <Button
              title={`Export ${monthName}`}
              variant="ghost"
              icon={{ ios: 'square.and.arrow.up', android: 'ios_share', web: 'ios_share' }}
              loading={exporting}
              accessibilityHint={`Shares the ${finalizedInMonth} finalized ${finalizedInMonth === 1 ? 'entry' : 'entries'} as a zip of markdown files`}
              onPress={exportMonth}
            />
          </View>
        )}
        {inMonth.length === 0 ? (
          <ThemedText themeColor="textSecondary" style={styles.center}>
            Nothing captured in {monthName}.
          </ThemedText>
        ) : (
          inMonth.map((day) => <DayRow key={day.date} day={day} onPress={() => open(day.date)} />)
        )}
      </>
    );
  }

  return (
    <Screen eyebrow="Your journal" title="Days" headerRight={streak > 0 && <StreakBadge days={streak} />}>
      <View style={styles.search}>
        <View style={styles.grow}>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="Search entries"
            accessibilityLabel="Search entries"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={200}
          />
        </View>
        {query.length > 0 && (
          <IconButton
            icon={{ ios: 'xmark', android: 'close', web: 'close' }}
            accessibilityLabel="Clear search"
            variant="tonal"
            onPress={() => setQuery('')}
          />
        )}
      </View>
      {body}
    </Screen>
  );
}

function StreakBadge({ days }: { days: number }) {
  const theme = useTheme();
  const label = days === 1 ? '1 day' : `${days} days`;
  return (
    <View
      style={[styles.streak, { backgroundColor: theme.accentSoft }]}
      accessibilityLabel={`${label} in a row finalized`}>
      <Icon
        name={{ ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' }}
        size={16}
        themeColor="accent"
      />
      <ThemedText type="smallBold" themeColor="accent">
        {label}
      </ThemedText>
    </View>
  );
}

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return debounced;
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  export: {
    alignItems: 'flex-end',
    marginTop: -Spacing.two,
  },
  center: {
    textAlign: 'center',
    paddingVertical: Spacing.three,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
    marginBottom: Spacing.two,
  },
});
