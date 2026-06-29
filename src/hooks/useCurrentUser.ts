import { useAppSelector } from '../store/hooks';
import {
  selectCurrentClientInfo,
  selectCurrentProfessionalInfo,
  selectEffectiveUserProfile,
  selectIsClient,
  selectIsProfessional,
} from '../store/selectors';

import {
  getUserDisplayName,
  getUserRoleLabel,
} from '../adapters';

export const useCurrentUser = () => {
  const user = useAppSelector(selectEffectiveUserProfile);
  const client = useAppSelector(selectCurrentClientInfo);
  const professional = useAppSelector(selectCurrentProfessionalInfo);
  const isClient = useAppSelector(selectIsClient);
  const isProfessional = useAppSelector(selectIsProfessional);

  return {
    user,
    client,
    professional,
    isClient,
    isProfessional,
    displayName: getUserDisplayName(user),
    roleLabel: getUserRoleLabel(user),
  };
};
