import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../foundations';

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => (
  <View style={styles.container}>
    {Array.from({ length: total }, (_, index) => (
      <View key={index} style={[styles.dot, index === current && styles.activeDot]} />
    ))}
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: colors.gray[200],
  },
  activeDot: {
    width: 22,
    backgroundColor: colors.primary[600],
  },
});
