import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../../design-system';
import { t } from '../../../../translations/i18n';

import { AuthScreenLayout } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';

type Props = NativeStackScreenProps<any>;

export const C01ClientWelcome: React.FC<Props> = ({ navigation }) => (
  <AuthScreenLayout
    eyebrow="Pro24Home"
    title={t('module1.welcome.title')}
    subtitle={t('module1.welcome.subtitle')}
  >
    <Button
      title={t('module1.welcome.login')}
      onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.login as never)}
    />

    <Button
      title={t('module1.welcome.register')}
      variant="secondary"
      onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.register as never)}
    />

    <Button
      title={t('common.next')}
      variant="ghost"
      onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.onboardingOne as never)}
    />
  </AuthScreenLayout>
);
