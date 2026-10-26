import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { router, useFocusEffect } from 'expo-router';
import { formatTime, formatStoredTime } from '@/lib/time';
import { useTimeFormat, setTimeFormat, useRolloverHour } from '@/lib/settings';
import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ExportSettingsCard } from '@/components/settings/export-settings';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Icon, Screen, type IconName } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth/auth-context';
import { getReminderTime } from '@/lib/reminders';
import { usePendingSnippetCount } from '@/lib/sync';

function SettingRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Icon name={icon} size={20} themeColor="textSecondary" />
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText themeColor={onPress ? 'accent' : 'textSecondary'}>{value}</ThemedText>
      {onPress && (
        <Icon
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          themeColor="textTertiary"
        />
      )}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {content}
    </Pressable>
  ) : (
    <View style={styles.row}>{content}</View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, signOut, deleteAccount, updateProfile } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const style = useQuery({
    queryKey: ['style-profile'],
    queryFn: () => api<{ samples: string; notes: string | null } | null>('/style-profile'),
  });
  const hour = useRolloverHour();
  const timeFormat = useTimeFormat();
  const [reminder, setReminder] = useState('…');
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getReminderTime()
        .then((time) => {
          if (active) setReminder(time || 'Off');
        })
        .catch(() => {
          if (active) setReminder('Unavailable');
        });
      return () => {
        active = false;
      };
    }, []),
  );
  const [deleting, setDeleting] = useState(false);
  const pending = usePendingSnippetCount();

  const confirmSignOut = () => {
    const doSignOut = () => {
      setSigningOut(true);
      signOut();
    };
    if (pending === 0) return doSignOut();
    const noun = pending === 1 ? '1 snippet hasn’t' : `${pending} snippets haven’t`;
    Alert.alert(
      `${noun} synced yet`,
      'We’ll try to upload them first. If that fails, they stay on this phone until you sign back in to this account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: doSignOut },
      ],
    );
  };

  return (
    <Screen title="Settings">
      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Account
        </ThemedText>
        <SettingRow
          icon={{
            ios: 'person.crop.circle',
            android: 'account_circle',
            web: 'account_circle',
          }}
          label="Signed in as"
          value={user?.email ?? '…'}
        />
        <Button
          title="Sign out"
          variant="secondary"
          icon={{
            ios: 'rectangle.portrait.and.arrow.right',
            android: 'logout',
            web: 'logout',
          }}
          loading={signingOut}
          onPress={confirmSignOut}
        />
      </Card>

      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Journal
        </ThemedText>
        <SettingRow
          icon={{
            ios: 'moon.stars',
            android: 'wb_twilight',
            web: 'wb_twilight',
          }}
          onPress={() => router.push('/settings/day')}
          label="New day starts at"
          value={formatTime(hour, 0, timeFormat)}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'textformat', android: 'edit_note', web: 'edit_note' }}
          onPress={() => router.push('/settings/style')}
          label="Writing style"
          value={
            style.isPending
              ? '…'
              : style.isError
                ? 'Unavailable'
                : style.data?.samples || style.data?.notes
                  ? 'Personalized'
                  : 'Not set'
          }
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
          label="Evening reminder"
          value={/^\d{2}:\d{2}$/.test(reminder) ? formatStoredTime(reminder, timeFormat) : reminder}
          onPress={() => router.push('/settings/reminder')}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          label="Monthly recap email"
          value={!user ? '…' : user.monthlyRecap ? 'On' : 'Off'}
          onPress={
            user
              ? () =>
                  Alert.alert(
                    user.monthlyRecap ? 'Stop monthly recaps?' : 'Get a monthly recap?',
                    user.monthlyRecap
                      ? "You won't get the recap email any more."
                      : `On the 1st of each month, an AI summary of last month's journal (themes, highlights and mood) is emailed to ${user.email}.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: user.monthlyRecap ? 'Turn off' : 'Turn on',
                        onPress: () => {
                          void updateProfile({ monthlyRecap: !user.monthlyRecap }).catch(
                            (e: Error) => Alert.alert('Could not save', e.message),
                          );
                        },
                      },
                    ],
                  )
              : undefined
          }
        />
      </Card>

      <Card>
        <SettingRow
          icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          label="Time format"
          value={timeFormat === '12h' ? '12-hour (AM/PM)' : '24-hour'}
          onPress={() =>
            Alert.alert('Time format', 'Choose how times appear in the app.', [
              {
                text: '12-hour (6:00 PM)',
                onPress: () => {
                  void setTimeFormat('12h').catch(() =>
                    Alert.alert('Could not save time format', 'Try again.'),
                  );
                },
              },
              {
                text: '24-hour (18:00)',
                onPress: () => {
                  void setTimeFormat('24h').catch(() =>
                    Alert.alert('Could not save time format', 'Try again.'),
                  );
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ])
          }
        />
      </Card>
      <ExportSettingsCard />
      <Button
        title="Delete account"
        variant="secondary"
        loading={deleting}
        onPress={() =>
          Alert.alert(
            'Permanently delete account?',
            'This removes all journal data from the server and this phone, including unsynced snippets. Exported files remain in your vault. This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete account',
                style: 'destructive',
                onPress: async () => {
                  setDeleting(true);
                  try {
                    await deleteAccount();
                  } catch (e) {
                    Alert.alert('Could not delete account', (e as Error).message);
                    setDeleting(false);
                  }
                },
              },
            ],
          )
        }
      />

      <ThemedText type="small" themeColor="textTertiary" style={styles.version}>
        JournalAI {Constants.expoConfig?.version}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 44,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.five + Spacing.one,
  },
  version: {
    textAlign: 'center',
  },
});
