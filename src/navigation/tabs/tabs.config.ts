import type { IconName } from '../../design-system';
import { ClientRoutes, ProfessionalRoutes } from '../routes';

export interface TabConfig {
  key: string;
  labelKey: string;
  routeName: string;
  icon: IconName;
}

export const clientTabs: TabConfig[] = [
  {
    key: 'home',
    labelKey: 'navigation.client.home',
    routeName: ClientRoutes.Home,
    icon: 'home',
  },
  {
    key: 'history',
    labelKey: 'navigation.client.history',
    routeName: ClientRoutes.History,
    icon: 'receipt',
  },
  {
    key: 'notifications',
    labelKey: 'navigation.client.notifications',
    routeName: ClientRoutes.Notifications,
    icon: 'bell',
  },
  {
    key: 'profile',
    labelKey: 'navigation.client.profile',
    routeName: ClientRoutes.Profile,
    icon: 'user',
  },
];

export const professionalTabs: TabConfig[] = [
  {
    key: 'dashboard',
    labelKey: 'navigation.professional.dashboard',
    routeName: ProfessionalRoutes.Dashboard,
    icon: 'home',
  },
  {
    key: 'requests',
    labelKey: 'navigation.professional.requests',
    routeName: ProfessionalRoutes.Requests,
    icon: 'tools',
  },
  {
    key: 'notifications',
    labelKey: 'navigation.professional.notifications',
    routeName: ProfessionalRoutes.Notifications,
    icon: 'bell',
  },
  {
    key: 'profile',
    labelKey: 'navigation.professional.profile',
    routeName: ProfessionalRoutes.Profile,
    icon: 'user',
  },
];
