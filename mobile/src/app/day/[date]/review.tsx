import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FLOW_FOOTER_HEIGHT, FlowFooter } from '@/components/day/flow-footer';
import { SnippetCard } from '@/components/snippet-card';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, EmptyState, TextField } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useLocalDate } from '@/hooks/use-local-date';
import type { Snippet } from '@/lib/db/schema';
import { parseLocalDate } from '@/lib/dates';
import { dayHref } from '@/lib/days/flow';
import { dayKeys } from '@/lib/days/queries';
import { haptics } from '@/lib/haptics';
import { snippetsRepo, useSnippetsByDate } from '@/lib/snippets/repo';
import { syncEngine } from '@/lib/sync';

/** Step 1: look over the day's snippets, fix or drop any, then hand them to the AI. */
export default function ReviewScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const today = useLocalDate();
  const { data: items } = useSnippetsByDate(date);
  const [editing, setEditing] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);

  const heading = parseLocalDate(date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const deleteSnippet = (snippet: Snippet) => {
    Alert.alert('Delete snippet?', 'This snippet will be removed from your journal.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await snippetsRepo.remove(snippet.clientId);
            haptics.warning();
          } catch {
            Alert.alert("Couldn't delete snippet", 'Try again.');
          }
        },
      },
    ]);
  };

  // The AI reads the server's copy, so every local edit has to land there first.
  const start = async () => {
    setStarting(true);
    setSyncFailed(false);
    const synced = await syncEngine.flush();
    setStarting(false);
    if (!synced) {
      setSyncFailed(true);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: dayKeys.detail(date) });
    router.push(dayHref(date, 'interview'));
  };

  const count = items.length;

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        bottomOffset={FLOW_FOOTER_HEIGHT + Spacing.three}
        contentContainerStyle={[
          styles.listContent,
          { paddingLeft: insets.left + Spacing.three, paddingRight: insets.right + Spacing.three },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <View style={styles.header}>
          <ThemedText type="caption" themeColor="textSecondary">
            {heading}
          </ThemedText>
          <ThemedText type="title" accessibilityRole="header">
            {count === 0 ? 'Nothing captured' : count === 1 ? '1 snippet' : `${count} snippets`}
          </ThemedText>
          {count > 0 && (
            <ThemedText themeColor="textSecondary">
              Swipe right to edit a snippet or left to delete it before the AI reads them.
            </ThemedText>
          )}
        </View>
        {count === 0 && (
          <Card>
            <EmptyState
              icon={{ ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' }}
              title="No snippets for this day"
              description="Capture a moment or two first, then come back to write the entry."
              // Capture always files under today.
              actionLabel={date === today ? 'Capture a snippet' : undefined}
              onAction={() => router.push('/capture')}
            />
          </Card>
        )}
        {/* A day's snippets are few enough that a plain map beats a virtualized list here. */}
        {items.map((item) =>
          editing === item.clientId ? (
            <SnippetEditor key={item.clientId} snippet={item} onDone={() => setEditing(null)} />
          ) : (
            <SnippetCard
              key={item.clientId}
              snippet={item}
              onEdit={() => setEditing(item.clientId)}
              onDelete={() => void deleteSnippet(item)}
            />
          ),
        )}
      </KeyboardAwareScrollView>
      <FlowFooter>
        {syncFailed && (
          <ThemedText type="small" themeColor="danger" accessibilityRole="alert">
            Couldn&apos;t sync your snippets. Check your connection and try again.
          </ThemedText>
        )}
        <Button
          title={syncFailed ? 'Try again' : 'Start journaling'}
          icon={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
          size="lg"
          fullWidth
          loading={starting}
          disabled={count === 0 || editing !== null}
          onPress={start}
        />
      </FlowFooter>
    </View>
  );
}

function SnippetEditor({ snippet, onDone }: { snippet: Snippet; onDone: () => void }) {
  const [text, setText] = useState(snippet.text);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await snippetsRepo.edit(snippet.clientId, text);
      haptics.success();
      onDone();
    } catch {
      setSaving(false);
      Alert.alert("Couldn't save snippet", 'Your text is still in the box. Try again.');
    }
  };

  return (
    <Card>
      <TextField
        autoFocus
        multiline
        value={text}
        onChangeText={setText}
        accessibilityLabel="Edit snippet"
      />
      <View style={styles.editorActions}>
        <Button title="Cancel" variant="ghost" onPress={onDone} />
        <Button title="Save" loading={saving} disabled={!text.trim()} onPress={save} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  editorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
});
