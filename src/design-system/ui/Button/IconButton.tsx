import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../../foundations';
import { Icon, IconName } from '../../icons';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: IconName | React.ReactNode;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  variant?: 'solid' | 'soft' | 'ghost';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 44,
  iconSize = 22,
  iconColor,
  variant = 'soft',
  disabled = false,
  style,
  ...props
}) => {
  const color = iconColor ?? (variant === 'solid' ? colors.white : colors.primary[700]);

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        },
        variantStyles[variant],
        style,
      ]}
    >
      {typeof icon === 'string' ? <Icon name={icon as IconName} size={iconSize} color={color} /> : icon}
    </Pressable>
  );
};

const variantStyles: Record<NonNullable<IconButtonProps['variant']>, ViewStyle> = {
  solid: { backgroundColor: colors.primary[600] },
  soft: { backgroundColor: colors.primary[50] },
  ghost: { backgroundColor: 'transparent' },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
