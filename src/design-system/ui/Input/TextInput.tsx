import React, { useMemo, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, spacing, typography } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppText } from '../Text/AppText';

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
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <AppText variant="label" style={styles.label}>{label}</AppText> : null}

      <View style={[styles.wrapper, { borderColor }]}>
        {leftIcon}

        <RNTextInput
          {...props}
          placeholderTextColor={theme.colors.textDisabled}
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

      {error ? (
        <AppText variant="caption" color={theme.colors.danger} style={styles.helper}>
          {error}
        </AppText>
      ) : null}

      {!error && helperText ? (
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.helper}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[2],
  },
  wrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
    ...typography.bodyLarge,
  },
  helper: {
    marginTop: spacing[1],
  },
});
