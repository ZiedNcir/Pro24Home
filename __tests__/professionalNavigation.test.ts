import { PROFESSIONAL_BOTTOM_TABS, PROFESSIONAL_SETTINGS_DOCUMENT } from '../src/navigation/professionalNavigation';

describe('professional navigation', () => {
    it('exposes only home, interventions and settings in the bottom bar', () => {
        expect(PROFESSIONAL_BOTTOM_TABS.map(tab => tab.route)).toEqual(['Home', 'ListIntervention', 'SettingPage']);
    });

    it('exposes documents from professional settings', () => {
        expect(PROFESSIONAL_SETTINGS_DOCUMENT.title).toBe('Mes documents');
        expect(PROFESSIONAL_SETTINGS_DOCUMENT.route).toBe('Documents');
    });
});
