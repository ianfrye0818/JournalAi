import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DictationNotice } from '@/components/capture/dictation-notice';
import { MicButton } from '@/components/capture/mic-button';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Chip, TextField } from '@/components/ui';
import { Spacing, Typography } from '@/constants/theme';
import { useDictation } from '@/hooks/use-dictation';
import type { AnswerPayload, Question } from '@/lib/api/types';

const pencilIcon = { ios: 'pencil', android: 'edit', web: 'edit' } as const;

export type QuestionCardProps = {
  question: Question;
  /** Saving this question's reply. */
  busy: boolean;
  onReply: (body: AnswerPayload) => void;
};

/**
 * One interview question: tap a suggested answer, write your own (typed or dictated), or skip.
 * Key it by question id so its local state resets per question.
 */
export function QuestionCard({ question, busy, onReply }: QuestionCardProps) {
  // Coming back to an answered question shows what was sent.
  const previous = question.answer;
  const previousIsOption = previous !== null && question.options.includes(previous);
  const [selected, setSelected] = useState<string | null>(previousIsOption ? previous : null);
  // With nothing to tap, the text box is the only way to answer.
  const [writing, setWriting] = useState(
    question.options.length === 0 || (previous !== null && !previousIsOption),
  );
  const [custom, setCustom] = useState(previousIsOption ? '' : (previous ?? ''));
  const dictation = useDictation({ value: custom, onChangeText: setCustom });

  const answer = writing ? custom.trim() : selected;

  const choose = (option: string) => {
    dictation.cancel();
    setWriting(false);
    setSelected((current) => (current === option ? null : option));
  };

  const writeOwn = () => {
    setSelected(null);
    setWriting(true);
  };

  const submit = () => {
    dictation.cancel();
    if (answer) onReply({ answer });
  };

  const skip = () => {
    dictation.cancel();
    onReply({ skipped: true });
  };

  return (
    <Card style={styles.card}>
      <ThemedText style={Typography.entry} accessibilityRole="header">
        {question.text}
      </ThemedText>
      {question.rationale && (
        <ThemedText type="small" themeColor="textTertiary">
          {question.rationale}
        </ThemedText>
      )}

      <View style={styles.options}>
        {question.options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected === option}
            disabled={busy}
            onPress={() => choose(option)}
          />
        ))}
        {!writing && (
          <Chip label="Write my own" icon={pencilIcon} disabled={busy} onPress={writeOwn} />
        )}
      </View>

      {writing && (
        <View style={styles.writing}>
          <DictationNotice dictation={dictation} />
          <View style={styles.writeRow}>
            <View style={styles.field}>
              <TextField
                autoFocus={!previous}
                multiline
                value={custom}
                onChangeText={setCustom}
                editable={!dictation.active && !busy}
                placeholder={dictation.active ? 'Listening…' : 'In your own words…'}
                accessibilityLabel="Your answer"
              />
            </View>
            <MicButton
              status={dictation.status}
              level={dictation.level}
              onPress={dictation.toggle}
              disabled={busy}
            />
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Button title="Skip" variant="ghost" disabled={busy} onPress={skip} />
        <Button title="Next" loading={busy} disabled={!answer} onPress={submit} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  writing: {
    gap: Spacing.one,
  },
  writeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  field: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
