import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { t } from '../../../../translations/i18n';
import { PermissionCard } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';

type Props = NativeStackScreenProps<any>;

export const C09ClientNotificationsPermission: React.FC<Props> = ({ navigation }) => {
  const goNext = () => navigation.navigate(CLIENT_AUTH_ROUTES.firstHome as never);

  return (
    <PermissionCard
      icon="bell"
      title={t('module1.notifications.title')}
      description={t('module1.notifications.subtitle')}
      allowLabel={t('module1.notifications.allow')}
      laterLabel={t('module1.notifications.later')}
      onAllow={goNext}
      onLater={goNext}
    />
  );
};
