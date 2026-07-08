import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, spacing } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.dot, index === current && styles.activeDot]} />
      ))}
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: theme.colors.borderLight,
  },
  activeDot: {
    width: 22,
    backgroundColor: theme.colors.primary,
  },
});
