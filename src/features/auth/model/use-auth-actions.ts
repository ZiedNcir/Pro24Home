import {
  getHomeRouteFromAuthResponse,
  type AuthResponseLike,
  type HomeRoute,
} from '../../../navigation/authNavigation';

export type { HomeRoute };

export const toHomeRoute = (response: AuthResponseLike): HomeRoute =>
  getHomeRouteFromAuthResponse(response);
