import { useRef, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View, type TextInputInstance } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SnippetCard } from '@/components/snippet-card';
import { SnippetComposer } from '@/components/snippet-composer';
import { SyncStatus } from '@/components/sync-status';
import { ThemedText } from '@/components/themed-text';
import { Card, EmptyState } from '@/components/ui';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDictation } from '@/hooks/use-dictation';
import { useLocalDate } from '@/hooks/use-local-date';
import { useTheme } from '@/hooks/use-theme';
import type { Snippet } from '@/lib/db/schema';
import { parseLocalDate } from '@/lib/dates';
import { haptics } from '@/lib/haptics';
import { snippetsRepo, useSnippetsByDate } from '@/lib/snippets/repo';

export default function TodayScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const today = useLocalDate();
  const { data: items } = useSnippetsByDate(today);
  const inputRef = useRef<TextInputInstance>(null);
  const listRef = useRef<FlatList<Snippet>>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<Snippet | null>(null);
  const dictation = useDictation({ value: draft, onChangeText: setDraft });

  // On iOS the screen runs under the tab bar; on Android native tabs already inset it. Either way,
  // the keyboard covers the tab bar, so the composer only needs to clear it while the keyboard is down.
  const tabBarGap = BottomTabInset + insets.bottom;
  const restingPadding = Platform.OS === 'ios' ? tabBarGap : 0;

  const eyebrow = parseLocalDate(today).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const cancelEdit = () => {
    dictation.cancel();
    dictation.reset();
    setEditing(null);
    setDraft('');
  };

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    // Save what's on screen; a late final result shouldn't refill the box after it clears.
    dictation.cancel();
    try {
      if (editing) {
        await snippetsRepo.edit(editing.clientId, text);
        setEditing(null);
      } else {
        await snippetsRepo.add(text, { source: dictation.dictated ? 'voice' : 'text' });
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      }
      setDraft('');
      dictation.reset();
      haptics.success();
    } catch {
      Alert.alert("Couldn't save snippet", 'Your text is still in the box. Try again.');
    }
  };

  const openActions = (snippet: Snippet) => {
    haptics.longPress();
    Alert.alert('Snippet', undefined, [
      {
        text: 'Edit',
        onPress: () => {
          setEditing(snippet);
          setDraft(snippet.text);
          inputRef.current?.focus();
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (editing?.clientId === snippet.clientId) cancelEdit();
          await snippetsRepo.remove(snippet.clientId);
          haptics.warning();
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const count = items.length;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.clientId}
        renderItem={({ item }) => (
          <SnippetCard
            snippet={item}
            editing={editing?.clientId === item.clientId}
            onLongPress={() => openActions(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemedText type="caption" themeColor="textSecondary">
                {eyebrow}
              </ThemedText>
              <ThemedText type="display" accessibilityRole="header">
                Today
              </ThemedText>
            </View>
            <View style={styles.headerMeta}>
              <SyncStatus />
              {count > 0 && (
                <ThemedText type="small" themeColor="textSecondary">
                  {count === 1 ? '1 snippet' : `${count} snippets`}
                </ThemedText>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card>
            <EmptyState
              icon={{ ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' }}
              title="Nothing captured yet"
              description="Jot down moments as they happen. They stay on your phone until tonight."
            />
          </Card>
        }
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />

      <KeyboardStickyView offset={{ opened: tabBarGap }}>
        <View
          style={[
            styles.composer,
            {
              paddingBottom: restingPadding + Spacing.two,
              paddingLeft: insets.left + Spacing.three,
              paddingRight: insets.right + Spacing.three,
            },
          ]}>
          <SnippetComposer
            inputRef={inputRef}
            value={draft}
            onChangeText={setDraft}
            onSubmit={submit}
            dictation={dictation}
            editing={!!editing}
            onCancelEdit={cancelEdit}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.one,
  },
  headerMeta: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  composer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingTop: Spacing.two,
  },
});
