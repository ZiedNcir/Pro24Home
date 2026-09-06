import type { IconName } from '@components/Icon';
import type { AppStackType, BottomTabType } from './constant/core';

export const PROFESSIONAL_BOTTOM_TABS: Array<{ route: keyof BottomTabType; icon: IconName; title: string }> = [
    { route: 'Home', icon: 'fa-home', title: 'Accueil' },
    { route: 'ListIntervention', icon: 'fa-list', title: 'Interventions' },
    { route: 'SettingPage', icon: 'fa-cog', title: 'Paramètres' },
];

export const PROFESSIONAL_SETTINGS_DOCUMENT: { title: string; description: string; icon: IconName; route: keyof AppStackType } = {
    title: 'Mes documents',
    description: 'Gérez vos documents professionnels',
    icon: 'fa-file-alt',
    route: 'Documents',
};
