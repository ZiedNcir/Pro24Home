import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  PasswordInput,
  TextInput,
  colors,
} from '../../../../design-system';

import { t } from '../../../../translations/i18n';
import { useAuth } from '../../../../hooks';

import { AuthScreenLayout, TermsCheckbox } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';
import {
  FieldErrors,
  RegisterField,
  RegisterFormValues,
  getApiFieldErrors,
  getApiMessage,
  hasErrors,
  validateRegisterForm,
} from '../validation';

type Props = NativeStackScreenProps<any>;

const initialForm: RegisterFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: '',
  postalCode: '',
  termsAccepted: false,
};

export const C06ClientRegister: React.FC<Props> = ({ navigation }) => {
  const { registerClient, registerClientState } = useAuth();

  const [form, setForm] = useState<RegisterFormValues>(initialForm);
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const update = (key: keyof RegisterFormValues) => (value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key as RegisterField]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleRegister = async () => {
    setApiError(null);

    const validationErrors = validateRegisterForm(form, {
      required: t('validation.required'),
      invalidPhone: t('validation.invalidPhone'),
      invalidEmail: t('validation.invalidEmail'),
      passwordTooShort: t('validation.passwordTooShort'),
      passwordsDoNotMatch: t('validation.passwordsDoNotMatch'),
      termsRequired: t('validation.termsRequired'),
    });

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      await registerClient({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        postal_code: form.postalCode.trim(),
        lang: 'fr',
      } as any);

      navigation.navigate(CLIENT_AUTH_ROUTES.otp as never, {
        phone: form.phone.trim(),
      } as never);
    } catch (error) {
      const apiFieldErrors = getApiFieldErrors(error);

      setErrors((current) => ({
        ...current,
        firstName: apiFieldErrors.first_name ?? current.firstName,
        lastName: apiFieldErrors.last_name ?? current.lastName,
        phone: apiFieldErrors.phone_number ?? current.phone,
        email: apiFieldErrors.email ?? current.email,
        password: apiFieldErrors.password ?? current.password,
        address: apiFieldErrors.address ?? current.address,
        postalCode: apiFieldErrors.postal_code ?? current.postalCode,
      }));

      setApiError(getApiMessage(error, t('validation.apiError')));
    }
  };

  return (
    <AuthScreenLayout
      title={t('module1.register.title')}
      subtitle={t('module1.register.subtitle')}
    >
      <TextInput
        label={t('module1.register.firstNameLabel')}
        placeholder={t('module1.register.firstNamePlaceholder')}
        value={form.firstName}
        error={errors.firstName}
        onChangeText={update('firstName')}
      />

      <TextInput
        label={t('module1.register.lastNameLabel')}
        placeholder={t('module1.register.lastNamePlaceholder')}
        value={form.lastName}
        error={errors.lastName}
        onChangeText={update('lastName')}
      />

      <TextInput
        label={t('module1.register.phoneLabel')}
        placeholder={t('module1.register.phonePlaceholder')}
        value={form.phone}
        error={errors.phone}
        onChangeText={update('phone')}
        keyboardType="phone-pad"
      />

      <TextInput
        label={t('module1.register.emailLabel')}
        placeholder={t('module1.register.emailPlaceholder')}
        value={form.email}
        error={errors.email}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label={t('module1.register.addressLabel')}
        placeholder={t('module1.register.addressPlaceholder')}
        value={form.address}
        error={errors.address}
        onChangeText={update('address')}
      />

      <TextInput
        label={t('module1.register.postalCodeLabel')}
        placeholder={t('module1.register.postalCodePlaceholder')}
        value={form.postalCode}
        error={errors.postalCode}
        onChangeText={update('postalCode')}
        keyboardType="number-pad"
      />

      <PasswordInput
        label={t('module1.register.passwordLabel')}
        value={form.password}
        error={errors.password}
        onChangeText={update('password')}
      />

      <PasswordInput
        label={t('module1.register.confirmPasswordLabel')}
        value={form.confirmPassword}
        error={errors.confirmPassword}
        onChangeText={update('confirmPassword')}
      />

      <TermsCheckbox
        checked={form.termsAccepted}
        label={t('module1.register.terms')}
        error={errors.termsAccepted}
        onPress={() => update('termsAccepted')(!form.termsAccepted)}
      />

      {apiError ? (
        <AppText variant="caption" color={colors.error} align="center">
          {apiError}
        </AppText>
      ) : null}

      <Button
        title={t('module1.register.button')}
        loading={registerClientState.isLoading}
        onPress={handleRegister}
      />

      <Button
        title={t('module1.register.alreadyAccount')}
        variant="ghost"
        onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.login as never)}
      />
    </AuthScreenLayout>
  );
};
