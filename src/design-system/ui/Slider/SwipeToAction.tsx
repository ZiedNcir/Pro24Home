import React, { useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { radius, shadows, sizes, spacing } from '../../foundations';
import { Icon } from '../../icons';
import { useTheme } from '../../../theme/ThemeProvider';
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
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
      <AppText variant="button" color={theme.colors.textInverse} align="center">
        {label}
      </AppText>

      <Animated.View
        {...responder.panHandlers}
        style={[styles.thumb, { transform: [{ translateX }] }]}
      >
        <Icon name="arrowRight" size="md" color={theme.colors.primary} />
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  track: {
    minHeight: sizes.button.lg,
    borderRadius: radius.full,
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
