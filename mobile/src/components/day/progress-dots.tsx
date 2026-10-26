import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ProgressDotsProps = {
  count: number;
  /** Zero-based. */
  current: number;
  /** Indexes already answered or skipped. */
  done?: ReadonlySet<number>;
};

export function ProgressDots({ count, current, done }: ProgressDotsProps) {
  const theme = useTheme();

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Question ${current + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current && styles.current,
            {
              backgroundColor:
                i === current ? theme.accent : done?.has(i) ? theme.textTertiary : theme.backgroundSelected,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  current: {
    width: 20,
  },
});
