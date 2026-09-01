import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-notifications';

import { Button, Field, ScreenContainer, Text, Spinner } from '@components/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme/ThemeProvider';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useForgotPasswordMutation } from '@store/api/endpoints/auth';
import { AppStackType } from '../../navigation/constant/core';

type NavigationProp = NativeStackNavigationProp<AppStackType, 'ForgetPassword'>;

type FormValues = { phone_number: string };

export const ForgetPassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { theme, themeMode } = useTheme();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { phone_number: '' } });

  const onSubmit = useCallback(async ({ phone_number }: FormValues) => {
    try {
      const response = await forgotPassword({ phone_number }).unwrap();
      setSent(true);
      Toast.show(response?.message || 'Un lien de réinitialisation vous a été envoyé.', {
        type: 'success', placement: 'bottom', duration: 4000,
      });
    } catch (error: any) {
      Toast.show(error?.data?.message || error?.message || 'Impossible d’envoyer le lien de réinitialisation.', {
        type: 'danger', placement: 'bottom', duration: 4000,
      });
    }
  }, [forgotPassword]);

  return (
    <ScreenContainer mode={themeMode} scrollable paddingHorizontal={0} paddingVertical={0}>
      <View style={styles.primaryHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text style={[styles.backIcon, { color: theme.colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <LogoMediumPro24Icon style={styles.logo} />
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.black }]}>
          <Text variant="title" style={[styles.title, { color: theme.colors.textPrimary }]}>Mot de passe oublié ?</Text>
          <Text variant="regular" color={theme.colors.textSecondary} style={styles.description}>
            Entrez votre numéro de téléphone et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
          </Text>

          {sent ? (
            <View style={styles.successState}>
              <Text variant="bold" color={theme.colors.success} style={styles.successTitle}>Vérifiez votre boîte mail</Text>
              <Text variant="regular" color={theme.colors.textSecondary} style={styles.successText}>
                Si un compte correspond à cette adresse, vous recevrez bientôt les instructions de réinitialisation.
              </Text>
              <Button title="Retour à la connexion" variant="primary" fullWidth onPress={() => navigation.navigate('SignIn', { role: 'client' })} />
            </View>
          ) : (
            <>
              <Field
                name="phone_number"
                label={t('ui.form.phone.label') || 'Téléphone'}
                required
                isPhone
                control={control}
                placeholder={t('ui.form.phone.placeholder') || 'Numéro de téléphone'}
                returnKeyType="done"
                rules={{
                  required: t('ui.form.phone.required') || 'Le téléphone est requis',
                  pattern: {
                    value: /^[+]?\d[\d\s-]{9,}$/,
                    message: t('ui.form.phone.invalid') || 'Numéro de téléphone invalide',
                  },
                }}
              />
              <Button
                title="Envoyer le lien"
                variant="primary"
                fullWidth
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                loading={isLoading}
              />
              <TouchableOpacity style={styles.signInLink} onPress={() => navigation.goBack()} disabled={isLoading}>
                <Text variant="medium" color={theme.colors.primary}>Retour à la connexion</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {isLoading && <Spinner visible={isLoading} onRequestClose={() => undefined} />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  primaryHeader: { height: verticalScale(78), position: 'relative', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: horizontalScale(8), top: verticalScale(17), width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  backIcon: { fontFamily: 'Inter-Regular', fontSize: 34, lineHeight: 34 },
  logo: { width: horizontalScale(150), height: verticalScale(42) },
  cardContainer: { width: '100%', paddingHorizontal: horizontalScale(18) },
  card: { width: '100%', borderRadius: moderateScale(28), paddingHorizontal: horizontalScale(24), paddingTop: verticalScale(32), paddingBottom: verticalScale(30), shadowOffset: { width: 0, height: verticalScale(8) }, shadowOpacity: 0.06, shadowRadius: moderateScale(16), elevation: 4 },
  title: { textAlign: 'center', fontSize: moderateScale(28), lineHeight: moderateScale(34), marginBottom: verticalScale(12) },
  description: { textAlign: 'center', fontSize: moderateScale(14), lineHeight: moderateScale(22), marginBottom: verticalScale(24) },
  submitButton: { marginTop: verticalScale(18) },
  signInLink: { alignSelf: 'center', marginTop: verticalScale(22) },
  successState: { alignItems: 'center', gap: verticalScale(16) },
  successTitle: { textAlign: 'center' },
  successText: { textAlign: 'center', lineHeight: moderateScale(22), marginBottom: verticalScale(8) },
});

export default ForgetPassword;
