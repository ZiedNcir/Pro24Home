import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppText, Button, PasswordInput, TextInput, colors, radius, shadows, sizes, spacing, vSpacing,
} from '../../../../design-system';
import ScreenContainer from '@components/ScreenContainer';
import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES } from '../constants';
import { AuthStepProgress, FormSection } from '../components';
import Pro24Logo from '../../../../assets/logo/logo-mediumPro24.svg';

type Props = NativeStackScreenProps<any>;

export const C06ClientRegister: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logo}>
          <Pro24Logo width={150} height={64} />
        </View>

        <View style={styles.header}>
          <AppText variant="h1" align="center" color={colors.text}>
            {t('module1.register.title')}
          </AppText>
          <AppText variant="bodyLarge" align="center" color={colors.textMuted}>
            {t('module1.register.subtitle')}
          </AppText>
        </View>

        <AuthStepProgress current={1} labels={[t('module1.steps.account'), t('module1.steps.verification'), t('module1.steps.done')]} />

        <View style={styles.card}>
          <FormSection icon="user" title={t('module1.register.identity.title')} subtitle={t('module1.register.identity.subtitle')}>
            <View style={styles.row}>
              <TextInput label={t('module1.register.firstNameLabel')}
                placeholder={t('module1.register.firstNamePlaceholder')}
                value={form.firstName} onChangeText={update('firstName')}
                containerStyle={styles.flex} />
              <TextInput label={t('module1.register.lastNameLabel')}
                placeholder={t('module1.register.lastNamePlaceholder')}
                value={form.lastName} onChangeText={update('lastName')}
                containerStyle={styles.flex} />
            </View>
          </FormSection>

          <View style={styles.divider} />

          <FormSection icon="phone"
            title={t('module1.register.contact.title')}
            subtitle={t('module1.register.contact.subtitle')}>

            <TextInput label={t('module1.register.emailLabel')}
              placeholder={t('module1.register.emailPlaceholder')}
              value={form.email} onChangeText={update('email')}
              keyboardType="email-address" autoCapitalize="none" />

            <TextInput label={t('module1.register.phoneLabel')}
              placeholder={t('module1.register.phonePlaceholder')}
              value={form.phone}
              onChangeText={update('phone')}
              keyboardType="phone-pad" />
          </FormSection>

          <View style={styles.divider} />

          <FormSection icon="lock" title={t('module1.register.security.title')}
            subtitle={t('module1.register.security.subtitle')}>

            <PasswordInput label={t('module1.register.passwordLabel')}
              placeholder={t('module1.register.passwordPlaceholder')}
              value={form.password}
              onChangeText={update('password')} />

            <PasswordInput label={t('module1.register.confirmPasswordLabel')}
              placeholder={t('module1.register.confirmPasswordPlaceholder')}
              value={form.confirmPassword}
              onChangeText={update('confirmPassword')} />
          </FormSection>
        </View>

        <View style={styles.footer}>
          <Button title={t('module1.register.button')}
            leftIcon="user"
            rightIcon="arrowRight"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.otp, { phone: form.phone, email: form.email } as never)} />

          <Button title={t('module1.register.alreadyAccount')}
            variant="ghost"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.login as never)} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[6],
    paddingBottom: vSpacing[6],
    backgroundColor: colors.background
  },
  logo: {
    alignItems: 'center',
    marginTop: vSpacing[3]
  },
  header: {
    gap: vSpacing[2],
    marginTop: vSpacing[3]
  },
  card: {
    borderRadius: radius['2xl'],
    backgroundColor: colors.white,
    padding: spacing[5], gap: vSpacing[4],
    ...shadows.sm
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3]
  },
  flex: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.stroke },
  footer: { gap: vSpacing[2], marginTop: vSpacing[4] },
});
