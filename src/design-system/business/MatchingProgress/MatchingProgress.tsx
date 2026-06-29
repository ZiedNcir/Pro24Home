import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { AppText, BaseCard } from '../../ui';

export interface MatchingProgressProps {
  title?: string;
  message?: string;
}

export const MatchingProgress: React.FC<MatchingProgressProps> = ({
  title = 'Recherche en cours',
  message = 'Nous contactons le professionnel disponible le plus proche.',
}) => (
  <BaseCard elevated>
    <View style={styles.content}>
      <ActivityIndicator size="large" color={colors.primary[600]} />
      <AppText variant="h3" align="center">{title}</AppText>
      <AppText variant="body" color={colors.textMuted} align="center">{message}</AppText>
    </View>
  </BaseCard>
);

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing[3] },
});
