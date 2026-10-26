import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Screen, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/auth-context';

// Matches RegisterRequest in the backend.
const MIN_PASSWORD = 10;

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= MIN_PASSWORD;

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      // On success the root guard swaps to the tabs and lands on Today.
      await signUp({ email: email.trim(), password });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? 'An account with that email already exists.'
          : err instanceof ApiError
            ? err.messages.join('\n')
            : err instanceof Error
              ? err.message
              : 'Something went wrong.',
      );
      setSubmitting(false);
    }
  };

  return (
    <Screen inTabs={false}>
      <View style={styles.header}>
        <ThemedText type="display">Start your journal</ThemedText>
        <ThemedText themeColor="textSecondary">
          Capture moments during the day. Tonight, JournalAI helps you write them up.
        </ThemedText>
      </View>

      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label="Password"
        placeholder="At least 10 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={submit}
        hint={`At least ${MIN_PASSWORD} characters.`}
        error={error ?? undefined}
      />

      <Button
        title="Create account"
        size="lg"
        fullWidth
        disabled={!canSubmit}
        loading={submitting}
        onPress={submit}
      />
      <Button
        title="Already have an account? Sign in"
        variant="ghost"
        fullWidth
        onPress={() => router.replace('/sign-in')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    marginVertical: Spacing.three,
  },
});
