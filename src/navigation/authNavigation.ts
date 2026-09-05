import { UserType } from '@store/api/api.types';
import type { AuthResponse } from '@store/api/api.types';

export type HomeRoute = 'Tabs' | 'ProfessionnelHome';

export const getHomeRouteFromAuthResponse = (response: Pick<AuthResponse, 'user'>): HomeRoute =>
    response.user?.type === UserType.PROFESSIONAL ? 'ProfessionnelHome' : 'Tabs';
