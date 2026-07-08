import type { DefaultTheme } from 'styled-components/native';

export const getThemeTokens = (theme: DefaultTheme) => ({
  primary: theme.colors.primary,
  primaryDark: theme.colors.primaryDark,
  primaryLight: theme.colors.primaryLight,
  primaryLighter: theme.colors.primaryLighter,

  background: theme.colors.background,
  surface: theme.colors.surface,
  surfaceVariant: theme.colors.surfaceVariant,

  text: theme.colors.textPrimary,
  textMuted: theme.colors.textSecondary,
  textDisabled: theme.colors.textDisabled,
  textInverse: theme.colors.textInverse,

  stroke: theme.colors.border,
  strokeLight: theme.colors.borderLight,
  strokeDark: theme.colors.borderDark,

  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.danger,
  danger: theme.colors.danger,
  info: theme.colors.info,

  white: theme.colors.white,
  black: theme.colors.black,
});
