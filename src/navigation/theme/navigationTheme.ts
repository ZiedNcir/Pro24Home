import { DefaultTheme, type Theme } from '@react-navigation/native';

import { colors } from '../../design-system';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[600],
    background: colors.background,
    card: colors.white,
    text: colors.text,
    border: colors.stroke,
    notification: colors.primary[600],
  },
};