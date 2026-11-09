import { hasFinishedProfessionalUpload, markProfessionalUploadFinished } from '@core/session/professional-upload-state';
import { getDocumentSubmissionProgress } from '@roles/professional/documents/model/professional-documents';
import { normalizeAuthResponse } from '@store/api/utils/authResponse';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { isUnverifiedAccount } from '@entities/user/model/account-status';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { hasCreatedAccount as readCreatedAccount } from '@core/session/account-onboarding';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from '@core/notifications/toast';

import { Regex } from '@utils/constant';
import {
  horizontalScale,
  verticalScale,
} from '@utils/normalizedCss';

import { Text, Spinner } from '@shared/ui';
import { Button } from '@shared/ui/button/Button';
import Field from '@shared/ui/form/HookFormField';
import ScreenContainer from '@shared/ui/layout/ScreenContainer';

import { useTheme } from '@theme';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { AppStackType } from '../../../navigation/constant/core';
import { useLoginMutation } from '@features/auth/api/auth.api';
import { getHomeRouteFromAuthResponse, isInactiveAuthResponse } from '../../../navigation/authNavigation';

type SignInFormValues = {
  email: string;
  password: string;
};

type SignInNavigationProp = NativeStackNavigationProp<AppStackType, 'SignIn'>;
type SignInRouteProp = RouteProp<AppStackType, 'SignIn'>;

