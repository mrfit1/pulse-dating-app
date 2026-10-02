import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';
import { PressableScale, PrimaryButton } from '../../../components/ui';
import { INTENT_TAXONOMY, labelForIntentId } from '../taxonomy';

type Props = {
  require: string[];
  onChange: (next: string[]) => void;
  onClear?: () => void | Promise<void>;
  softEmpty?: boolean;
  beforeCount?: number;
  compact?: boolean;
};

const QUICK_FILTER_IDS = [
  'long_term_dating',
  'intentional_dating',
  'casual_dating',
  'friends_first',
  'slow_and_steady',
  'meet_soon',
  'chat_first',
  'ethically_non_monogamous',
  'open_to_exploring',
  'coffee',
  'outdoors',
  'nightlife',
  'public_first_meeting',
  'sober_friendly',
  'photo_privacy',
];

const COMPACT_QUICK_IDS = [
  'intentional_dating',
  'casual_dating',
  'friends_first',
  'chat_first',
  'coffee',
  'outdoors',
];

export function IntentRequireFilterBar({
  require,
  onChange,
  onClear,
  softEmpty = false,
  beforeCount = 0,
  compact = false,
}: Props) {
  const known = useMemo(() => {
    const all = new Set(INTENT_TAXONOMY.flatMap((c) => c.options.map((o) => o.id)));
    const source = compact ? COMPACT_QUICK_IDS : QUICK_FILTER_IDS;
    return source.filter((id) => all.has(id));
  }, [compact]);

  const toggle = (id: string) => {
    if (require.includes(id)) onChange(require.filter((x) => x !== id));
    else onChange([...require, id]);
  };

  const clear = () => {
    if (onClear) void onClear();
    else onChange([]);
  };

  if (compact && require.length === 0 && !softEmpty) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {!compact ? (
        <View style={styles.header}>
          <Text style={styles.label}>Filter by intention</Text>
          {require.length > 0 ? (
            <PressableScale onPress={clear} style={styles.clearTiny} hitSlop={8}>
              <Text style={styles.clearTinyText}>Clear ({require.length})</Text>
            </PressableScale>
          ) : null}
        </View>
      ) : require.length > 0 ? (
        <View style={styles.header}>
          <Text style={styles.label}>Must have</Text>
          <PressableScale onPress={clear} style={styles.clearTiny} hitSlop={8}>
            <Text style={styles.clearTinyText}>Clear</Text>
          </PressableScale>
        </View>
      ) : null}

      {!softEmpty ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.row}
        >
          {known.map((id) => {
            const active = require.includes(id);
            return (
              <PressableScale
                key={id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggle(id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {active ? '✓ ' : ''}
                  {labelForIntentId(id)}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>
      ) : null}

      {softEmpty ? (
        <View style={styles.softEmpty}>
          <Text style={styles.softEmptyTitle}>No matches for these filters</Text>
          <Text style={styles.softEmptyBody}>
            {beforeCount > 0
              ? `${beforeCount} people nearby without filters.`
              : 'Clear filters to browse again.'}
          </Text>
          <PrimaryButton label="Clear filters" onPress={clear} style={styles.softBtn} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.xs,
  },
  label: { ...typography.label, color: colors.textMuted },
  clearTiny: { paddingVertical: 2, paddingHorizontal: 6 },
  clearTinyText: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  row: {
    paddingHorizontal: spacing.screen,
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  chipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: colors.accent },
  softEmpty: {
    marginHorizontal: spacing.screen,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  softEmptyTitle: { ...typography.subtitle, color: colors.text, marginBottom: spacing.xs },
  softEmptyBody: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  softBtn: { alignSelf: 'stretch' },
});
