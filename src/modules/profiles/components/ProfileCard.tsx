import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../../theme';
import type { Profile } from '../types';
import { formatDistanceKm, locationDisplayLabel } from '../../localDiscovery';
import type { ProfileIntents } from '../../intents';
import { PromptAnswers } from './PromptAnswers';
import { IntentChips, IntentOverlapChips, hasAnyIntent, sharedIntentChips } from '../../intents';
import { BLUR_HONEST_COPY, shouldBlurPublicPhotos } from '../../mediaConsent';
import { verificationBadgeLabel } from '../../verification';
import { TravelEventChipBadges } from '../../events';
import type { ProfilePrompt } from '../prompts';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = Math.min(width - spacing.screen * 2, 400);
export const CARD_HEIGHT = CARD_WIDTH * 1.38;

type Props = {
  profile: Profile;
  viewerIntents?: ProfileIntents | null;
  adultSurface?: boolean;
  onPromptLike?: (prompt: ProfilePrompt) => void;
};

export function ProfileCard({ profile, viewerIntents, adultSurface = false, onPromptLike }: Props) {
  const accent = profile.accent ?? colors.accent;
  const initial = profile.display_name.charAt(0).toUpperCase();
  const overlap = useMemo(() => sharedIntentChips(viewerIntents, profile.intents), [viewerIntents, profile.intents]);
  const blur = shouldBlurPublicPhotos({
    blurUntilMatch: profile.blur_until_match,
    showClearOnDiscover: profile.show_clear_on_discover,
    viewerMatched: profile.viewer_matched,
    adultSurface,
  });
  const verifyLabel = verificationBadgeLabel(profile.photo_verification_status ?? 'none');
  const photoUri = profile.photo_urls?.[0];

  return (
    <View style={[styles.card, { borderColor: accent + '40' }]}>
      <View style={[styles.photo, { backgroundColor: accent + '28' }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <>
            <View style={[styles.glow, { backgroundColor: accent + '22' }]} />
            <Text style={[styles.initial, { color: accent, opacity: blur.blurred ? 0.25 : 0.92 }]}>{initial}</Text>
          </>
        )}
        {blur.blurred ? (
          <View style={styles.blurOverlay}>
            <Text style={styles.blurGlyph}>◌</Text>
            <Text style={styles.blurTitle}>Photo blurred until match</Text>
            <Text style={styles.blurHint} numberOfLines={3}>{BLUR_HONEST_COPY}</Text>
          </View>
        ) : !photoUri ? (
          <Text style={styles.photoHint}>Add a photo</Text>
        ) : null}
        <View style={styles.gradient}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.display_name}{profile.age ? `, ${profile.age}` : ''}</Text>
            {verifyLabel ? (
              <View style={styles.verifyBadge}>
                <Text style={styles.verifyText}>{profile.photo_verification_status === 'verified' ? '✓ ' : ''}{verifyLabel}</Text>
              </View>
            ) : null}
          </View>
          {profile.relationship_goal ? <Text style={[styles.goal, { color: accent }]}>{String(profile.relationship_goal)}</Text> : null}
        </View>
      </View>
      <View style={styles.body}>
        {locationDisplayLabel(profile.location_label) || formatDistanceKm(profile.distance_km) ? (
          <View style={styles.areaRow}>
            <Text style={styles.area}>
              ⌖ {locationDisplayLabel(profile.location_label) ?? 'Nearby'}
              {formatDistanceKm(profile.distance_km) ? ` · ${formatDistanceKm(profile.distance_km)}` : ''}
            </Text>
            <Text style={styles.areaFine}>Approx · not street GPS</Text>
          </View>
        ) : null}
        <Text style={styles.bio} numberOfLines={2}>{profile.bio ?? 'No bio yet'}</Text>
        <TravelEventChipBadges chips={{ travelSoon: Boolean(profile.travel_soon), openToIrlEvents: Boolean(profile.open_to_irl_events) }} />
        <PromptAnswers prompts={profile.prompts} limit={2} onPromptLike={adultSurface ? undefined : onPromptLike} />
        <IntentChips intents={profile.intents} limit={4} />
        {profile.interests.length > 0 && !hasAnyIntent(profile.intents) ? (
          <View style={styles.chips}>
            {profile.interests.slice(0, 4).map((interest) => (
              <View key={interest} style={styles.chip}><Text style={styles.chipText}>{interest}</Text></View>
            ))}
          </View>
        ) : null}
        <IntentOverlapChips chips={overlap} />
        {profile.viewer_matched && (profile.private_photo_urls?.length ?? 0) > 0 ? (
          <Text style={styles.privateHint}>Private album unlocked ({profile.private_photo_urls!.length}) · match only</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, overflow: 'hidden', ...shadows.card },
  photo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  glow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, opacity: 0.9 },
  initial: { fontSize: 100, fontWeight: '700', letterSpacing: -2 },
  blurOverlay: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlayHeavy, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  blurGlyph: { fontSize: 42, color: colors.textMuted, marginBottom: spacing.sm },
  blurTitle: { ...typography.subtitle, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  blurHint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  photoHint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, opacity: 0.8 },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.overlayHeavy },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs },
  name: { ...typography.title, color: colors.text },
  verifyBadge: { backgroundColor: colors.likeSoft, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: colors.like },
  verifyText: { ...typography.caption, color: colors.like, fontWeight: '700', fontSize: 10 },
  goal: { ...typography.caption, textTransform: 'capitalize', marginTop: 3, fontWeight: '600' },
  body: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.surfaceElevated, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  areaRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginBottom: spacing.xs },
  area: { ...typography.caption, color: colors.accent, fontWeight: '600' },
  areaFine: { ...typography.caption, color: colors.textMuted },
  bio: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { backgroundColor: colors.chip, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full, borderWidth: 1, borderColor: colors.borderSubtle },
  chipText: { ...typography.caption, color: colors.textSecondary },
  privateHint: { ...typography.caption, color: colors.accentHot, marginTop: spacing.xs, fontWeight: '600' },
});
