import { type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, IconButton } from '@/components/ui';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SnippetComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  /** Shows an "Editing" bar with a cancel action. */
  editing?: boolean;
  onCancelEdit?: () => void;
  inputRef?: Ref<TextInputInstance>;
};

export function SnippetComposer({
  value,
  onChangeText,
  onSubmit,
  editing = false,
  onCancelEdit,
  inputRef,
}: SnippetComposerProps) {
  const theme = useTheme();
  const canSubmit = value.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {editing && (
        <View style={styles.editingBar}>
          <ThemedText type="smallBold" themeColor="accent">
            Editing snippet
          </ThemedText>
          <Button title="Cancel" variant="ghost" onPress={onCancelEdit} />
        </View>
      )}
      <View style={styles.row}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="What's happening?"
          accessibilityLabel={editing ? 'Edit snippet' : 'New snippet'}
          placeholderTextColor={theme.textTertiary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          multiline
          textAlignVertical="center"
          style={[styles.input, Typography.default, { color: theme.text }]}
        />
        <IconButton
          icon={
            editing
              ? { ios: 'checkmark', android: 'check', web: 'check' }
              : { ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }
          }
          accessibilityLabel={editing ? 'Save changes' : 'Add snippet'}
          variant="filled"
          size={40}
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one + Spacing.half,
    paddingVertical: Spacing.one + Spacing.half,
  },
  editingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 160,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
});