export const SignIn = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SignInNavigationProp>();
  const route = useRoute<SignInRouteProp>();
  const { theme, themeMode } = useTheme();
  const role = route.params?.role ?? 'client';
  const [hasCreatedAccount, setHasCreatedAccount] = useState(false);

  useEffect(() => {
    readCreatedAccount().then(value => {
      setHasCreatedAccount(value);
    });
  }, []);

  const { handleSubmit, control } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const loginBusy = useRef(false);
  const [isFinishingLogin, setIsFinishingLogin] = useState(false);

  const resetToHome = useCallback(async (response: Parameters<typeof getHomeRouteFromAuthResponse>[0], fallbackRole = role, submittedEmail?: string) => {
    const responseUser = response.data?.user || response.user;
    const actualRole = responseUser?.type || fallbackRole;
    let finishedUpload = false;
    if (actualRole === 'professional') {
      const account = { id: responseUser?.id, email: responseUser?.email || submittedEmail };
      finishedUpload = await hasFinishedProfessionalUpload(account).catch(() => {
        Toast.show(t('auth.onboarding.uploadStateFailed'), { type: 'warning', placement: 'bottom' });
        return false;
      });
      if (getDocumentSubmissionProgress(responseUser?.documents || []).canContinue) {
        await markProfessionalUploadFinished(account, responseUser?.documents?.map(document => document.name)).catch(() => {
          Toast.show(t('auth.onboarding.uploadStateFailed'), { type: 'warning', placement: 'bottom' });
        });
        finishedUpload = true;
      }
    }
    const destination = getHomeRouteFromAuthResponse(response, fallbackRole, finishedUpload);
    const availableRoutes = navigation.getState().routeNames;

    if (!availableRoutes.includes(destination)) {
      Toast.show(
        fallbackRole === 'professional'
          ? t('auth.loginUnavailableProfessional')
          : t('auth.loginUnavailable'),
        {
          type: 'danger',
          placement: 'bottom',
          duration: 4000,
        },
      );
      return;
    }

    if (destination === 'VerifyScreen') {
      navigation.reset({ index: 0, routes: [{ name: 'VerifyScreen', params: {
        role: responseUser?.type === 'professional' ? 'professional' : responseUser?.type === 'client' ? 'client' : fallbackRole,
        email: responseUser?.email || submittedEmail,
        phone_number: responseUser?.phone_number,
      } }] });
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: destination }],
    });
  }, [navigation, role, t]);

  const doLogin = useCallback(
    async (data: SignInFormValues) => {
      if (loginBusy.current) return;
      loginBusy.current = true;
      setIsFinishingLogin(true);
      try {
        const response = await login(data).unwrap();
        const requiresVerification = (response.user?.type || role) !== 'professional' && isUnverifiedAccount(response);
        if (!requiresVerification && (!response.user?.id || typeof response.access_token !== 'string' || !response.access_token.trim())) {
          Toast.show(t('auth.loginFailed'), { type: 'danger', placement: 'bottom' });
          return;
        }

        await resetToHome(response, role, data.email);
      } catch (error: any) {
        const inactiveResponse = normalizeAuthResponse(error);
        if (isInactiveAuthResponse(error) && inactiveResponse.user?.type === 'professional'
          && inactiveResponse.user.id && typeof inactiveResponse.access_token === 'string' && inactiveResponse.access_token.trim()) {
          dispatch(setCredentials({ user: inactiveResponse.user, token: inactiveResponse.access_token }));
          await resetToHome(inactiveResponse, 'professional', data.email);
          return;
        }
        if (isUnverifiedAccount(error) && (inactiveResponse.user?.type || role) !== 'professional') {
          await resetToHome(error, role, data.email);
          return;
        }
        if (isInactiveAuthResponse(error) && (inactiveResponse.user?.type || role) === 'client') {
          await resetToHome(error, role);
          return;
        }

        Toast.show(
          error?.data?.message || t('auth.loginFailed'),
          {
            type: 'danger',
            placement: 'bottom',
            duration: 4000,
          }
        );

      } finally {
        loginBusy.current = false;
        setIsFinishingLogin(false);
      }
    },
    [dispatch, login, resetToHome, role, t]
  );

  const navigateToForgetPassword = useCallback(() => {
    navigation.navigate('ForgetPassword');
  }, [navigation]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate('AccountType');
  }, [navigation]);

  return (
    <ScreenContainer
      mode={themeMode}
      scrollable
      paddingHorizontal={0}
      paddingVertical={0}
    >
      <View style={styles.primaryHeader}>
        {!hasCreatedAccount ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.back')}
          >
            <Text style={[styles.backIcon, { color: theme.colors.primary }]}>‹</Text>
          </TouchableOpacity>
        ) : null}
        <LogoMediumPro24Icon style={styles.logo} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >

        <View style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: theme.colors.background, shadowColor: theme.colors.black }]}>
            <Text variant="title" style={[styles.title, { color: theme.colors.textPrimary }]}>
              {t('auth.signInDesign.title')}
            </Text>

            <Text variant="regular" color={theme.colors.textSecondary} style={styles.description}>
              {t('auth.signInDesign.subtitle')}
            </Text>

            <View style={styles.formSection}>
              <Field
                name="email"
                label={t('auth.signInDesign.emailLabel')}
                accessibilityLabel={t('auth.signInDesign.emailLabel')}
                textContentType="username"
                autoComplete="email"
                required
                showRequiredIndicator={false}
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                keyboardType="email-address"
                placeholder={t('auth.signInDesign.emailPlaceholder')}
                regex={Regex.email}
              />

              <View style={styles.fieldSpacing} />

              <Field
                name="password"
                label={t('ui.form.password.label')}
                accessibilityLabel={t('ui.form.password.label')}
                textContentType="password"
                autoComplete="current-password"
                password
                enforcePasswordPolicy={false}
                containerStyle={styles.passwordField}
                required
                showRequiredIndicator={false}
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                placeholder={t('ui.form.password.placeholder')}
              />

              <TouchableOpacity
                style={styles.forgetPassword}
                accessibilityRole="button"
                accessibilityLabel={t('terms.forgetPassword')}
                onPress={navigateToForgetPassword}
                disabled={isLoading || isFinishingLogin}
              >
                <Text variant="medium" color={theme.colors.primary} style={styles.forgetPasswordText}>
                  {t('terms.forgetPassword')}
                </Text>
              </TouchableOpacity>

              <Button
                variant="primary"
                size="xlarge"
                height={52}
                title={t('ui.button.signIn')}
                style={styles.signInButton}
                onPress={handleSubmit(doLogin)}
                disabled={isLoading || isFinishingLogin}
              />
            </View>

            <View style={styles.newAccountRow}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text variant="medium" fontSize={14} lineHeight={20} color={theme.colors.textSecondary}>{t('auth.signInDesign.newAccount')}</Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>
            <Button variant="outline" size="xlarge" height={50}
              title={t('auth.signInDesign.createAccount')}
              style={styles.createAccountButton}
              onPress={navigateToRegister}
              disabled={isLoading || isFinishingLogin}
            />
            <View style={styles.privacyFooter}>
              <Text variant="regularSmall" fontSize={13} lineHeight={18} color={theme.colors.textSecondary}>{t('terms.privacy')}</Text>
            </View>
          </View>
        </View>


        {isLoading && (
          <Spinner visible={isLoading} onRequestClose={() => undefined} />
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  primaryHeader: {
    height: verticalScale(78),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: horizontalScale(8),
    top: verticalScale(17),
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backIcon: {
    fontFamily: 'Inter-Regular',
    fontSize: 34,
    lineHeight: 34,
  },
  logo: {
    width: horizontalScale(150),
    height: verticalScale(42),
  },
  cardContainer: {
    flexGrow: 1,
    paddingHorizontal: 18,
    marginTop: 30,
  },
  card: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 48,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  formSection: { marginTop: 32 },
  fieldSpacing: { height: 4 },
  passwordField: { marginBottom: 8 },
  forgetPassword: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 24,
  },
  forgetPasswordText: { fontSize: 15, lineHeight: 20 },
  signInButton: { width: '100%', borderRadius: 12 },
  newAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 34,
    marginBottom: 18,
  },
  divider: { flex: 1, height: 1 },
  createAccountButton: { width: '100%', borderRadius: 12 },
  privacyFooter: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 40,
  },
});

export default SignIn;
