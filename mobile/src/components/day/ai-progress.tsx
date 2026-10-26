import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, Skeleton } from '@/components/ui';
import { Spacing } from '@/constants/theme';

export type AiProgressProps = {
  /** Shown in order, a few seconds each; the last one stays up. */
  messages: readonly string[];
  /** Placeholder lines under the copy, shaped like what's coming. */
  lines?: number;
};

const STEP_MS = 3_000;

export const progressCopy = {
  interview: ['Reading through your day…', 'Looking for the gaps…', 'Thinking of a few questions…'],
  followUp: ['Taking that in…', 'Seeing if anything is missing…', 'Almost there…'],
  draft: ['Gathering your snippets…', 'Finding the thread of the day…', 'Writing it in your voice…', 'Polishing the last lines…'],
  rewrite: ['Reading your notes…', 'Rewriting the entry…', 'Polishing the last lines…'],
} as const;

/** Friendly copy for AI calls, which take several seconds. */
export function AiProgress({ messages, lines = 4 }: AiProgressProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => Math.min(i + 1, messages.length - 1)),
      STEP_MS,
    );
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <Card>
      <View accessibilityLiveRegion="polite" accessibilityRole="progressbar">
        <ThemedText type="defaultSemiBold" themeColor="textSecondary">
          {messages[index]}
        </ThemedText>
      </View>
      <View style={styles.lines}>
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  lines: {
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
});
