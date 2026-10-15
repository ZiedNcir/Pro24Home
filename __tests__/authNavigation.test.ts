import { getHomeRouteFromAuthResponse, isInactiveAuthResponse } from '../src/navigation/authNavigation';
import { isValidPostalCode } from '../src/services/authService';

describe('authentication home routing', () => {
    it('uses the user type returned by the API', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', documents: [] } })).toBe('Documents');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' } })).toBe('Tabs');
    });

    it('routes inactive professionals without submitted documents to upload and clients to account pending', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', documents: [] }, is_active: 0 })).toBe('Documents');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' }, is_active: 1 })).toBe('Tabs');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' }, is_active: 0 })).toBe('AccountPendingScreen');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' }, is_active: false })).toBe('AccountPendingScreen');
    });

    it('reads the account status from the data envelope returned by login', () => {
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 0, is_verified: 1, exist: 1, message: "Votre compte n'est pas actif." }, user: { type: 'client' } })).toBe('AccountPendingScreen');
    });

    it('uses the selected role when the API response has no user object', () => {
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 1 } }, 'professional')).toBe('Documents');
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 1 } }, 'client')).toBe('Tabs');
    });

    it('routes professionals with missing documents to document upload', () => {
        expect(getHomeRouteFromAuthResponse({
            is_active: 0,
            user: { type: 'professional', documents: [] },
        })).toBe('Documents');
    });

    it('routes professionals with all documents submitted and none rejected to verification pending', () => {
        const documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib']
            .map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status: 'pending' }));

        expect(getHomeRouteFromAuthResponse({
            is_active: 0,
            user: { type: 'professional', documents },
        })).toBe('ProfessionalVerificationPending');
    });

    it('routes professionals with a rejected document back to document upload', () => {
        const documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib']
            .map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status: name === 'kbis' ? 'rejected' : 'pending' }));

        expect(getHomeRouteFromAuthResponse({
            is_active: 0,
            user: { type: 'professional', documents },
        })).toBe('Documents');
    });

    it('does not treat a rejected document as resolved when another upload of that type is pending', () => {
        const documents = [
            ...['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib']
                .map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status: 'pending' })),
            { id: 6, name: 'kbis', type: 'img', url: '', uploaded_at: '', status: 'rejected' },
        ];

        expect(getHomeRouteFromAuthResponse({
            is_active: 0,
            user: { type: 'professional', documents },
        })).toBe('Documents');
    });

    it('routes active professionals with every document approved to their home', () => {
        const documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib']
            .map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status: 'approved' }));

        expect(getHomeRouteFromAuthResponse({
            is_active: 1,
            user: { type: 'professional', documents },
        })).toBe('ProfessionnelHome');
    });

    it('detects an inactive account when login returns it as an API error', () => {
        expect(isInactiveAuthResponse({ data: { is_active: 0, message: "Votre compte n'est pas actif." } })).toBe(true);
        expect(isInactiveAuthResponse({ data: { data: { is_active: 0 } } })).toBe(true);
    });
});

describe('postal code validation', () => {
    it('accepts exactly five digits for professional registration', () => {
        expect(isValidPostalCode('75001')).toBe(true);
        expect(isValidPostalCode('7500')).toBe(false);
        expect(isValidPostalCode('750011')).toBe(false);
    });
});
