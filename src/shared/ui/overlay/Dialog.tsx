import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

export interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const Dialog = ({ visible, onDismiss, children }: DialogProps) => (
  <Modal transparent visible={visible} onRequestClose={onDismiss}>
    <Pressable onPress={onDismiss} style={styles.overlay}>
      <Pressable onPress={event => event.stopPropagation()} style={styles.content}>
        {children}
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center', padding: 20 },
  content: { backgroundColor: '#FFFFFF', borderRadius: 12, maxWidth: 400, padding: 20, width: '100%' },
});
