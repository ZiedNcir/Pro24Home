import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {
  moderateScale,
  radius,
  spacing,
} from '../../foundations';

import { useTheme } from '../../../theme/ThemeProvider';
import { AppText } from '../Text/AppText';

export interface AppLoaderProps {
  label?: string;
  size?: number;
  color?: string;
  trackColor?: string;
  labelColor?: string;
  style?: ViewStyle;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  label,
  size = moderateScale(52),
  color,
  trackColor,
  labelColor,
  style,
}) => {
  const { theme } = useTheme();
  const rotate = useRef(new Animated.Value(0)).current;

  const resolvedColor = color || theme.colors.primary;
  const resolvedTrackColor = trackColor || theme.colors.primaryLighter;
  const resolvedLabelColor = labelColor || theme.colors.textSecondary;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const borderWidth = Math.max(3, Math.round(size * 0.08));

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: radius.full,
            borderWidth,
            borderColor: resolvedTrackColor,
            borderTopColor: resolvedColor,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {label ? (
        <AppText variant="bodyLarge" color={resolvedLabelColor} align="center">
          {label}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  spinner: {},
});
