import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-notifications';

import { Regex } from '@utils/constant';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@utils/normalizedCss';

import {
  Text,
  ScreenContainer,
  NavigationHeader,
  Field,
  Button,
  Spinner,
} from '@components/index';

import { colors } from '@theme/index';
import { AppStackType } from '../../navigation/constant/core';
import { useLoginMutation } from '@store/api/endpoints/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  const role = route.params?.role ?? 'client';

  const { handleSubmit, control } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const doLogin = useCallback(
    async (data: SignInFormValues) => {
      try {
        const response = await login(data).unwrap();

        console.log('Login success:', response);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      } catch (error: any) {
        console.error('Login error:', error);

        Toast.show(
          error?.data?.message || t('auth.loginFailed') || 'Connexion échouée',
          {
            type: 'danger',
            placement: 'bottom',
            duration: 4000,
          }
        );

        navigation.reset({
          index: 0,
          routes: [{ name: 'AccountPendingScreen' }],
        });
      }
    },
    [login, navigation, t]
  );

  const navigateToForgetPassword = useCallback(() => {
    navigation.navigate('ForgetPassword');
  }, [navigation]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate('RegisterScreen', { role });
  }, [navigation, role]);

  return (
    <ScreenContainer
      mode="light"
      scrollable
      paddingHorizontal={10}
      paddingVertical={0}
      backgroundImage={require('@assets/images/background_ligth.png')}
      useImageBackground
    >
      <NavigationHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text variant="title" style={styles.title}>
              {t('screen.connexion') || 'Connection'}
            </Text>

            <Text variant="regular" color={colors.gray600} style={styles.description}>
              Accédez à votre espace en
            </Text>
            <Text variant="regular" color={colors.gray600} style={styles.descriptionLine2}>
              quelques instants
            </Text>

            <View style={styles.formSection}>
              <Field
                name="email"
                required
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                keyboardType="email-address"
                placeholder={t('ui.form.email.placeholder') || 'example@email.com'}
                regex={Regex.email}
              />

              <View style={styles.fieldSpacing} />

              <Field
                name="password"
                password
                required
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                placeholder={t('ui.form.password.placeholder') || 'Enter password'}
                regex={Regex.password}
              />

              <TouchableOpacity
                style={styles.forgetPassword}
                onPress={navigateToForgetPassword}
                disabled={isLoading}
              >
                <Text variant="medium" color={colors.primary} style={styles.forgetPasswordText}>
                  {t('terms.forgetPassword') || 'Forgot your password?'}
                </Text>
              </TouchableOpacity>

              <Button
                variant="primary"
                title={t('ui.button.signIn') || 'Sign In'}
                style={styles.signInButton}
                onPress={handleSubmit(doLogin)}
                disabled={isLoading}
              />
            </View>

            <View style={styles.termsRow}>
              <View style={styles.termsLine} />
              <Text variant="notification" color={colors.gray500} style={styles.termsText}>
                {t('terms.privacy') || 'Terms & Privacy'}
              </Text>
              <View style={styles.termsLine} />
            </View>

            <TouchableOpacity
              style={styles.createAccountRow}
              onPress={navigateToRegister}
              disabled={isLoading}
            >
              <Text variant="regular" color={colors.black}>
                {t('terms.notClient') || 'Not a member?'}{' '}
              </Text>
              <Text variant="regular" color={colors.primary} style={styles.createAccountText}>
                {t('terms.createAccount') || 'Create account'}
              </Text>
            </TouchableOpacity>
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
  cardContainer: {
    paddingHorizontal: horizontalScale(18),
  },
  card: {
    width: '100%',
    borderRadius: moderateScale(28),
    paddingHorizontal: horizontalScale(24),
    paddingTop: verticalScale(34),
    paddingBottom: verticalScale(30),
    backgroundColor: colors.white || '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(8),
    },
    shadowOpacity: 0.06,
    shadowRadius: moderateScale(16),
    elevation: 4,
    alignSelf: 'center',
    maxWidth: SCREEN_WIDTH - horizontalScale(36),
  },
  title: {
    textAlign: 'center',
    fontSize: moderateScale(28),
    lineHeight: moderateScale(34),
    marginBottom: verticalScale(12),
    color: colors.black,
  },
  description: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  descriptionLine2: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(30),
  },
  formSection: {
    marginBottom: verticalScale(10),
  },
  fieldSpacing: {
    height: verticalScale(14),
  },
  forgetPassword: {
    marginTop: verticalScale(16),
    alignSelf: 'flex-end',
    marginBottom: verticalScale(22),
  },
  forgetPasswordText: {
    fontSize: moderateScale(14),
  },
  signInButton: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: moderateScale(18),
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(28),
    marginBottom: verticalScale(26),
  },
  termsLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  termsText: {
    marginHorizontal: horizontalScale(14),
    fontSize: moderateScale(13),
  },
  createAccountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  createAccountText: {
    fontSize: moderateScale(14),
  },
});

export default SignIn;