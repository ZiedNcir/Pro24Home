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

import { AuthScreenLayout } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';
import {
  FieldErrors,
  LoginField,
  getApiMessage,
  hasErrors,
  validateLoginForm,
} from '../validation';

type Props = NativeStackScreenProps<any>;

export const C05ClientLogin: React.FC<Props> = ({ navigation }) => {
  const { login, loginState } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogin = async () => {
    setApiError(null);

    const validationErrors = validateLoginForm(
      { email, password },
      {
        required: t('validation.required'),
        invalidEmail: t('validation.invalidPhone'),
        passwordTooShort: t('validation.passwordTooShort'),
      },
    );

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      } as any);

      navigation.navigate(CLIENT_AUTH_ROUTES.gps as never);
    } catch (error) {
      setApiError(getApiMessage(error, t('validation.apiError')));
    }
  };

  return (
    <AuthScreenLayout
      title={t('module1.login.title')}
      subtitle={t('module1.login.subtitle')}
    >
      <TextInput
        label={t('module1.login.email')}
        placeholder={t('module1.login.emailPlaceholder')}
        value={email}
        error={errors.email}
        onChangeText={(value) => {
          setEmail(value);
          if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
        }}
      />

      <PasswordInput
        label={t('module1.login.passwordLabel')}
        placeholder={t('module1.login.passwordPlaceholder')}
        value={password}
        error={errors.password}
        onChangeText={(value) => {
          setPassword(value);
          if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
        }}
      />

      {apiError ? (
        <AppText variant="caption" color={colors.error} align="center">
          {apiError}
        </AppText>
      ) : null}

      <Button
        title={t('module1.login.button')}
        loading={loginState.isLoading}
        onPress={handleLogin}
      />

      <Button
        title={t('module1.login.forgotPassword')}
        variant="ghost"
        onPress={() => { }}
      />

      <Button
        title={t('module1.login.createAccount')}
        variant="secondary"
        onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.register as never)}
      />
    </AuthScreenLayout>
  );
};
