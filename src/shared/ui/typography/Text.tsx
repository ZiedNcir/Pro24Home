import React, { FC } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import styled from 'styled-components/native';

import { AppColor } from '@utils/constant';
import { fontPixel } from '@utils/normalizedCss';
import type { ThemeColors } from '@theme';

export type TextVariant =
  | 'title'
  | 'header'
  | 'regular'
  | 'regularSmall'
  | 'medium'
  | 'helper'
  | 'bold'
  | 'notification';

type TextStyleProps = Pick<
  TextStyle,
  'fontWeight' | 'fontSize' | 'fontFamily' | 'lineHeight'
>;

export interface TextProps extends RNTextProps, TextStyleProps {
  variant?: TextVariant;
  color?: AppColor;
}

const DEFAULT_VARIANT: TextVariant = 'regular';

const textVariants: Record<TextVariant, Required<TextStyleProps>> = {
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 28,
  },
  header: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 28,
    lineHeight: 34,
  },
  regular: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
  },
  regularSmall: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
  },
  medium: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 21,
  },
  helper: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
  },
  bold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
  },
  notification: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 13,
  },
};

const resolveColor = (c: AppColor | undefined, colors: ThemeColors): string => {
  if (!c) return colors.textPrimary;

  const colorAliases: Record<string, keyof ThemeColors> = {
    black: 'textPrimary',
    white: 'textInverse',
    orange: 'primary',
    positive: 'success',
    field: 'surfaceVariant',
  };
  const colorKey = colorAliases[String(c)] ?? String(c);

  if (Object.prototype.hasOwnProperty.call(colors, colorKey)) {
    return colors[colorKey as keyof ThemeColors];
  }

  // Accept React Native color strings such as #RGB and rgba(...).
  return String(c);
};

const StyledText = styled(RNText)<{
  $fontFamily: string;
  $fontWeight: TextStyle['fontWeight'];
  $fontSize: number;
  $lineHeight: number;
  $color?: AppColor;
}>`
  font-family: ${({ $fontFamily }) => $fontFamily};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  font-size: ${({ $fontSize }) => fontPixel($fontSize)}px;
  line-height: ${({ $lineHeight, $fontSize }) =>
    fontPixel($lineHeight ?? Math.round($fontSize * 1.3))}px;
  color: ${({ $color, theme }) => resolveColor($color, theme.colors)};
`;

const Text: FC<TextProps> = ({
  variant = DEFAULT_VARIANT,
  color,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  style,
  ...rest
}) => {
  const v = textVariants[variant] ?? textVariants[DEFAULT_VARIANT];

  return (
    <StyledText
      $fontFamily={fontFamily ?? v.fontFamily}
      $fontWeight={fontWeight ?? v.fontWeight}
      $fontSize={fontSize ?? v.fontSize}
      $lineHeight={lineHeight ?? v.lineHeight}
      $color={color}
      style={style}
      {...rest}
    />
  );
};

export default Text;
