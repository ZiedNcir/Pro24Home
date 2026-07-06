import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadows, sizes, spacing } from '../../foundations';
import { Icon } from '../../icons';
import { AppText } from '../Text';

export interface SwipeToActionProps {
  label: string;
  onComplete: () => void;
  style?: ViewStyle;
}

export const SwipeToAction: React.FC<SwipeToActionProps> = ({
  label,
  onComplete,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const maxSlide = 238;

  const reset = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const complete = () => {
    Animated.spring(translateX, {
      toValue: maxSlide,
      useNativeDriver: true,
    }).start(onComplete);
  };

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(Math.max(0, Math.min(gesture.dx, maxSlide)));
      },
      onPanResponderRelease: (_, gesture) => {
        gesture.dx > maxSlide * 0.62 ? complete() : reset();
      },
    }),
  ).current;

  return (
    <View style={[styles.track, style]}>
      <AppText variant="button" color={colors.white} align="center">
        {label}
      </AppText>

      <Animated.View
        {...responder.panHandlers}
        style={[styles.thumb, { transform: [{ translateX }] }]}
      >
        <Icon name="arrowRight" size="md" color={colors.primary[600]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    minHeight: sizes.button.lg,
    borderRadius: radius.full,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.sm,
  },
  thumb: {
    position: 'absolute',
    left: spacing[2],
    width: sizes.iconButton.lg,
    height: sizes.iconButton.lg,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
