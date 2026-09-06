import { getHomeRouteFromAuthResponse, isInactiveAuthResponse } from '../src/navigation/authNavigation';
import { isValidPostalCode } from '../src/services/authService';

describe('authentication home routing', () => {
    it('uses the user type returned by the API', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' } })).toBe('ProfessionnelHome');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' } })).toBe('Tabs');
    });

    it('routes inactive accounts to the account pending screen', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' }, is_active: 0 })).toBe('AccountPendingScreen');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' }, is_active: 1 })).toBe('Tabs');
    });

    it('reads the account status from the data envelope returned by login', () => {
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 0, is_verified: 1, exist: 1, message: "Votre compte n'est pas actif." }, user: { type: 'professional' } })).toBe('AccountPendingScreen');
    });

    it('uses the selected role when the API response has no user object', () => {
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 1 } }, 'professional')).toBe('ProfessionnelHome');
        expect(getHomeRouteFromAuthResponse({ data: { is_active: 1 } }, 'client')).toBe('Tabs');
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
