import React from 'react';
import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {
  AppText,
  colors,
  radius,
  shadows,
  sizes,
  spacing,
  vSpacing,
} from '../../../../design-system';

export interface AuthScreenLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  illustration?: ImageSourcePropType;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthScreenLayout: React.FC<AuthScreenLayoutProps> = ({
  eyebrow,
  title,
  subtitle,
  illustration,
  children,
  footer,
}) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.header}>
        {eyebrow ? (
          <AppText variant="label" color={colors.primary[700]}>
            {eyebrow}
          </AppText>
        ) : null}

        <View style={styles.titleGroup}>
          <AppText variant="h1">{title}</AppText>
          {subtitle ? (
            <AppText variant="bodyLarge" color={colors.textMuted}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {illustration ? (
        <View style={styles.illustrationCard}>
          <Image source={illustration} resizeMode="contain" style={styles.illustration} />
        </View>
      ) : null}

      <View style={styles.body}>{children}</View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingVertical: sizes.screen.verticalPadding,
    backgroundColor: colors.background,
    gap: vSpacing[5],
  },
  header: {
    gap: vSpacing[3],
  },
  titleGroup: {
    gap: vSpacing[2],
  },
  illustrationCard: {
    height: sizes.illustration.onboardingHeight,
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.sm,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: vSpacing[4],
  },
  footer: {
    gap: vSpacing[2],
  },
});
