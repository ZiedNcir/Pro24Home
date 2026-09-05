import { getHomeRouteFromAuthResponse } from '../src/navigation/authNavigation';

describe('authentication home routing', () => {
    it('uses the user type returned by the API', () => {
        expect(getHomeRouteFromAuthResponse({ user: { type: 'professional' } })).toBe('ProfessionnelHome');
        expect(getHomeRouteFromAuthResponse({ user: { type: 'client' } })).toBe('Tabs');
    });
});
