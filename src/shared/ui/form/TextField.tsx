import React from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { useTheme } from 'styled-components/native';

import Text from '@shared/ui/typography/Text';

export interface TextFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value?: string;
  onChangeText: (value: string) => void;
  error?: string;
  helperText?: string;
}

export const TextField = ({
  label,
  value = '',
  onChangeText,
  error,
  helperText,
  accessibilityLabel,
  style,
  ...props
}: TextFieldProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label ? <Text variant="medium" style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        accessibilityLabel={accessibilityLabel || label}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={props.placeholderTextColor ?? theme.colors.textDisabled}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
          error ? styles.inputError : undefined,
          style,
        ]}
      />
      {error || helperText ? (
        <Text variant="regularSmall" style={error ? styles.error : styles.helper}>
          {error || helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { marginBottom: 6 },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#DC2626' },
  helper: { color: '#6B7280', marginTop: 4 },
  error: { color: '#DC2626', marginTop: 4 },
});
