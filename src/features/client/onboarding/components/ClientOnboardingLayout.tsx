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
  Button,
  ProgressDots,
  colors,
  radius,
  shadows,
  sizes,
  spacing,
  vSpacing,
} from '../../../../design-system';

export interface ClientOnboardingLayoutProps {
  image: ImageSourcePropType;
  eyebrow: string;
  title: string;
  description: string;
  current: number;
  total: number;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

export const ClientOnboardingLayout: React.FC<ClientOnboardingLayoutProps> = ({
  image,
  eyebrow,
  title,
  description,
  current,
  total,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" color={colors.primary[700]}>
          {eyebrow}
        </AppText>

        {secondaryLabel ? (
          <Button
            title={secondaryLabel}
            variant="ghost"
            size="sm"
            fullWidth={false}
            onPress={onSecondaryPress}
          />
        ) : (
          <View style={styles.headerPlaceholder} />
        )}
      </View>

      <View style={styles.illustrationCard}>
        <Image
          source={image}
          resizeMode="contain"
          style={styles.illustration}
        />
      </View>

      <View style={styles.content}>
        <ProgressDots total={total} current={current} />

        <View style={styles.textContent}>
          <AppText variant="h1" align="center">
            {title}
          </AppText>

          <AppText variant="bodyLarge" color={colors.textMuted} align="center">
            {description}
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title={primaryLabel}
          rightIcon={current < total - 1 ? 'arrowRight' : 'check'}
          onPress={onPrimaryPress}
        />
      </View>
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
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  header: {
    minHeight: vSpacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerPlaceholder: {
    width: spacing[16],
  },
  illustrationCard: {
    height: sizes.illustration.onboardingHeight,
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary[100],
    ...shadows.sm,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  content: {
    gap: vSpacing[5],
  },
  textContent: {
    gap: vSpacing[3],
  },
  actions: {
    gap: vSpacing[2],
  },
});
