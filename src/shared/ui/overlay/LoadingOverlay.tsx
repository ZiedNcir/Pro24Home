import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  const { theme } = useTheme();
  if (!visible) return null;

  return (
    <View testID="loading-overlay" style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
      <ActivityIndicator color={theme.colors.textInverse} />
      {message ? <Text style={[styles.message, { color: theme.colors.textInverse }]}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  message: { marginTop: 12 },
});
