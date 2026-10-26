import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, type SharedValue } from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/ui';
import { Radius } from '@/constants/theme';
import type { DictationStatus } from '@/hooks/use-dictation';
import { useTheme } from '@/hooks/use-theme';

const micIcon: IconName = { ios: 'mic', android: 'mic', web: 'mic' };
const stopIcon: IconName = { ios: 'stop.fill', android: 'stop', web: 'stop' };

/** How far past the button the ring grows at full volume, as a fraction of the button size. */
const RING_GROWTH = 0.6;

export type MicButtonProps = {
  status: DictationStatus;
  /** 0..1 input level from `useDictation`. */
  level: SharedValue<number>;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
};

export function MicButton({ status, level, onPress, size = 40, disabled }: MicButtonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const live = status === 'listening';
  const busy = status === 'starting' || status === 'stopping';

  const ringStyle = useAnimatedStyle(() => ({
    // With reduced motion the ring stays put at a fixed size instead of pulsing with the voice.
    transform: [{ scale: 1 + (reduceMotion ? 0.25 : level.get() * RING_GROWTH) }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      {live && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.round,
            { backgroundColor: theme.accentSoft },
            ringStyle,
          ]}
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={status === 'idle' ? 'Dictate' : 'Stop dictation'}
        accessibilityState={{ busy, disabled }}
        hitSlop={size < 44 ? (44 - size) / 2 : undefined}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          StyleSheet.absoluteFill,
          styles.round,
          styles.center,
          {
            backgroundColor:
              status === 'idle'
                ? pressed
                  ? theme.backgroundSelected
                  : theme.backgroundElement
                : pressed
                  ? theme.accentPressed
                  : theme.accent,
          },
          (disabled || busy) && styles.dimmed,
        ]}>
        <Icon
          name={status === 'idle' ? micIcon : stopIcon}
          size={Math.round(size * 0.5)}
          themeColor={status === 'idle' ? 'text' : 'onAccent'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  round: {
    borderRadius: Radius.pill,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.6,
  },
});
