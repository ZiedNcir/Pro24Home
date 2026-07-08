import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';

import {
  AppText,
  Button,
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
import { useAuth } from '../../../../hooks';
import { CLIENT_AUTH_ROUTES, OTP_CODE_LENGTH } from '../constants';
import {
  AuthLogoHeader,
  AuthStepProgress,
  OtpCodeInput,
} from '../components';
import { getAuthApiMessage } from '../helpers/authApiError';

type Props = NativeStackScreenProps<any>;

interface OtpFormValues {
  code: string;
}

export const C07ClientOtp: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  const {
    verifyAccount,
    verifyAccountState,
    resendVerification,
    resendVerificationState,
  } = useAuth();

  const phone = (route.params as any)?.phone ?? '';
  const email = (route.params as any)?.email ?? '';

  const form = useForm<OtpFormValues>({
    mode: 'onChange',
    defaultValues: { code: '' },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleVerify = async ({ code }: OtpFormValues) => {
    setErrorMessage(null);

    if (code.length !== OTP_CODE_LENGTH) {
      setErrorMessage(t('module1.otp.errors.invalidCode'));
      return;
    }

    try {
      await verifyAccount({
        code,
        email,
        phone_number: phone,
      });

      navigation.navigate(CLIENT_AUTH_ROUTES.registerSuccess as never);
    } catch (error) {
      setErrorMessage(getAuthApiMessage(error, t('module1.otp.errors.generic')));
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);

    try {
      await resendVerification({ email }).unwrap();
    } catch (error) {
      setErrorMessage(getAuthApiMessage(error, t('module1.otp.errors.resend')));
    }
  };

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea={false}>
      <View style={styles.container}>
        <AuthLogoHeader navigation={navigation} />

        <AuthStepProgress
          current={2}
          labels={[
            t('module1.steps.account'),
            t('module1.steps.verification'),
            t('module1.steps.done'),
          ]}
        />

        <View style={styles.header}>
          <AppText variant="h1" align="center" color={c.text}>
            {t('module1.otp.title')}
          </AppText>

          <AppText variant="bodyLarge" align="center" color={c.textMuted}>
            {t('module1.otp.subtitle')}
          </AppText>

          {phone ? (
            <AppText variant="bodyMedium" align="center" color={c.primary}>
              {phone}
            </AppText>
          ) : null}
        </View>

        <View style={styles.visualCard}>
          <View style={styles.phoneMock}>
            <View style={styles.otpBubble}>
              <AppText variant="h2" color={c.primary}>
                ***
              </AppText>
            </View>
          </View>
        </View>

        <OtpCodeInput
          control={form.control}
          name="code"
          label={t('module1.otp.enterCode')}
          helperText={errorMessage ?? undefined}
        />

        <View style={styles.resendCard}>
          <View>
            <AppText variant="bodyMedium" color={c.text}>
              {t('module1.otp.noCode')}
            </AppText>

            <AppText variant="body" color={c.textMuted}>
              {t('module1.otp.noCodeDescription')}
            </AppText>
          </View>

          <Button
            title={t('module1.otp.resend')}
            variant="ghost"
            fullWidth={false}
            loading={resendVerificationState.isLoading}
            onPress={handleResend}
          />
        </View>

        <Button
          title={t('module1.otp.button')}
          rightIcon="arrowRight"
          loading={verifyAccountState.isLoading}
          onPress={form.handleSubmit(handleVerify)}
        />
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
  header: {
    gap: vSpacing[2],
  },
  visualCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: vSpacing[16] * 2.3,
  },
  phoneMock: {
    width: spacing[16] * 2,
    height: vSpacing[16] * 2,
    borderRadius: radius['2xl'],
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBubble: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    paddingHorizontal: spacing[8],
    paddingVertical: vSpacing[4],
    ...shadows.sm,
  },
  resendCard: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    padding: spacing[4],
    marginVertical: vSpacing[4],
    gap: vSpacing[2],
    ...shadows.sm,
  },
});
