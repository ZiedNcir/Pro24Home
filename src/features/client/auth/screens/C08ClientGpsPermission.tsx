import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { t } from '../../../../translations/i18n';
import { PermissionCard } from '../components';
import { CLIENT_AUTH_ROUTES } from '../constants';

type Props = NativeStackScreenProps<any>;

export const C08ClientGpsPermission: React.FC<Props> = ({ navigation }) => {
  const goNext = () => navigation.navigate(CLIENT_AUTH_ROUTES.notifications as never);

  return (
    <PermissionCard
      icon="location"
      title={t('module1.gps.title')}
      description={t('module1.gps.subtitle')}
      allowLabel={t('module1.gps.allow')}
      laterLabel={t('module1.gps.later')}
      onAllow={goNext}
      onLater={goNext}
    />
  );
};
