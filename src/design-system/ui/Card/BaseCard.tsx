import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, shadows, spacing } from '../../foundations';

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
}) => (
  <View {...props} style={[styles.base, padded && styles.padded, elevated && shadows.sm, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
  },
  padded: {
    padding: spacing[4],
  },
});
