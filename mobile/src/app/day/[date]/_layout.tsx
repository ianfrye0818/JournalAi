import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { Fonts, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LOCAL_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The end-of-day flow for one journal day: review → interview → draft, plus the feedback sheet.
 * Screens resume from the day's server status (see `stepForStatus`), so any of them can be first.
 */
export default function DayLayout() {
  const theme = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();

  if (!date || !LOCAL_DATE.test(date)) return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontFamily: Fonts.sans, fontWeight: 600, color: theme.text },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: theme.background },
      }}>
      <Stack.Screen name="review" options={{ title: 'Review' }} />
      <Stack.Screen name="interview" options={{ title: 'A few questions' }} />
      <Stack.Screen name="draft" options={{ title: 'Your entry' }} />
      <Stack.Screen
        name="feedback"
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: [0.6, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: Radius.xl,
          contentStyle: { backgroundColor: theme.surface },
        }}
      />
    </Stack>
  );
}
