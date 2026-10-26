import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Icon, Screen, type IconName } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth/auth-context';

function SettingRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={20} themeColor="textSecondary" />
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText themeColor="textSecondary">{value}</ThemedText>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <Screen title="Settings">
      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Account
        </ThemedText>
        <SettingRow
          icon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
          label="Signed in as"
          value={user?.email ?? '…'}
        />
        <Button
          title="Sign out"
          variant="secondary"
          icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
          loading={signingOut}
          onPress={() => {
            setSigningOut(true);
            signOut();
          }}
        />
      </Card>

      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Journal
        </ThemedText>
        <SettingRow
          icon={{ ios: 'moon.stars', android: 'wb_twilight', web: 'wb_twilight' }}
          label="New day starts at"
          value="4:00 AM"
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'textformat', android: 'edit_note', web: 'edit_note' }}
          label="Writing style"
          value="Not set"
        />
      </Card>

      <ThemedText type="small" themeColor="textTertiary" style={styles.version}>
        JournalAI {Constants.expoConfig?.version}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
