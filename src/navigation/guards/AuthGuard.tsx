import React from 'react';

import { useAppSelector } from '../../store/hooks';
import {
  selectIsAuthenticated,
  selectIsClient,
  selectIsProfessional,
} from '../../store/selectors';

export interface AuthGuardProps {
  client: React.ReactNode;
  professional: React.ReactNode;
  guest: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  client,
  professional,
  guest,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isClient = useAppSelector(selectIsClient);
  const isProfessional = useAppSelector(selectIsProfessional);

  if (!isAuthenticated) {
    return <>{guest}</>;
  }

  if (isProfessional) {
    return <>{professional}</>;
  }

  if (isClient) {
    return <>{client}</>;
  }

  return <>{guest}</>;
};
