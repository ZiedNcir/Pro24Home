import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <View testID="loading-overlay" style={styles.overlay}>
      <ActivityIndicator color="#FFFFFF" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  message: { color: '#FFFFFF', marginTop: 12 },
});
