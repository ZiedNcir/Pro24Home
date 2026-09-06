import { UserType } from '@store/api/api.types';
import type { AuthResponse } from '@store/api/api.types';

export type HomeRoute = 'Tabs' | 'ProfessionnelHome' | 'AccountPendingScreen';

export const getHomeRouteFromAuthResponse = (
    response: Pick<AuthResponse, 'user'> & Partial<Pick<AuthResponse, 'is_active'>>,
): HomeRoute => {
    if (response.is_active === 0) return 'AccountPendingScreen';
    return response.user?.type === UserType.PROFESSIONAL ? 'ProfessionnelHome' : 'Tabs';
};
