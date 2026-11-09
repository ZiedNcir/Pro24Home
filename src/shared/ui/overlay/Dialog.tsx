import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@theme';

export interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const Dialog = ({ visible, onDismiss, children }: DialogProps) => {
  const { theme } = useTheme();
  return (
  <Modal transparent visible={visible} onRequestClose={onDismiss}>
    <Pressable onPress={onDismiss} style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
      <Pressable onPress={event => event.stopPropagation()} style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        {children}
      </Pressable>
    </Pressable>
  </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 20 },
  content: { borderRadius: 12, maxWidth: 400, padding: 20, width: '100%' },
});
