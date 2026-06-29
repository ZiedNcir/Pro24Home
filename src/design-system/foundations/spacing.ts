import { horizontalScale, verticalScale } from './responsive';

export const spacing = {
  0: 0,
  1: horizontalScale(4),
  2: horizontalScale(8),
  3: horizontalScale(12),
  4: horizontalScale(16),
  5: horizontalScale(20),
  6: horizontalScale(24),
  8: horizontalScale(32),
  10: horizontalScale(40),
  12: horizontalScale(48),
  16: horizontalScale(64),
} as const;

export const vSpacing = {
  0: 0,
  1: verticalScale(4),
  2: verticalScale(8),
  3: verticalScale(12),
  4: verticalScale(16),
  5: verticalScale(20),
  6: verticalScale(24),
  8: verticalScale(32),
  10: verticalScale(40),
  12: verticalScale(48),
  16: verticalScale(64),
} as const;

export type SpacingToken = keyof typeof spacing;
