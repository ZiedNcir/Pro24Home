import type { TextStyle } from 'react-native';
import { fontPixel } from './responsive';

export const typography = {
  display: { fontSize: fontPixel(34), lineHeight: fontPixel(42), fontWeight: '700' },
  h1: { fontSize: fontPixel(28), lineHeight: fontPixel(36), fontWeight: '700' },
  h2: { fontSize: fontPixel(24), lineHeight: fontPixel(32), fontWeight: '700' },
  h3: { fontSize: fontPixel(20), lineHeight: fontPixel(28), fontWeight: '600' },
  title: { fontSize: fontPixel(18), lineHeight: fontPixel(26), fontWeight: '600' },
  bodyLarge: { fontSize: fontPixel(16), lineHeight: fontPixel(24), fontWeight: '400' },
  body: { fontSize: fontPixel(14), lineHeight: fontPixel(22), fontWeight: '400' },
  bodyMedium: { fontSize: fontPixel(14), lineHeight: fontPixel(22), fontWeight: '500' },
  caption: { fontSize: fontPixel(12), lineHeight: fontPixel(18), fontWeight: '400' },
  label: { fontSize: fontPixel(13), lineHeight: fontPixel(18), fontWeight: '600' },
  button: { fontSize: fontPixel(16), lineHeight: fontPixel(22), fontWeight: '700' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
