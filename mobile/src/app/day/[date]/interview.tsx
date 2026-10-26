import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiProgress, progressCopy } from '@/components/day/ai-progress';
import { ProgressDots } from '@/components/day/progress-dots';
import { QuestionCard } from '@/components/day/question-card';
import { describeError, RetryCard } from '@/components/day/retry-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import type { AnswerPayload } from '@/lib/api/types';
import { dayHref, isPending, nextInterviewAction, roundToAnswer } from '@/lib/days/flow';
import {
  aiMutationKeys,
  useAnswerQuestion,
  useDay,
  useStartInterviewRound,
} from '@/lib/days/queries';
import { haptics } from '@/lib/haptics';

/**
 * Step 2: the AI's follow-up questions, one card at a time. When a round is done it asks for the
 * next one; when there's nothing left to ask it moves on to the draft.
 */
export default function InterviewScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const day = useDay(date);
  const startRound = useStartInterviewRound(date);
  const answer = useAnswerQuestion(date);
  // Null follows the first unanswered question; a number pins one (after tapping Back).
  const [pinned, setPinned] = useState<number | null>(null);
  // The round we last asked the AI to follow, so a re-render can't ask twice.
  const requestedAfter = useRef<number | null>(null);

  const data = day.data;
  const pastInterview = data?.status === 'drafted' || data?.status === 'finalized';
  const action = data ? (pastInterview ? 'draft' : nextInterviewAction(data)) : null;
  const round = data ? roundToAnswer(data) : [];
  const firstPending = round.findIndex(isPending);
  // A pin from another round can be out of range; fall back to following the first pending one.
  const index =
    pinned !== null && pinned < round.length ? pinned : firstPending === -1 ? 0 : firstPending;
  const question = round[index];

  const fetchRound = () => {
    startRound.mutate(undefined, {
      onSuccess: (res) => {
        if (res.readyToDraft && res.questions.length === 0) router.replace(dayHref(date, 'draft'));
      },
    });
  };

  useEffect(() => {
    if (action !== 'fetch-round' || !data) return;
    if (requestedAfter.current === data.interviewRound) return;
    requestedAfter.current = data.interviewRound;
    // Left and came back while a round was still being written: its result lands in the cache.
    if (queryClient.isMutating({ mutationKey: aiMutationKeys.interview(date) }) > 0) return;
    fetchRound();
    // fetchRound is recreated every render; the round number is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, data?.interviewRound]);

  useEffect(() => {
    if (action === 'draft') router.replace(dayHref(date, 'draft'));
  }, [action, date]);

  const reply = (body: AnswerPayload) => {
    if (!question) return;
    answer.mutate(
      { id: question.id, body },
      {
        onSuccess: () => {
          haptics.success();
          // Go to the next unanswered question after this one, or let the round finish.
          const next = round.findIndex((q, i) => i > index && isPending(q));
          setPinned(next === -1 ? null : next);
        },
      },
    );
  };

  const done = new Set(round.flatMap((q, i) => (isPending(q) ? [] : [i])));
  const followUp = (data?.interviewRound ?? 0) > 0;

  let body;
  if (day.isPending) {
    body = <AiProgress messages={['Opening your day…']} lines={3} />;
  } else if (day.isError) {
    body = <RetryCard error={day.error} title="Couldn't load this day" onRetry={() => void day.refetch()} />;
  } else if (startRound.isError && action === 'fetch-round') {
    body = <RetryCard error={startRound.error} title="Couldn't get questions" onRetry={fetchRound} />;
  } else if (action !== 'answer' || !question) {
    body = <AiProgress messages={followUp ? progressCopy.followUp : progressCopy.interview} />;
  } else {
    body = (
      <>
        <View style={styles.progress}>
          <ThemedText type="caption" themeColor="textSecondary">
            {question.round > 1 ? 'Follow-up · ' : ''}
            {index + 1} of {round.length}
          </ThemedText>
          <ProgressDots count={round.length} current={index} done={done} />
        </View>
        <QuestionCard
          key={question.id}
          question={question}
          busy={answer.isPending}
          onReply={reply}
        />
        {answer.isError && (
          <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
            {describeError(answer.error)}
          </ThemedText>
        )}
        <View style={styles.secondary}>
          {index > 0 ? (
            <Button
              title="Back"
              variant="ghost"
              icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              disabled={answer.isPending}
              onPress={() => setPinned(index - 1)}
            />
          ) : (
            <View />
          )}
          <Button
            title="Skip to draft"
            variant="ghost"
            disabled={answer.isPending}
            onPress={() => router.replace(dayHref(date, 'draft'))}
          />
        </View>
      </>
    );
  }

  return (
    <KeyboardAwareScrollView
      bottomOffset={Spacing.four}
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + Spacing.five,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive">
      {body}
    </KeyboardAwareScrollView>
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
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
