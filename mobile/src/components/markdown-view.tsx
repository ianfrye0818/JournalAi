import { Fragment } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseMarkdown, type Inline } from '@/lib/markdown';

const headingStyles: Record<1 | 2 | 3, TextStyle> = {
  1: { ...Typography.entry, fontSize: 26, lineHeight: 34, fontWeight: 600 },
  2: { ...Typography.entry, fontSize: 22, lineHeight: 30, fontWeight: 600 },
  3: { ...Typography.entry, fontWeight: 600 },
};

function Spans({ content }: { content: Inline[] }) {
  return content.map((span, i) => (
    <Fragment key={i}>
      {span.bold || span.italic ? (
        <Text
          style={{
            fontWeight: span.bold ? 600 : undefined,
            fontStyle: span.italic ? 'italic' : undefined,
          }}>
          {span.text}
        </Text>
      ) : (
        span.text
      )}
    </Fragment>
  ));
}

/** Serif reading view for an entry's markdown body. */
export function MarkdownView({ source }: { source: string }) {
  const theme = useTheme();
  const blocks = parseMarkdown(source);

  return (
    <View style={styles.root}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <ThemedText key={i} accessibilityRole="header" style={headingStyles[block.level]}>
                <Spans content={block.content} />
              </ThemedText>
            );
          case 'paragraph':
            return (
              <ThemedText key={i} type="entry" selectable>
                <Spans content={block.content} />
              </ThemedText>
            );
          case 'quote':
            return (
              <View key={i} style={[styles.quote, { borderColor: theme.accentSoft }]}>
                <ThemedText type="entry" themeColor="textSecondary" style={styles.italic}>
                  <Spans content={block.content} />
                </ThemedText>
              </View>
            );
          case 'list':
            return (
              <View key={i} style={styles.list}>
                {block.items.map((item, j) => (
                  <View key={j} style={styles.item}>
                    <ThemedText type="entry" themeColor="textSecondary" style={styles.marker}>
                      {block.ordered ? `${j + 1}.` : '•'}
                    </ThemedText>
                    <ThemedText type="entry" style={styles.itemText}>
                      <Spans content={item} />
                    </ThemedText>
                  </View>
                ))}
              </View>
            );
          case 'rule':
            return <View key={i} style={[styles.rule, { backgroundColor: theme.border }]} />;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.three,
  },
  italic: {
    fontStyle: 'italic',
  },
  list: {
    gap: Spacing.one,
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  marker: {
    minWidth: 20,
  },
  itemText: {
    flex: 1,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.two,
  },
});
