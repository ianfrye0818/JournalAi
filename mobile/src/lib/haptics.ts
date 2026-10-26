import * as Haptics from 'expo-haptics';

// Android's native haptic constants feel closer to iOS than the Vibrator-based fallbacks.
const isAndroid = process.env.EXPO_OS === 'android';
const isWeb = process.env.EXPO_OS === 'web';

function run(ios: () => Promise<void>, android: Haptics.AndroidHaptics) {
  if (isWeb) return;
  (isAndroid ? Haptics.performAndroidHapticsAsync(android) : ios()).catch(() => {});
}

/** Fire-and-forget haptic feedback; failures are ignored. */
export const haptics = {
  /** A snippet was saved. */
  success: () =>
    run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), Haptics.AndroidHaptics.Confirm),
  /** A long-press menu opened. */
  longPress: () =>
    run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), Haptics.AndroidHaptics.Long_Press),
  /** Something was removed. */
  warning: () =>
    run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning), Haptics.AndroidHaptics.Reject),
};
