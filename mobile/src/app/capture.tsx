import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { snippetsRepo } from '@/lib/snippets/repo';

/**
 * Quick capture, deep-linkable as `journalai://capture`. Opened cold from a link (or the widget,
 * later) there's nothing to go back to, so it falls through to Today.
 */
export default function CaptureScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const save = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await snippetsRepo.add(text);
      haptics.success();
      close();
    } catch {
      setSaving(false);
      Alert.alert("Couldn't save snippet", 'Your text is still here. Try again.');
    }
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          // iOS sheets start below the status bar; Android modals are full screen.
          paddingTop: process.env.EXPO_OS === 'ios' ? Spacing.three : insets.top + Spacing.two,
          paddingBottom: insets.bottom + Spacing.three,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Button title="Cancel" variant="ghost" onPress={close} />
          <ThemedText type="heading" accessibilityRole="header">
            Quick capture
          </ThemedText>
          <Button title="Save" loading={saving} disabled={!text.trim()} onPress={save} />
        </View>
        <TextInput
          autoFocus
          multiline
          value={text}
          onChangeText={setText}
          placeholder="What's happening?"
          accessibilityLabel="New snippet"
          placeholderTextColor={theme.textTertiary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          textAlignVertical="top"
          style={[styles.input, Typography.entry, { color: theme.text }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
  },
});
