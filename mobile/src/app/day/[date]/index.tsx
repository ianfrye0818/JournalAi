import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryTags } from '@/components/day/entry-tags';
import { FlowFooter } from '@/components/day/flow-footer';
import { describeError, RetryCard } from '@/components/day/retry-card';
import { MarkdownView } from '@/components/markdown-view';
import { SnippetCard } from '@/components/snippet-card';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Chip, EmptyState, Skeleton } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ApiError } from '@/lib/api/client';
import type { DayStatus, Entry } from '@/lib/api/types';
import { parseLocalDate } from '@/lib/dates';
import { dayHref, stepForStatus } from '@/lib/days/flow';
import { useDay, useReopenDay } from '@/lib/days/queries';
import { canSaveToVault, saveDayToVault, shareDayEntry } from '@/lib/export/actions';
import { useCachedDay } from '@/lib/history/cache';
import { useSnippetsByDate } from '@/lib/snippets/repo';
import { fromRemote } from '@/lib/sync/merge';

const NO_ENTRY = 'No entry yet. Wrap up the day to have one written from your snippets.';
const MID_INTERVIEW = "You're partway through the questions for this day.";

/**
 * One day's page: the entry as written, the snippets behind it, and what you can do next. Reads
 * from the server when it can and from the SQLite cache when it can't, so past days open offline.
 */
export default function DayPage() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const day = useDay(date);
  const cached = useCachedDay(date);
  const { data: localSnippets } = useSnippetsByDate(date);
  const reopen = useReopenDay(date);
  const [showSnippets, setShowSnippets] = useState(false);
  const [exporting, setExporting] = useState(false);

  const entry: Pick<Entry, 'title' | 'body' | 'tags'> | null = day.data?.entry ?? cached.entry ?? null;
  const status: DayStatus = day.data?.status ?? cached.day?.status ?? 'open';
  // Snippets live on the device; until a fresh install's first pull lands, use the server's copy.
  const snippets =
    localSnippets.length > 0 ? localSnippets : (day.data?.snippets.map(fromRemote) ?? []);

  const weekday = parseLocalDate(date).toLocaleDateString(undefined, { weekday: 'long' });
  const contentStyle = [
    styles.content,
    { paddingLeft: insets.left + Spacing.three, paddingRight: insets.right + Spacing.three },
  ];

  if (!entry && snippets.length === 0) {
    return (
      <View style={contentStyle}>
        {day.isPending || !cached.loaded ? (
          <>
            <Skeleton width="30%" height={12} />
            <Skeleton width="70%" height={36} />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={18} />
            ))}
          </>
        ) : day.isError ? (
          <RetryCard error={day.error} title="Couldn't load this day" onRetry={() => void day.refetch()} />
        ) : (
          <Card>
            <EmptyState
              icon={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
              title="Nothing here"
              description="No snippets or entry for this day."
            />
          </Card>
        )}
      </View>
    );
  }

  const snippetList = snippets.map((s) => <SnippetCard key={s.clientId} snippet={s} />);

  const runExport = (job: (e: NonNullable<typeof entry>) => Promise<void>) => {
    if (!entry) return;
    setExporting(true);
    void job(entry).finally(() => setExporting(false));
  };
  const exportEntry = () => {
    const share = () => runExport((e) => shareDayEntry(date, e, day.data));
    if (!canSaveToVault()) return share();
    Alert.alert('Export entry', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share…', onPress: share },
      { text: 'Save to vault', onPress: () => runExport((e) => saveDayToVault(date, e, day.data)) },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.root} contentContainerStyle={[contentStyle, styles.scroll]}>
        {day.isError && (
          <ThemedText type="small" themeColor="textSecondary" accessibilityRole="alert">
            {day.error instanceof ApiError && day.error.isNetworkError
              ? "You're offline. Showing the copy saved on this phone."
              : `Couldn't refresh: ${describeError(day.error)}`}
          </ThemedText>
        )}
        <View style={styles.header}>
          <ThemedText type="caption" themeColor="textSecondary">
            {weekday}
          </ThemedText>
          {entry?.title && (
            <ThemedText type="display" accessibilityRole="header" selectable>
              {entry.title}
            </ThemedText>
          )}
        </View>

        {entry ? (
          <>
            <MarkdownView source={entry.body} />
            <EntryTags tags={entry.tags} />
            {snippets.length > 0 && (
              <View style={styles.snippetToggle}>
                <Chip
                  label={`${showSnippets ? 'Hide' : 'Show'} snippets (${snippets.length})`}
                  icon={{ ios: 'text.bubble', android: 'notes', web: 'notes' }}
                  selected={showSnippets}
                  onPress={() => setShowSnippets((v) => !v)}
                />
              </View>
            )}
            {showSnippets && snippetList}
          </>
        ) : (
          <>
            <ThemedText themeColor="textSecondary">
              {status === 'interviewing' ? MID_INTERVIEW : NO_ENTRY}
            </ThemedText>
            {snippetList}
          </>
        )}
      </ScrollView>

      <FlowFooter>
        {status === 'finalized' ? (
          <>
            {reopen.isError && (
              <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
                {describeError(reopen.error)}
              </ThemedText>
            )}
            <View style={styles.row}>
              <View style={styles.grow}>
                <Button
                  title="Reopen"
                  variant="secondary"
                  icon={{ ios: 'lock.open', android: 'lock_open', web: 'lock_open' }}
                  size="lg"
                  fullWidth
                  loading={reopen.isPending}
                  onPress={() =>
                    reopen.mutate(undefined, { onSuccess: () => router.push(dayHref(date, 'draft')) })
                  }
                />
              </View>
              <View style={styles.grow}>
                <Button
                  title="Export"
                  variant="secondary"
                  icon={{ ios: 'square.and.arrow.up', android: 'ios_share', web: 'ios_share' }}
                  size="lg"
                  fullWidth
                  loading={exporting}
                  disabled={!entry}
                  onPress={exportEntry}
                />
              </View>
            </View>
          </>
        ) : status === 'drafted' ? (
          <Button
            title="Edit entry"
            icon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            size="lg"
            fullWidth
            onPress={() => router.push(dayHref(date, 'draft'))}
          />
        ) : (
          <Button
            title={status === 'interviewing' ? 'Continue' : 'Wrap up this day'}
            icon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
            size="lg"
            fullWidth
            disabled={snippets.length === 0}
            onPress={() => router.push(dayHref(date, stepForStatus(status)))}
          />
        )}
      </FlowFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  scroll: {
    paddingBottom: Spacing.five,
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  snippetToggle: {
    marginTop: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
});
