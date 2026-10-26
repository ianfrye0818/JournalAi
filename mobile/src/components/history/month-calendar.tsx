import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, IconButton } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DayStatus } from '@/lib/api/types';
import { parseLocalDate } from '@/lib/dates';
import { monthGrid, monthOf, shiftMonth } from '@/lib/history/calendar';
import type { HistoryDay } from '@/lib/history/days';

export const statusLabels: Record<DayStatus, string> = {
  open: 'Not started',
  interviewing: 'In progress',
  drafted: 'Drafted',
  finalized: 'Finalized',
};

// Any Sunday works; only the weekday names are read from it.
const SUNDAY = new Date(2026, 9, 25);
const weekdays = Array.from({ length: 7 }, (_, i) =>
  new Date(SUNDAY.getFullYear(), SUNDAY.getMonth(), SUNDAY.getDate() + i).toLocaleDateString(
    undefined,
    { weekday: 'narrow' },
  ),
);

const CELL_HEIGHT = 48;
const DAY_SIZE = 32;

export type MonthCalendarProps = {
  /** `YYYY-MM` */
  month: string;
  onChangeMonth: (month: string) => void;
  days: ReadonlyMap<string, HistoryDay>;
  today: string;
  onPressDay: (date: string) => void;
};

/** One month of days, each with a status dot. Days with something in them open on tap. */
export function MonthCalendar({ month, onChangeMonth, days, today, onPressDay }: MonthCalendarProps) {
  const theme = useTheme();
  const label = parseLocalDate(`${month}-01`).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  const atCurrentMonth = month >= monthOf(today);

  return (
    <Card>
      <View style={styles.header}>
        <IconButton
          icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          accessibilityLabel="Previous month"
          size={36}
          onPress={() => onChangeMonth(shiftMonth(month, -1))}
        />
        <ThemedText type="defaultSemiBold" accessibilityRole="header" accessibilityLiveRegion="polite">
          {label}
        </ThemedText>
        <IconButton
          icon={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          accessibilityLabel="Next month"
          size={36}
          disabled={atCurrentMonth}
          onPress={() => onChangeMonth(shiftMonth(month, 1))}
        />
      </View>

      <View style={styles.row} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {weekdays.map((name, i) => (
          <ThemedText key={i} type="small" themeColor="textTertiary" style={styles.weekday}>
            {name}
          </ThemedText>
        ))}
      </View>

      {monthGrid(month).map((week, w) => (
        <View key={w} style={styles.row}>
          {week.map((date, d) => {
            if (!date) return <View key={d} style={styles.cell} />;
            const day = days.get(date);
            const isToday = date === today;
            const spoken = parseLocalDate(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            });
            return (
              <Pressable
                key={date}
                disabled={!day}
                onPress={() => onPressDay(date)}
                accessibilityRole="button"
                accessibilityState={{ disabled: !day, selected: isToday }}
                accessibilityLabel={[spoken, isToday && 'today', day && statusLabels[day.status]]
                  .filter(Boolean)
                  .join(', ')}
                style={({ pressed }) => [styles.cell, pressed && styles.pressed]}>
                <View
                  style={[
                    styles.day,
                    isToday && { borderColor: theme.accent, borderWidth: 1.5 },
                  ]}>
                  <ThemedText
                    type={day ? 'smallBold' : 'small'}
                    themeColor={date > today ? 'textTertiary' : day ? 'text' : 'textSecondary'}>
                    {Number(date.slice(8))}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.dot,
                    day && {
                      backgroundColor: day.status === 'finalized' ? theme.accent : theme.textTertiary,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={styles.legend} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.accent }]} />
          <ThemedText type="small" themeColor="textSecondary">
            Finalized
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.textTertiary }]} />
          <ThemedText type="small" themeColor="textSecondary">
            In progress
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    height: CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.6,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
