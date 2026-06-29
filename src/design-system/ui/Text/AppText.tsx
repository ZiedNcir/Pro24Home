import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, typography, TypographyVariant } from '../../foundations';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = colors.text,
  align,
  style,
  children,
  ...props
}) => (
  <Text {...props} style={[typography[variant], { color, textAlign: align }, style]}>
    {children}
  </Text>
);
