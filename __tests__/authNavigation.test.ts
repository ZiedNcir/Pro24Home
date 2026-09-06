import { getHomeRouteFromAuthResponse } from '../src/navigation/authNavigation';
import { isValidPostalCode } from '../src/services/authService';

describe('authentication home routing', () => {
    it('uses the user type returned by the API', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' } })).toBe('ProfessionnelHome');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' } })).toBe('Tabs');
    });

    it('routes unverified accounts to the account pending screen', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' }, is_verified: 0 })).toBe('AccountPendingScreen');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' }, is_verified: 1 })).toBe('Tabs');
    });
});

describe('postal code validation', () => {
    it('accepts exactly five digits for professional registration', () => {
        expect(isValidPostalCode('75001')).toBe(true);
        expect(isValidPostalCode('7500')).toBe(false);
        expect(isValidPostalCode('750011')).toBe(false);
    });
});
