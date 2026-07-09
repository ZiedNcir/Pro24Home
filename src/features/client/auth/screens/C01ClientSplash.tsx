import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppLoader,
  AppText,
  colors,
  radius,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { SplashIllustrations } from '../../../../assets/illustrations/splash';
import { t } from '../../../../translations/i18n';
import { useAppSelector } from '../../../../store/hooks';
import {
  selectHasCompletedOnboarding,
  selectIsInitialized,
} from '../../../../store/selectors';
import { CLIENT_AUTH_ROUTES } from '../constants';

import Pro24Logo from '../../../../assets/logo/logo-mediumPro24.svg';

type Props = NativeStackScreenProps<any>;

export const C01ClientSplash: React.FC<Props> = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  const isInitialized = useAppSelector(selectIsInitialized);
  const hasCompletedOnboarding = useAppSelector(selectHasCompletedOnboarding);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const timer = setTimeout(() => {
      navigation.replace(
        hasCompletedOnboarding
          ? CLIENT_AUTH_ROUTES.login
          : CLIENT_AUTH_ROUTES.welcome,
      );
    }, 1200);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, isInitialized, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={SplashIllustrations.OrangeBackground}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.centerArea}>
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity,
                  transform: [{ scale }, { translateY }],
                },
              ]}
            >
              <Pro24Logo width={220} height={110} />
            </Animated.View>

            <Animated.View
              style={[
                styles.separator,
                {
                  opacity,
                  transform: [{ translateY }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.tagline,
                {
                  opacity,
                  transform: [{ translateY }],
                },
              ]}
            >
              <AppText variant="bodyLarge" color={colors.text} align="center">
                {t('module1.splash.taglineStart')}
              </AppText>

              <AppText variant="bodyLarge" color={colors.primary[600]} align="center">
                {t('module1.splash.taglineHighlight')}
              </AppText>
            </Animated.View>
          </View>

          <Animated.View style={[styles.loaderArea, { opacity }]}>
            <AppLoader
              label={t('module1.splash.loading')}
              color={colors.white}
              trackColor="rgba(255,255,255,0.35)"
              labelColor={colors.white}
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingVertical: vSpacing[6],
    justifyContent: 'space-between',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: vSpacing[12],
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: spacing[12],
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primary[600],
    marginTop: vSpacing[2],
    marginBottom: vSpacing[4],
  },
  tagline: {
    alignItems: 'center',
  },
  loaderArea: {
    paddingBottom: vSpacing[4],
  },
});
