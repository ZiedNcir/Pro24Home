import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../foundations';
import { Icon, IconName } from '../../icons';
import { AppText } from '../Text';

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

const textColor: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.primary[700],
  outline: colors.primary[700],
  ghost: colors.primary[700],
  danger: colors.white,
};

const variantStyle: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary[600] },
  secondary: { backgroundColor: colors.primary[50] },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary[600] },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
};

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
  const isDisabled = disabled || loading;
  const renderIcon = (icon?: IconName | React.ReactNode) => {
    if (!icon) return null;
    return typeof icon === 'string' ? <Icon name={icon} size="sm" color={textColor[variant]} /> : icon;
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
          <AppText variant="button" color={textColor[variant]}>{title}</AppText>
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
