import { SUPPORT_TOPICS, isSupportFormValid } from '../src/screens/Home/client/utils/contactSupport';

describe('contact support form', () => {
    it('provides the support topics used by the form', () => {
        expect(SUPPORT_TOPICS).toHaveLength(4);
        expect(SUPPORT_TOPICS[0]).toEqual({ key: 'account', label: 'Vérification de mon compte', icon: 'fa-user' });
    });

    it('requires a topic and a non-empty message before sending', () => {
        expect(isSupportFormValid('', '')).toBe(false);
        expect(isSupportFormValid('account', 'Je souhaite suivre mon dossier.')).toBe(true);
    });
});
