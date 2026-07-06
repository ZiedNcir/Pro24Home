import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {
  colors,
  moderateScale,
  radius,
  spacing,
} from '../../foundations';

import { AppText } from '../Text';

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
  color = colors.primary[600],
  trackColor = colors.primary[100],
  labelColor = colors.textMuted,
  style,
}) => {
  const rotate = useRef(new Animated.Value(0)).current;

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
            borderColor: trackColor,
            borderTopColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {label ? (
        <AppText variant="bodyLarge" color={labelColor} align="center">
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
