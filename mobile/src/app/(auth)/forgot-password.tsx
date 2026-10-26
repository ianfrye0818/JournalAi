import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Screen, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { authApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/auth-context';

// Matches ResetPasswordRequest in the backend.
const MIN_PASSWORD = 10;
const CODE_PATTERN = /^\d{6}$/;

const messageFor = (err: unknown) =>
  err instanceof ApiError
    ? err.messages.join('\n')
    : err instanceof Error
      ? err.message
      : 'Something went wrong.';

/** Two steps: email a 6-digit code, then trade it for a new password (which also signs in). */
export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sendCode = async () => {
    if (!email.trim() || submitting) return;
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await authApi.requestPasswordReset(email.trim());
      setSent(true);
      setNotice(`If ${email.trim()} has an account, a code is on its way. It expires in 15 minutes.`);
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setSubmitting(false);
    }
  };

  const canReset = CODE_PATTERN.test(code) && password.length >= MIN_PASSWORD;

  const submitReset = async () => {
    if (!canReset || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      // On success the root guard swaps to the tabs, as after signing in.
      await resetPassword({ email: email.trim(), code, password });
    } catch (err) {
      setError(messageFor(err));
      setSubmitting(false);
    }
  };

  return (
    <Screen inTabs={false}>
      <View style={styles.header}>
        <ThemedText type="display">Reset password</ThemedText>
        <ThemedText themeColor="textSecondary">
          {sent
            ? 'Enter the code from the email and choose a new password. Other devices will be signed out.'
            : 'We’ll email you a 6-digit code.'}
        </ThemedText>
      </View>

      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        editable={!sent}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="go"
        onSubmitEditing={sent ? undefined : sendCode}
        error={sent ? undefined : (error ?? undefined)}
      />

      {sent ? (
        <>
          <TextField
            label="Code"
            placeholder="123456"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
          />
          <TextField
            label="New password"
            placeholder={`At least ${MIN_PASSWORD} characters`}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={submitReset}
            error={error ?? undefined}
          />
          {!!notice && <ThemedText themeColor="textSecondary">{notice}</ThemedText>}
          <Button
            title="Set password and sign in"
            size="lg"
            fullWidth
            disabled={!canReset}
            loading={submitting}
            onPress={submitReset}
          />
          <Button
            title="Send a new code"
            variant="ghost"
            fullWidth
            disabled={submitting}
            onPress={sendCode}
          />
        </>
      ) : (
        <Button
          title="Email me a code"
          size="lg"
          fullWidth
          disabled={!email.trim()}
          loading={submitting}
          onPress={sendCode}
        />
      )}

      <Button
        title="Back to sign in"
        variant="ghost"
        fullWidth
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/sign-in'))}
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
