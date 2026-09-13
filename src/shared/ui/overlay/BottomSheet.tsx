import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

export interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ visible, onDismiss, children }: BottomSheetProps) => (
  <Modal transparent visible={visible} onRequestClose={onDismiss}>
    <Pressable onPress={onDismiss} style={styles.overlay}>
      <Pressable onPress={event => event.stopPropagation()} style={styles.content}>
        {children}
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'flex-end' },
  content: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
});
