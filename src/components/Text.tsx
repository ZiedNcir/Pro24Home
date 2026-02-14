import React, { FC } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import styled from 'styled-components/native';

import { AppColor, Colors } from '@utils/constant';
import { fontPixel } from '@utils/normalizedCss';

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
    title: { fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 22, lineHeight: 28 },
    header: { fontFamily: 'Poppins-Regular', fontWeight: '400', fontSize: 24, lineHeight: 32 },
    regular: { fontFamily: 'Inter-Regular', fontWeight: '400', fontSize: 14, lineHeight: 20 },
    regularSmall: { fontFamily: 'Inter-Regular', fontWeight: '400', fontSize: 12, lineHeight: 16 },
    medium: { fontFamily: 'Inter-Medium', fontWeight: '500', fontSize: 16, lineHeight: 24 },
    helper: { fontFamily: 'Inter-Regular', fontWeight: '400', fontSize: 12, lineHeight: 16 },
    bold: { fontFamily: 'Inter-Bold', fontWeight: '700', fontSize: 16, lineHeight: 24 },
    notification: { fontFamily: 'Inter-Medium', fontWeight: '500', fontSize: 11, lineHeight: 16 },
};

const resolveColor = (c?: AppColor): string => {
    if (!c) return Colors.black;

    // Si c est une clé de Colors -> on mappe
    if (Object.prototype.hasOwnProperty.call(Colors, c)) {
        return Colors[c as keyof typeof Colors];
    }

    // Sinon, on considère que c est déjà une couleur RN valide ('#...', 'rgba(...)', etc.)
    return String(c);
};

const StyledText = styled(RNText) <{
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
        fontPixel($lineHeight ?? Math.round($fontSize * 1.43))}px;
  color: ${({ $color }) => resolveColor($color)};
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

/*
| Variant      | Font             | Usage               |
| ------------ | ---------------- | ------------------- |
| title        | Poppins SemiBold | Écran principal     |
| header       | Poppins Regular  | Section             |
| medium       | Inter Medium     | Sous-titre / bouton |
| regular      | Inter Regular    | Texte principal     |
| regularSmall | Inter Regular    | Texte secondaire    |
| helper       | Inter Regular    | Aide                |
| bold         | Inter Bold       | Emphase             |
| notification | Inter Medium     | Badge / info        |

<Text variant="title">Dépannage urgent</Text>
<Text variant="header">Détails de l’intervention</Text>

<Text variant="regular">
  Un technicien est en route vers votre domicile.
</Text>

<Text variant="medium">Appeler le technicien</Text>
<Text variant="notification" color="primary">Nouveau</Text>
*/