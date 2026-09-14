import { UserType } from '@entities/user/model';
import type { AuthResponse } from '@entities/user/model';

export type HomeRoute = 'Tabs' | 'ProfessionnelHome' | 'AccountPendingScreen';
export type AuthResponseLike = Partial<AuthResponse> & { data?: Partial<AuthResponse> };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const isInactiveAuthResponse = (response: unknown): boolean => {
    if (!isRecord(response)) return false;
    if (response.is_active === 0 || response.is_active === '0') return true;

    if (isRecord(response.data)) {
        if (response.data.is_active === 0 || response.data.is_active === '0') return true;
        return isRecord(response.data.data)
            && (response.data.data.is_active === 0 || response.data.data.is_active === '0');
    }

    return false;
};

export const getHomeRouteFromAuthResponse = (
    response: AuthResponseLike,
    fallbackRole: 'client' | 'professional' = 'client',
): HomeRoute => {
    const payload = response.data && typeof response.data === 'object'
        ? { ...response, ...response.data }
        : response;

    const accountStatus = payload.is_active as unknown;
    if (accountStatus === 0 || accountStatus === '0') return 'AccountPendingScreen';
    const userType = payload.user?.type ?? fallbackRole;
    return userType === UserType.PROFESSIONAL ? 'ProfessionnelHome' : 'Tabs';
};
