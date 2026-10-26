import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { useDatabaseMigrations } from '@/lib/db/client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const [fontsLoaded, fontError] = useAppFonts();
  const migrations = useDatabaseMigrations();
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
  );

  const fontsReady = fontsLoaded || !!fontError;

  // Root view color shows behind screens during transitions and keyboard animations.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  // Nothing below may touch the local database until migrations have run.
  if (!fontsReady || (!migrations.success && !migrations.error)) return null;
  if (migrations.error) return <DatabaseError message={migrations.error.message} />;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider value={navTheme}>
                <StatusBar style="auto" />
                <RootNavigator />
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { status } = useAuth();

  // Keep the splash up until we know which group to show, so signed-in users never see sign-in flash.
  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync();
  }, [status]);

  if (status === 'loading') return null;

  const signedIn = status === 'signedIn';

  // Flipping a guard drops that group's history and redirects into the other one. redirectTo is
  // required: the default fallback for a pathless group resolves to "/", which is itself guarded.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={signedIn} redirectTo="/sign-in">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="capture" options={{ presentation: 'modal' }} />
        <Stack.Screen name="day/[date]" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

function DatabaseError({ message }: { message: string }) {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.error}>
      <ThemedText type="heading">Couldn&apos;t open your journal</ThemedText>
      <ThemedText themeColor="textSecondary">
        The local database failed to update. Your snippets have not been deleted.
      </ThemedText>
      <ThemedText type="code" themeColor="textTertiary">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
