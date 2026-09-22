import type { IconName } from '@shared/ui/icon';
import type { AppStackType, BottomTabType } from './constant/core';

export const PROFESSIONAL_BOTTOM_TABS: Array<{ route: keyof BottomTabType; icon: IconName; titleKey: string }> = [
    { route: 'Home', icon: 'fa-home', titleKey: 'navigation.home' },
    { route: 'ListIntervention', icon: 'fa-list', titleKey: 'navigation.interventions' },
    { route: 'SettingPage', icon: 'fa-cog', titleKey: 'client.settings.title' },
];

export const PROFESSIONAL_SETTINGS_DOCUMENT: { icon: IconName; route: keyof AppStackType } = {
    icon: 'fa-file-alt',
    route: 'Documents',
};
