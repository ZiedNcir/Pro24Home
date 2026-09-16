import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SvgIcon from '@shared/ui/icon/SvgIcon';
import { useTheme } from '@theme';

export interface BackHeaderProps {
  title?: string;
  onBack: () => void;
  rightAction?: ReactNode;
}

export const BackHeader = ({ title, onBack, rightAction }: BackHeaderProps) => {
  const { theme } = useTheme();
  return (
  <View style={styles.container}>
    <Pressable accessibilityLabel={title || 'Retour'} onPress={onBack} style={styles.back}>
      <SvgIcon name="fa-chevron-left" size={20} color={theme.colors.primary} />
    </Pressable>
    {title ? <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text> : <View />}
    {rightAction || <View style={styles.rightPlaceholder} />}
  </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 48 },
  back: { padding: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  rightPlaceholder: { width: 36 },
});
