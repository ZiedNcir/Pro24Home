import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../foundations';
import { AppText } from '../Text';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'primary';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => (
  <View style={[styles.base, variantStyles[variant], style]}>
    <AppText variant="caption" color={textColors[variant]}>{label}</AppText>
  </View>
);

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: { backgroundColor: colors.gray[100] },
  success: { backgroundColor: '#DCFCE7' },
  warning: { backgroundColor: '#FEF3C7' },
  error: { backgroundColor: '#FEE2E2' },
  primary: { backgroundColor: colors.primary[50] },
};

const textColors: Record<BadgeVariant, string> = {
  default: colors.gray[700],
  success: colors.success,
  warning: '#B45309',
  error: colors.error,
  primary: colors.primary[700],
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
});
