import React, { useMemo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, shadows, spacing } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';

export interface BaseCardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  padded = true,
  elevated = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      {...props}
      style={[styles.base, padded && styles.padded, elevated && shadows.sm, style]}
    >
      {children}
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  padded: {
    padding: spacing[4],
  },
});
