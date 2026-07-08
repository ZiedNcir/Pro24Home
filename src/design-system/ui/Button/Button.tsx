import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, spacing } from '../../foundations';
import { Icon, IconName } from '../../icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppText } from '../Text/AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: IconName | React.ReactNode;
  rightIcon?: IconName | React.ReactNode;
  style?: ViewStyle;
}

const height = { sm: 40, md: 48, lg: 56 };
const padding = { sm: spacing[3], md: spacing[4], lg: spacing[5] };

const getTextColor = (theme: DefaultTheme): Record<ButtonVariant, string> => ({
  primary: theme.colors.textInverse,
  secondary: theme.colors.primaryDark,
  outline: theme.colors.primaryDark,
  ghost: theme.colors.primaryDark,
  danger: theme.colors.textInverse,
});

const getVariantStyle = (theme: DefaultTheme): Record<ButtonVariant, ViewStyle> => ({
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.primaryLighter },
  outline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: theme.colors.danger },
});

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const textColor = useMemo(() => getTextColor(theme), [theme]);
  const variantStyle = useMemo(() => getVariantStyle(theme), [theme]);

  const renderIcon = (icon?: IconName | React.ReactNode) => {
    if (!icon) return null;
    return typeof icon === 'string'
      ? <Icon name={icon} size="sm" color={textColor[variant]} />
      : icon;
  };

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height[size],
          paddingHorizontal: padding[size],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.55 : pressed ? 0.86 : 1,
        },
        variantStyle[variant],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <View style={styles.content}>
          {renderIcon(leftIcon)}
          <AppText variant="button" color={textColor[variant]}>
            {title}
          </AppText>
          {renderIcon(rightIcon)}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
