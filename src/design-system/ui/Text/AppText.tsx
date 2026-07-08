import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { typography, TypographyVariant } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const resolvedColor = color || theme.colors.textPrimary;

  return (
    <Text
      {...props}
      style={[
        typography[variant],
        { color: resolvedColor, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
