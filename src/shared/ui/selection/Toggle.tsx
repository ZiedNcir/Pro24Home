import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const Toggle = ({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  style,
}: ToggleProps) => (
  <Pressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="switch"
    accessibilityState={{ checked: value, disabled }}
    disabled={disabled}
    onPress={() => onValueChange(!value)}
    style={[styles.track, value && styles.trackActive, disabled && styles.disabled, style]}
  >
    <View style={[styles.thumb, value && styles.thumbActive]} />
  </Pressable>
);

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#D1D5DB',
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
    width: 50,
    height: 28,
  },
  trackActive: { backgroundColor: '#FF6B00' },
  disabled: { opacity: 0.5 },
  thumb: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 12, height: 24, width: 24 },
  thumbActive: { alignSelf: 'flex-end' },
});
