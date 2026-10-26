import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Screen, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/auth-context';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      // On success the root guard swaps to the tabs, so there's nothing to navigate here.
      await signIn({ email: email.trim(), password });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? 'That email and password don’t match.'
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
        <ThemedText type="display">Welcome back</ThemedText>
        <ThemedText themeColor="textSecondary">Sign in to keep your journal in sync.</ThemedText>
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
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
        error={error ?? undefined}
      />

      <Button
        title="Sign in"
        size="lg"
        fullWidth
        disabled={!canSubmit}
        loading={submitting}
        onPress={submit}
      />
      <Button
        title="Forgot password?"
        variant="ghost"
        fullWidth
        onPress={() =>
          router.push({ pathname: '/forgot-password', params: { email: email.trim() } })
        }
      />
      <Button
        title="New here? Create an account"
        variant="ghost"
        fullWidth
        onPress={() => router.replace('/sign-up')}
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
