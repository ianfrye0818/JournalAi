import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { DayStatus } from '@/lib/api/types';
import { dayHref, stepForStatus } from '@/lib/days/flow';
import { useDay } from '@/lib/days/queries';
import { getRolloverHour } from '@/lib/settings';

/** From this hour until the rollover, wrapping up is the main action on Today. */
const EVENING_HOUR = 17;

const copy: Record<DayStatus, { title: string; body: string; action: string }> = {
  open: {
    title: 'Wrap up today',
    body: 'A few quick questions, then an entry written in your voice.',
    action: 'Wrap up today',
  },
  interviewing: {
    title: 'Pick up where you left off',
    body: 'There are still a few questions about today.',
    action: 'Continue',
  },
  drafted: {
    title: 'Your entry is drafted',
    body: 'Read it over, make it yours, and finalize the day.',
    action: 'Review draft',
  },
  finalized: {
    title: 'Today is written',
    body: 'Your entry is finalized. Snippets you add now will not be in it unless you reopen it.',
    action: 'Read entry',
  },
};

export function isEvening(now: Date, rolloverHour: number) {
  const hour = now.getHours();
  return hour >= EVENING_HOUR || hour < rolloverHour;
}

/**
 * Today's call to action for the end-of-day flow. Opens the step the day's status says it's on,
 * so a flow left halfway resumes where it stopped. Offline (no status), it starts at Review.
 */
export function WrapUpCard({ date }: { date: string }) {
  const { data } = useDay(date);
  const status = data?.status ?? 'open';
  const { title, body, action } = copy[status];
  // Before evening an untouched day keeps the CTA quiet; once started, it stays prominent.
  const prominent = status !== 'open' || isEvening(new Date(), getRolloverHour());

  return (
    <Card variant={prominent ? 'surface' : 'sunken'}>
      <View style={styles.text}>
        <ThemedText type="heading">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {body}
        </ThemedText>
      </View>
      <Button
        title={action}
        variant={prominent && status !== 'finalized' ? 'primary' : 'secondary'}
        icon={
          status === 'finalized'
            ? { ios: 'book', android: 'auto_stories', web: 'auto_stories' }
            : { ios: 'moon.stars', android: 'bedtime', web: 'bedtime' }
        }
        onPress={() => router.push(dayHref(date, stepForStatus(status)))}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    gap: Spacing.one,
  },
});
