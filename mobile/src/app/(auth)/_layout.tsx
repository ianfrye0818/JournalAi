import { Stack } from 'expo-router';

export default function AuthLayout() {
  // sign-in is listed first, so it's where the root guard lands signed-out users.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
