import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../foundations';
import { AppText } from '../Text';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : focused ? colors.primary[600] : colors.stroke;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <AppText variant="label" style={styles.label}>{label}</AppText> : null}
      <View style={[styles.wrapper, { borderColor }]}>
        {leftIcon}
        <RNTextInput
          {...props}
          placeholderTextColor={colors.gray[400]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, style]}
        />
        {rightIcon}
      </View>
      {error ? <AppText variant="caption" color={colors.error} style={styles.helper}>{error}</AppText> : null}
      {!error && helperText ? <AppText variant="caption" color={colors.textMuted} style={styles.helper}>{helperText}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { marginBottom: spacing[2] },
  wrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
    ...typography.bodyLarge,
  },
  helper: { marginTop: spacing[1] },
});
