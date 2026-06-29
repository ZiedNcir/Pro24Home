import { moderateScale } from './responsive';

export const radius = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  '2xl': moderateScale(24),
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;
