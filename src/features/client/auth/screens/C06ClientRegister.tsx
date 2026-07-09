import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { CLIENT_AUTH_ROUTES } from '../constants';
import {
  AuthLogoHeader,
  AuthStepProgress,
  ClientForm,
  ClientRegisterFormValues,
} from '../components';
import { getAuthApiMessage } from '../helpers/authApiError';
import { showAuthErrorToast } from '../helpers';
import toast from 'react-native-toast-notifications';

type Props = NativeStackScreenProps<any>;

export const C06ClientRegister: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);
  const { registerClient, registerClientState } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ClientRegisterFormValues>({
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      postal_code: '',
      password: '',
      password_confirmation: '',
    },
  });

  const handleSubmit = async (values: ClientRegisterFormValues) => {
    setErrorMessage(null);

    try {
      await registerClient({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone_number: values.phone_number.trim(),
        address: values.address.trim(),
        postal_code: values.postal_code.trim(),
        onesignal_key: '',
        lang: 'fr',
      });

      navigation.navigate(CLIENT_AUTH_ROUTES.otp, {
        phone: values.phone_number.trim(),
        email: values.email.trim(),
      } as never);
    } catch (error) {
      showAuthErrorToast(
        toast,
        getAuthApiMessage(error, t('module1.professional.errors.generic')),
      );
    }
  };

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <AuthLogoHeader navigation={navigation} />

        <View style={styles.header}>
          <AppText variant="h1" align="center" color={c.text}>
            {t('module1.register.title')}
          </AppText>

          <AppText variant="bodyLarge" align="center" color={c.textMuted}>
            {t('module1.register.subtitle')}
          </AppText>
        </View>

        <AuthStepProgress
          current={1}
          labels={[
            t('module1.steps.account'),
            t('module1.steps.verification'),
            t('module1.steps.done'),
          ]}
        />

        <View style={styles.card}>
          <ClientForm form={form} />
        </View>

        {errorMessage ? (
          <AppText variant="caption" color={c.error} align="center" style={styles.error}>
            {errorMessage}
          </AppText>
        ) : null}

        <View style={styles.footer}>
          <Button
            title={t('module1.register.button')}
            leftIcon="plus"
            rightIcon="arrowRight"
            loading={registerClientState.isLoading}
            onPress={form.handleSubmit(handleSubmit)}
          />

          <Button
            title={t('module1.register.alreadyAccount')}
            variant="ghost"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.login as never)}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  contentContainer: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[6],
    paddingBottom: vSpacing[6],
    backgroundColor: c.background,
  },
  header: {
    gap: vSpacing[2],
    marginTop: vSpacing[3],
  },
  card: {
    borderRadius: radius['2xl'],
    backgroundColor: c.surface,
    padding: spacing[5],
    gap: vSpacing[4],
    ...shadows.sm,
  },
  error: {
    marginTop: vSpacing[3],
  },
  footer: {
    gap: vSpacing[2],
    marginTop: vSpacing[4],
  },
});
