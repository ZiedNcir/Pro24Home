import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  Icon,
  radius,
  shadows,
  sizes,
  spacing,
  vSpacing,
} from '../../../../design-system';

import ScreenContainer from '@components/ScreenContainer';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES } from '../constants';
import {
  AuthLogoHeader,
  AuthStepProgress,
} from '../components';

type Props = NativeStackScreenProps<any>;

export const C08ClientRegisterSuccess: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea={false}>
      <View style={styles.container}>
        <AuthLogoHeader navigation={navigation} />

        <AuthStepProgress
          current={3}
          labels={[
            t('module1.steps.account'),
            t('module1.steps.verification'),
            t('module1.steps.done'),
          ]}
        />

        <View style={styles.successVisual}>
          <View style={styles.successCircle}>
            <Icon name="check" size="xl" color={c.success} />
          </View>
        </View>

        <View style={styles.header}>
          <AppText variant="h1" align="center" color={c.text}>
            {t('module1.success.title')}
          </AppText>

          <AppText variant="bodyLarge" align="center" color={c.text}>
            {t('module1.success.subtitle')}
          </AppText>

          <AppText variant="body" align="center" color={c.textMuted}>
            {t('module1.success.description')}
          </AppText>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Icon name="bell" size="md" color={c.primary} />
          </View>

          <View style={styles.infoText}>
            <AppText variant="bodyMedium" color={c.text}>
              {t('module1.success.notificationTitle')}
            </AppText>

            <AppText variant="body" color={c.textMuted}>
              {t('module1.success.notificationDescription')}
            </AppText>
          </View>

          <Icon name="chevronRight" size="sm" color={c.primary} />
        </View>

        <View style={styles.footer}>
          <Button
            title={t('module1.success.primaryAction')}
            rightIcon="arrowRight"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.gps as never)}
          />

          <Button
            title={t('module1.success.secondaryAction')}
            variant="ghost"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.firstHome as never)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[6],
    paddingBottom: vSpacing[6],
    backgroundColor: c.background,
  },
  successVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  successCircle: {
    width: spacing[16] * 2,
    height: spacing[16] * 2,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  header: {
    gap: vSpacing[2],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    padding: spacing[4],
    marginTop: vSpacing[5],
    ...shadows.sm,
  },
  infoIcon: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  footer: {
    gap: vSpacing[2],
    marginTop: vSpacing[5],
  },
});
