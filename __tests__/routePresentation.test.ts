import { formatRouteDistance, getNavigationBannerCopy, getProfessionalStatusActions, getRouteFitCoordinates, getTrackingPanelMode } from '../src/screens/Intervention/utils/routePresentation';

describe('formatRouteDistance', () => {
    it('formats short and long routes for the tracking card', () => {
        expect(formatRouteDistance(0.45)).toBe('450 m');
        expect(formatRouteDistance(12.4)).toBe('12,4 km');
    });
});

describe('getRouteFitCoordinates', () => {
    it('builds the in-app map viewport from the professional to the client', () => {
        const professional = { latitude: 36.8, longitude: 10.18 };
        const client = { latitude: 36.82, longitude: 10.2 };

        expect(getRouteFitCoordinates(professional, client)).toEqual([professional, client]);
        expect(getRouteFitCoordinates(null, client)).toBeNull();
    });
});

describe('getNavigationBannerCopy', () => {
    it('communicates when in-app navigation is active', () => {
        expect(getNavigationBannerCopy(false)).toEqual({ title: 'Prêt à partir ?', subtitle: 'Itinéraire vers le client' });
        expect(getNavigationBannerCopy(true)).toEqual({ title: 'Navigation active', subtitle: 'Suivez l’itinéraire dans Pro24Home' });
    });
});

describe('getTrackingPanelMode', () => {
    it('uses a compact panel after the trip starts', () => {
        expect(getTrackingPanelMode(false)).toBe('expanded');
        expect(getTrackingPanelMode(true)).toBe('compact');
    });
});

describe('getProfessionalStatusActions', () => {
    it('exposes the statuses available after arrival', () => {
        expect(getProfessionalStatusActions()).toEqual([
            { status: 'in progress', label: 'Intervention en cours' },
            { status: 'rejected', label: 'Refuser l’intervention' },
            { status: 'completed', label: 'Terminer l’intervention' },
        ]);
    });
});
