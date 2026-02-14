import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const WIDTH_SCREEN = width;
const HEIGHT_SCREEN = height;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) =>
  (shortDimension / guidelineBaseWidth) * size;

const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const fontPixel = (size: number) => {
  const newSize = size * (width / guidelineBaseWidth);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const isIphoneXorAbove = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
};

export {
  horizontalScale,
  verticalScale,
  moderateScale,
  fontPixel,
  isIphoneXorAbove,
  WIDTH_SCREEN,
  HEIGHT_SCREEN,
};
