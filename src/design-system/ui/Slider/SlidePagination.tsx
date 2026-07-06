import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../foundations';

export interface SlidePaginationProps {
  total: number;
  current: number;
}

export const SlidePagination: React.FC<SlidePaginationProps> = ({ total, current }) => (
  <View style={styles.container}>
    {Array.from({ length: total }).map((_, index) => (
      <View key={index} style={[styles.dot, index === current ? styles.active : styles.inactive]} />
    ))}
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: colors.primary[600],
  },
  inactive: {
    width: spacing[2],
    backgroundColor: colors.gray[300],
  },
});
