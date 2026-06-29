import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  colors,
} from '../../../../design-system';

import { t } from '../../../../translations/i18n';
import { useAuth } from '../../../../hooks';

import { AuthScreenLayout, OtpInput } from '../components';
import { CLIENT_AUTH_ROUTES, OTP_CODE_LENGTH } from '../constants';
import {
  FieldErrors,
  OtpField,
  getApiMessage,
  hasErrors,
  validateOtpForm,
} from '../validation';

type Props = NativeStackScreenProps<any>;

export const C07ClientOtp: React.FC<Props> = ({ navigation, route }) => {
  const { verifyAccount, verifyAccountState, resendVerification } = useAuth();

  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<FieldErrors<OtpField>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const phone = (route.params as any)?.phone;

  const handleVerify = async () => {
    setApiError(null);

    const validationErrors = validateOtpForm(
      { code },
      OTP_CODE_LENGTH,
      {
        required: t('validation.required'),
        invalidOtp: t('validation.invalidOtp'),
      },
    );

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      await verifyAccount({
        phone_number: phone,
        code,
      } as any);

      navigation.navigate(CLIENT_AUTH_ROUTES.gps as never);
    } catch (error) {
      setApiError(getApiMessage(error, t('validation.apiError')));
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification({ phone_number: phone } as any);
    } catch (error) {
      setApiError(getApiMessage(error, t('validation.apiError')));
    }
  };

  return (
    <AuthScreenLayout
      title={t('module1.otp.title')}
      subtitle={t('module1.otp.subtitle')}
    >
      <OtpInput
        value={code}
        length={OTP_CODE_LENGTH}
        error={errors.code}
        onChangeText={(value) => {
          setCode(value);
          if (errors.code) setErrors((current) => ({ ...current, code: undefined }));
        }}
      />

      {apiError ? (
        <AppText variant="caption" color={colors.error} align="center">
          {apiError}
        </AppText>
      ) : null}

      <Button
        title={t('module1.otp.button')}
        loading={verifyAccountState.isLoading}
        onPress={handleVerify}
      />

      <Button
        title={t('module1.otp.resend')}
        variant="ghost"
        onPress={handleResend}
      />
    </AuthScreenLayout>
  );
};
