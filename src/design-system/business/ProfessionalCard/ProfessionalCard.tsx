import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { AppText, Avatar, Badge, BaseCard } from '../../ui';

export interface ProfessionalCardProps {
  name: string;
  job?: string;
  eta?: string;
  distance?: string;
  rating?: number;
  verified?: boolean;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  name,
  job,
  eta,
  distance,
  rating,
  verified = false,
}) => (
  <BaseCard>
    <View style={styles.row}>
      <Avatar name={name} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText variant="title">{name}</AppText>
          {verified ? <Badge label="Vérifié" variant="success" /> : null}
        </View>
        {job ? <AppText variant="body" color={colors.textMuted}>{job}</AppText> : null}
        <View style={styles.meta}>
          {eta ? <AppText variant="caption" color={colors.primary[700]}>{eta}</AppText> : null}
          {distance ? <AppText variant="caption" color={colors.textMuted}>• {distance}</AppText> : null}
          {rating ? <AppText variant="caption" color={colors.textMuted}>• ⭐ {rating.toFixed(1)}</AppText> : null}
        </View>
      </View>
    </View>
  </BaseCard>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing[3], alignItems: 'center' },
  content: { flex: 1, gap: spacing[1] },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' },
  meta: { flexDirection: 'row', gap: spacing[1], flexWrap: 'wrap' },
});
