import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Icon,
  colors,
  radius,
  shadows,
  vSpacing,
} from '../../../../design-system';

import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES } from '../constants';

type Props = NativeStackScreenProps<any>;

export const C01ClientSplash: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(CLIENT_AUTH_ROUTES.welcome as never);
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoMark}>
          <Icon name="home" size="xl" color={colors.white} />
        </View>

        <View style={styles.text}>
          <AppText variant="h1" align="center">
            Pro24Home
          </AppText>
          <AppText variant="body" color={colors.textMuted} align="center">
            {t('module1.splash.tagline')}
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[5],
  },
  logoMark: {
    width: vSpacing[16],
    height: vSpacing[16],
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  text: {
    gap: vSpacing[2],
  },
});
