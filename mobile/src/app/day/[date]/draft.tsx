import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiProgress, progressCopy } from '@/components/day/ai-progress';
import { EntryTags } from '@/components/day/entry-tags';
import { FLOW_FOOTER_HEIGHT, FlowFooter } from '@/components/day/flow-footer';
import { describeError, RetryCard } from '@/components/day/retry-card';
import { MarkdownView } from '@/components/markdown-view';
import { ThemedText } from '@/components/themed-text';
import { Button, TextField } from '@/components/ui';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import type { Entry } from '@/lib/api/types';
import { parseLocalDate } from '@/lib/dates';
import {
  aiMutationKeys,
  useDay,
  useDraftEntry,
  useFinalizeDay,
  useReopenDay,
  useUpdateEntry,
} from '@/lib/days/queries';
import { haptics } from '@/lib/haptics';

const AUTOSAVE_MS = 1_500;

/** Step 3: read the AI's draft, edit it as markdown, regenerate with feedback, and finalize. */
export default function DraftScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const day = useDay(date);
  const draft = useDraftEntry(date);
  const finalize = useFinalizeDay(date);
  const reopen = useReopenDay(date);
  const [editing, setEditing] = useState(false);
  const requested = useRef(false);

  const entry = day.data?.entry ?? null;
  const finalized = day.data?.status === 'finalized';

  // Arriving without an entry (straight from the interview, or "Skip to draft") writes one.
  useEffect(() => {
    if (!day.data || day.data.entry || requested.current) return;
    requested.current = true;
    // A draft started before leaving and coming back is still on its way.
    if (queryClient.isMutating({ mutationKey: aiMutationKeys.draft(date) }) > 0) return;
    draft.mutate(undefined);
    // draft.mutate is stable; only the loaded day matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day.data]);

  const heading = parseLocalDate(date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const contentStyle = [
    styles.content,
    {
      paddingBottom: Spacing.five,
      paddingLeft: insets.left + Spacing.three,
      paddingRight: insets.right + Spacing.three,
    },
  ];

  if (day.isPending || (!entry && !draft.isError && !day.isError)) {
    return (
      <View style={contentStyle}>
        <AiProgress
          messages={day.isPending ? ['Opening your day…'] : progressCopy.draft}
          lines={8}
        />
      </View>
    );
  }
  if (day.isError) {
    return (
      <View style={contentStyle}>
        <RetryCard error={day.error} title="Couldn't load this day" onRetry={() => void day.refetch()} />
      </View>
    );
  }
  if (!entry) {
    return (
      <View style={contentStyle}>
        <RetryCard
          error={draft.error}
          title="Couldn't write the entry"
          onRetry={() => draft.mutate(undefined)}
        />
      </View>
    );
  }

  if (editing) {
    return <EntryEditor date={date} entry={entry} onDone={() => setEditing(false)} />;
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.root} contentContainerStyle={contentStyle}>
        <View style={styles.header}>
          <ThemedText type="caption" themeColor="textSecondary">
            {heading}
          </ThemedText>
          {entry.title && (
            <ThemedText type="display" accessibilityRole="header" selectable>
              {entry.title}
            </ThemedText>
          )}
        </View>
        <MarkdownView source={entry.body} />
        <EntryTags tags={entry.tags} />
      </ScrollView>

      <FlowFooter>
        {finalized ? (
          <>
            <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
              Finalized. Reopen it to make changes.
            </ThemedText>
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
                  size="lg"
                  fullWidth
                  loading={reopen.isPending}
                  onPress={() => reopen.mutate()}
                />
              </View>
              <View style={styles.grow}>
                <Button title="Done" size="lg" fullWidth onPress={() => router.dismissTo('/')} />
              </View>
            </View>
          </>
        ) : (
          <>
            {finalize.isError && (
              <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
                {describeError(finalize.error)}
              </ThemedText>
            )}
            <View style={styles.row}>
              <View style={styles.grow}>
                <Button
                  title="Edit"
                  variant="secondary"
                  icon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                  fullWidth
                  disabled={finalize.isPending}
                  onPress={() => setEditing(true)}
                />
              </View>
              <View style={styles.grow}>
                <Button
                  title="Regenerate"
                  variant="secondary"
                  icon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                  fullWidth
                  disabled={finalize.isPending}
                  onPress={() =>
                    router.push({ pathname: '/day/[date]/feedback', params: { date } })
                  }
                />
              </View>
            </View>
            <Button
              title="Finalize"
              icon={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size="lg"
              fullWidth
              loading={finalize.isPending}
              onPress={() =>
                finalize.mutate(undefined, {
                  onSuccess: () => {
                    haptics.success();
                    router.dismissTo('/');
                  },
                })
              }
            />
          </>
        )}
      </FlowFooter>
    </View>
  );
}

/**
 * Markdown editor for the entry. Saves on its own once typing pauses, and once more on the way
 * out, so leaving the screen mid-edit keeps the text.
 */
function EntryEditor({ date, entry, onDone }: { date: string; entry: Entry; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const update = useUpdateEntry(date);
  const [title, setTitle] = useState(entry.title ?? '');
  const [body, setBody] = useState(entry.body);

  // Compare trimmed: the server trims titles, and an untrimmed compare would never settle.
  const dirty = title.trim() !== (entry.title ?? '') || body !== entry.body;
  const valid = body.trim().length > 0;
  const patch = { id: entry.id, patch: { title, body } };

  const latest = useRef<typeof patch | null>(null);
  useEffect(() => {
    latest.current = dirty && valid ? patch : null;
  });
  useEffect(() => () => {
    if (latest.current) update.mutate(latest.current);
    // Unmount only; `latest` holds the newest edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dirty || !valid) return;
    const timer = setTimeout(() => update.mutate(patch), AUTOSAVE_MS);
    return () => clearTimeout(timer);
    // Restart the quiet period on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body]);

  const done = async () => {
    if (dirty && valid) {
      try {
        await update.mutateAsync(patch);
      } catch {
        return;
      }
    }
    latest.current = null;
    onDone();
  };

  const status = update.isError
    ? describeError(update.error)
    : update.isPending
      ? 'Saving…'
      : dirty
        ? 'Unsaved changes'
        : 'All changes saved';

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        bottomOffset={FLOW_FOOTER_HEIGHT + Spacing.three}
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Spacing.five,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}
        keyboardShouldPersistTaps="handled">
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          maxLength={200}
          placeholder="Give the day a name"
          serif
        />
        <TextField
          label="Entry"
          hint="Markdown works here: # heading, **bold**, *italic*, - list"
          error={valid ? undefined : 'The entry needs some text.'}
          value={body}
          onChangeText={setBody}
          multiline
          serif
          scrollEnabled={false}
          style={styles.editor}
          autoCorrect
        />
      </KeyboardAwareScrollView>
      <FlowFooter>
        <ThemedText
          type="small"
          themeColor={update.isError ? 'danger' : 'textTertiary'}
          accessibilityLiveRegion="polite"
          style={styles.center}>
          {status}
        </ThemedText>
        <Button
          title="Done"
          size="lg"
          fullWidth
          loading={update.isPending}
          disabled={!valid}
          onPress={done}
        />
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
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  grow: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  editor: {
    ...Typography.entry,
    minHeight: 360,
  },
});
