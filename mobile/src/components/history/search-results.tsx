import { router } from 'expo-router';
import { Text } from 'react-native';

import { RetryCard } from '@/components/day/retry-card';
import { ThemedText } from '@/components/themed-text';
import { Card, EmptyState, Skeleton } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { parseLocalDate } from '@/lib/dates';
import { dayPageHref } from '@/lib/days/flow';
import { excerpt } from '@/lib/history/excerpt';
import { useEntrySearch, type SearchHit } from '@/lib/history/queries';

/** Entries matching `q` (already debounced), newest first. */
export function SearchResults({ q }: { q: string }) {
  const search = useEntrySearch(q);

  if (search.isPending) {
    return [0, 1].map((i) => (
      <Card key={i}>
        <Skeleton width="30%" height={12} />
        <Skeleton width="60%" height={20} />
        <Skeleton height={14} />
      </Card>
    ));
  }
  if (search.isError) {
    return <RetryCard error={search.error} title="Search failed" onRetry={() => void search.refetch()} />;
  }

  const { hits, source } = search.data;
  const offlineNote =
    source === 'local' ? (
      <ThemedText type="small" themeColor="textSecondary" accessibilityRole="alert">
        You&apos;re offline, so only entries saved on this phone were searched.
      </ThemedText>
    ) : null;

  if (hits.length === 0) {
    return (
      <>
        {offlineNote}
        <Card>
          <EmptyState
            icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            title="No matches"
            description={`No entry mentions “${q}”.`}
          />
        </Card>
      </>
    );
  }

  return (
    <>
      {offlineNote}
      <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
        {hits.length === 1 ? '1 entry' : `${hits.length} entries`}
      </ThemedText>
      {hits.map((hit) => (
        <SearchHitCard key={hit.date} hit={hit} q={q} />
      ))}
    </>
  );
}

function SearchHitCard({ hit, q }: { hit: SearchHit; q: string }) {
  const theme = useTheme();
  const label = parseLocalDate(hit.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const { before, match, after } = excerpt(hit.body, q);

  return (
    <Card
      onPress={() => router.push(dayPageHref(hit.date))}
      accessibilityLabel={`${label}: ${hit.title ?? 'Untitled'}`}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="heading" themeColor={hit.title ? 'text' : 'textSecondary'}>
        {hit.title ?? 'Untitled'}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
        {before}
        {match && <Text style={{ color: theme.text, fontWeight: 600 }}>{match}</Text>}
        {after}
      </ThemedText>
    </Card>
  );
}
