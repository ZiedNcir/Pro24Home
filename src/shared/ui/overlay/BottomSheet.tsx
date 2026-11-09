import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@theme';

export interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ visible, onDismiss, children }: BottomSheetProps) => {
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
  overlay: { flex: 1, justifyContent: 'flex-end' },
  content: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
});
