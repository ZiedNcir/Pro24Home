import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, spacing } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppText } from '../Text/AppText';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'primary';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const getVariantStyles = (theme: DefaultTheme): Record<BadgeVariant, ViewStyle> => ({
  default: { backgroundColor: theme.colors.surfaceVariant },
  success: { backgroundColor: theme.colors.successLight },
  warning: { backgroundColor: theme.colors.warningLight },
  error: { backgroundColor: theme.colors.dangerLight },
  primary: { backgroundColor: theme.colors.primaryLighter },
});

const getTextColors = (theme: DefaultTheme): Record<BadgeVariant, string> => ({
  default: theme.colors.textSecondary,
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.danger,
  primary: theme.colors.primaryDark,
});

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  const { theme } = useTheme();
  const variantStyles = useMemo(() => getVariantStyles(theme), [theme]);
  const textColors = useMemo(() => getTextColors(theme), [theme]);

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <AppText variant="caption" color={textColors[variant]}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
});
