import { horizontalScale, verticalScale, moderateScale } from './responsive';

export const sizes = {
  button: {
    sm: verticalScale(40),
    md: verticalScale(48),
    lg: verticalScale(56),
  },
  input: {
    height: verticalScale(52),
    textareaMinHeight: verticalScale(120),
  },
  iconButton: {
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(52),
  },
  avatar: {
    sm: moderateScale(36),
    md: moderateScale(48),
    lg: moderateScale(64),
  },
  screen: {
    horizontalPadding: horizontalScale(20),
    verticalPadding: verticalScale(20),
  },
  illustration: {
    onboardingHeight: verticalScale(310),
  },
} as const;
