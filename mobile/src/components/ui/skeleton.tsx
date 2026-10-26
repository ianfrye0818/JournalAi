import { useEffect } from 'react';
import { StyleSheet, type DimensionValue } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

/** A pulsing placeholder block for content that is still loading. Holds still with reduced motion. */
export function Skeleton({ width = '100%', height = 16, radius = Radius.sm }: SkeletonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.set(withRepeat(withTiming(0.45, { duration: 800 }), -1, true));
    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: theme.backgroundElement },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
