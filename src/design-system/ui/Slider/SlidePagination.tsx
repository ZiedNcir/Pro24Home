import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, spacing } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';

export interface SlidePaginationProps {
  total: number;
  current: number;
}

export const SlidePagination: React.FC<SlidePaginationProps> = ({
  total,
  current,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === current ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  dot: {
    height: spacing[2],
    borderRadius: radius.full,
  },
  active: {
    width: spacing[4],
    backgroundColor: theme.colors.primary,
  },
  inactive: {
    width: spacing[2],
    backgroundColor: theme.colors.border,
  },
});
