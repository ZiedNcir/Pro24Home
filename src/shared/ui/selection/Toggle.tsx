import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@theme';

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
}: ToggleProps) => {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        {
          backgroundColor: value ? theme.colors.primary : theme.colors.gray300,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View
        style={[
          styles.thumb,
          { backgroundColor: theme.colors.surface },
          value && styles.thumbActive,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    padding: moderateScale(2),
    width: horizontalScale(50),
    height: verticalScale(28),
  },
  disabled: { opacity: 0.5 },
  thumb: {
    alignSelf: 'flex-start',
    borderRadius: moderateScale(12),
    height: verticalScale(24),
    width: horizontalScale(24),
  },
  thumbActive: { alignSelf: 'flex-end' },
});
