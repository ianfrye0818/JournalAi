import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiProgress, progressCopy } from '@/components/day/ai-progress';
import { describeError } from '@/components/day/retry-card';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useDay, useDraftEntry } from '@/lib/days/queries';
import { haptics } from '@/lib/haptics';

const suggestions = ['Shorter', 'More detail', 'Less formal', 'More reflective', 'Fewer headings'];

/**
 * Sheet over the draft: tell the AI how the entry should change. It stays open while the rewrite
 * runs so a failure can be retried without retyping.
 */
export default function FeedbackSheet() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const { data: day } = useDay(date);
  const draft = useDraftEntry(date);
  const [feedback, setFeedback] = useState('');

  const entry = day?.entry;
  const edited = !!entry && entry.body !== entry.aiDraft;

  const addSuggestion = (text: string) =>
    setFeedback((current) => (current.trim() ? `${current.trim()}, ${text.toLowerCase()}` : text));

  const rewrite = () => {
    draft.mutate(feedback.trim() || undefined, {
      onSuccess: () => {
        haptics.success();
        router.back();
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.four,
          paddingLeft: insets.left + Spacing.four,
          paddingRight: insets.right + Spacing.four,
        },
      ]}
      keyboardShouldPersistTaps="handled">
      <ThemedText type="heading" accessibilityRole="header">
        Regenerate with feedback
      </ThemedText>

      {draft.isPending ? (
        <AiProgress messages={progressCopy.rewrite} lines={3} />
      ) : (
        <>
          <ThemedText themeColor="textSecondary">
            What should be different? The AI keeps your snippets and answers and rewrites from the
            current entry.
          </ThemedText>
          <View style={styles.chips}>
            {suggestions.map((s) => (
              <Chip key={s} label={s} onPress={() => addSuggestion(s)} />
            ))}
          </View>
          <TextField
            autoFocus
            multiline
            value={feedback}
            onChangeText={setFeedback}
            maxLength={2000}
            placeholder="e.g. less about work, more about the walk"
            accessibilityLabel="Feedback for the rewrite"
          />
          {edited && (
            <ThemedText type="small" themeColor="textTertiary">
              The new draft replaces your edits. They&apos;re sent along so the AI can build on them.
            </ThemedText>
          )}
          {draft.isError && (
            <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
              {describeError(draft.error)}
            </ThemedText>
          )}
        </>
      )}

      <View style={styles.actions}>
        <Button title="Cancel" variant="ghost" disabled={draft.isPending} onPress={() => router.back()} />
        <Button
          title={draft.isError ? 'Try again' : 'Rewrite'}
          icon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
          loading={draft.isPending}
          onPress={rewrite}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
});
