import { UserType } from '@store/api/api.types';
import type { AuthResponse } from '@store/api/api.types';

export type HomeRoute = 'Tabs' | 'ProfessionnelHome' | 'AccountPendingScreen';
export type AuthResponseLike = Partial<AuthResponse> & { data?: Partial<AuthResponse> };

export const getHomeRouteFromAuthResponse = (
    response: AuthResponseLike,
): HomeRoute => {
    const payload = response.data && typeof response.data === 'object'
        ? { ...response, ...response.data }
        : response;

    if (payload.is_active === 0) return 'AccountPendingScreen';
    return payload.user?.type === UserType.PROFESSIONAL ? 'ProfessionnelHome' : 'Tabs';
};
