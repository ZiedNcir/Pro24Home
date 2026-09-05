import { getHomeRouteFromAuthResponse } from '../src/navigation/authNavigation';
import { isValidPostalCode } from '../src/services/authService';

describe('authentication home routing', () => {
    it('uses the user type returned by the API', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' } })).toBe('ProfessionnelHome');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' } })).toBe('Tabs');
    });
});

describe('postal code validation', () => {
    it('accepts exactly five digits for professional registration', () => {
        expect(isValidPostalCode('75001')).toBe(true);
        expect(isValidPostalCode('7500')).toBe(false);
        expect(isValidPostalCode('750011')).toBe(false);
    });
});
