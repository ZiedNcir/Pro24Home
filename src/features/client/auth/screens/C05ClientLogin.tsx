import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { useToast } from 'react-native-toast-notifications';

import Field from '@components/Field';
import ScreenContainer from '@components/ScreenContainer';

import {
  AppText,
  Button,
  radius,
  shadows,
  sizes,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { t } from '../../../../translations/i18n';
import { useAuth } from '../../../../hooks';

import { AuthLogoHeader } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';
import { getAuthApiMessage } from '../helpers/authApiError';
import { showAuthErrorToast } from '../helpers/authToast';

type Props = NativeStackScreenProps<any>;

interface LoginFormValues {
  email: string;
  password: string;
}

export const C05ClientLogin: React.FC<Props> = ({ navigation }) => {
  const toast = useToast();
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);
  const { login, loginState } = useAuth();

  const form = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });

      navigation.navigate(CLIENT_AUTH_ROUTES.gps as never);
    } catch (error) {
      showAuthErrorToast(
        toast,
        getAuthApiMessage(error, t('module1.login.errors.generic')),
      );
    }
  };

  const goToRegister = () => {
    navigation.navigate(CLIENT_AUTH_ROUTES.accountType as never);
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
            {t('module1.login.title')}
          </AppText>

          <AppText variant="bodyLarge" align="center" color={c.textMuted}>
            {t('module1.login.subtitle')}
          </AppText>
        </View>

        <View style={styles.card}>
          <Field
            control={form.control}
            name="email"
            label={t('module1.login.email')}
            placeholder={t('module1.login.emailPlaceholder')}
            required
            email
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <Field
            control={form.control}
            name="password"
            label={t('module1.login.passwordLabel')}
            placeholder={t('module1.login.passwordPlaceholder')}
            required
            password
            textContentType="password"
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.forgotPassword,
              pressed && styles.pressed,
            ]}
          >
            <AppText variant="bodyMedium" color={c.primary} align="right">
              {t('module1.login.forgotPassword')}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('module1.login.button')}
            rightIcon="arrowRight"
            loading={loginState.isLoading}
            onPress={form.handleSubmit(handleLogin)}
          />

          <View style={styles.separator}>
            <View style={styles.separatorLine} />

            <AppText variant="caption" color={c.textMuted}>
              {t('module1.login.or')}
            </AppText>

            <View style={styles.separatorLine} />
          </View>

          <Button
            title={t('module1.login.createAccount')}
            variant="outline"
            leftIcon="plus"
            onPress={goToRegister}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[6],
    paddingBottom: vSpacing[6],
    backgroundColor: c.background,
  },
  header: {
    gap: vSpacing[2],
    marginTop: vSpacing[7],
    marginBottom: vSpacing[6],
  },
  card: {
    borderRadius: radius['2xl'],
    backgroundColor: c.surface,
    padding: spacing[5],
    gap: vSpacing[4],
    ...shadows.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: vSpacing[1],
  },
  pressed: {
    opacity: 0.72,
  },
  actions: {
    gap: vSpacing[3],
    marginTop: vSpacing[5],
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: vSpacing[1],
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: c.stroke,
  },
});
