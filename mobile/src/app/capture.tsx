import { useQueryClient } from '@tanstack/react-query';
import { afterCapture } from '@/lib/days/after-capture';
import { dayHref } from '@/lib/days/flow';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DictationNotice } from '@/components/capture/dictation-notice';
import { MicButton } from '@/components/capture/mic-button';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui';
import { MaxContentWidth, Spacing, Typography } from '@/constants/theme';
import { useDictation } from '@/hooks/use-dictation';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { snippetsRepo } from '@/lib/snippets/repo';

/**
 * Quick capture, deep-linkable as `journalai://capture`. Opened cold from a link or widget,
 * there's nothing to go back to, so it falls through to Today.
 *
 * Params: `dictate=1` starts the mic straight away (the widget's Dictate button), and `text` with
 * `source=share` prefills something shared from another app (see `useShareCapture`).
 */
export default function CaptureScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ text?: string; source?: string; dictate?: string }>();
  const shared = params.source === 'share';
  const [text, setText] = useState(params.text ?? '');
  const [saving, setSaving] = useState(false);
  const dictation = useDictation({ value: text, onChangeText: setText });

  const autoDictated = useRef(false);
  useEffect(() => {
    if (params.dictate !== '1' || autoDictated.current) return;
    autoDictated.current = true;
    dictation.toggle();
    // Once per open; dictation.toggle is a new function every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.dictate]);
  const listening = dictation.active;
  const bottomPadding = insets.bottom + Spacing.three;

  const close = () => {
    dictation.cancel();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const save = async () => {
    if (!text.trim()) return;
    dictation.cancel();
    setSaving(true);
    try {
      const snippet = await snippetsRepo.add(text, {
        source: shared ? 'share' : dictation.dictated ? 'voice' : 'text',
      });
      haptics.success();
      setText('');
      void afterCapture(queryClient, snippet.localDate, {
        onKeep: close,
        onReopened: () => router.replace(dayHref(snippet.localDate, 'draft')),
      });
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
          paddingBottom: bottomPadding,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Button title="Cancel" variant="ghost" onPress={close} />
          <ThemedText type="heading" accessibilityRole="header">
            {shared ? 'Save to journal' : 'Quick capture'}
          </ThemedText>
          <Button title="Save" loading={saving} disabled={!text.trim()} onPress={save} />
        </View>
        <TextInput
          autoFocus
          multiline
          value={text}
          onChangeText={setText}
          editable={!listening}
          placeholder={listening ? 'Listening…' : "What's happening?"}
          accessibilityLabel="New snippet"
          placeholderTextColor={theme.textTertiary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          textAlignVertical="top"
          style={[styles.input, Typography.entry, { color: theme.text }]}
        />
        <KeyboardStickyView offset={{ opened: bottomPadding - Spacing.three }}>
          <DictationNotice dictation={dictation} />
          <View style={styles.toolbar}>
            <MicButton
              size={56}
              status={dictation.status}
              level={dictation.level}
              onPress={dictation.toggle}
            />
          </View>
        </KeyboardStickyView>
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
  toolbar: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
