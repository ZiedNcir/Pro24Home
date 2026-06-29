import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadows, spacing } from '../../foundations';
import { Icon, IconName } from '../../icons';
import { AppText, Button, ProgressDots } from '../../ui';

export interface OnboardingBlockProps {
  icon: IconName;
  title: string;
  description: string;
  current: number;
  total: number;
  primaryLabel: string;
  secondaryLabel?: string;
  eyebrow?: string;
  logo?: React.ReactNode;
  visualTitle?: string;
  visualSubtitle?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  containerStyle?: ViewStyle;
}

export const OnboardingBlock: React.FC<OnboardingBlockProps> = ({
  icon,
  title,
  description,
  current,
  total,
  primaryLabel,
  secondaryLabel,
  eyebrow = 'Pro24Home',
  logo,
  visualTitle,
  visualSubtitle,
  onPrimaryPress,
  onSecondaryPress,
  containerStyle,
}) => (
  <SafeAreaView style={[styles.safeArea, containerStyle]}>
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          {logo ?? (
            <View style={styles.logoFallback}>
              <Icon name="home" size="sm" color={colors.white} />
            </View>
          )}
          <AppText variant="label" color={colors.primary[700]}>
            {eyebrow}
          </AppText>
        </View>

        {secondaryLabel ? (
          <Button
            title={secondaryLabel}
            variant="ghost"
            size="sm"
            fullWidth={false}
            onPress={onSecondaryPress}
          />
        ) : (
          <View style={styles.topPlaceholder} />
        )}
      </View>

      <View style={styles.visualCard}>
        <View style={styles.blurCircleOne} />
        <View style={styles.blurCircleTwo} />

        <View style={styles.iconHaloOuter}>
          <View style={styles.iconHaloInner}>
            <Icon
              name={icon}
              size={74}
              color={colors.primary[600]}
              strokeWidth={1.8}
            />
          </View>
        </View>

        <View style={styles.visualText}>
          <AppText variant="title" align="center">
            {visualTitle ?? title}
          </AppText>
          {visualSubtitle ? (
            <AppText
              variant="caption"
              color={colors.textMuted}
              align="center"
            >
              {visualSubtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      <View style={styles.content}>
        <ProgressDots total={total} current={current} />

        <View style={styles.textContent}>
          <AppText variant="h1" align="center">
            {title}
          </AppText>

          <AppText
            variant="bodyLarge"
            color={colors.textMuted}
            align="center"
          >
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
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  topBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logoFallback: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  topPlaceholder: {
    width: 64,
  },
  visualCard: {
    height: 310,
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary[50],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.primary[100],
    ...shadows.sm,
  },
  blurCircleOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary[100],
    top: -60,
    right: -40,
    opacity: 0.8,
  },
  blurCircleTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.white,
    bottom: -35,
    left: -30,
    opacity: 0.9,
  },
  iconHaloOuter: {
    width: 156,
    height: 156,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  iconHaloInner: {
    width: 116,
    height: 116,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  visualText: {
    maxWidth: 260,
    gap: spacing[1],
  },
  content: {
    gap: spacing[5],
  },
  textContent: {
    gap: spacing[3],
  },
  actions: {
    gap: spacing[2],
  },
});
