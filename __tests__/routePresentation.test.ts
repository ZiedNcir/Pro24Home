import { formatRouteDistance, getGoogleNavigationWaypoint, getNavigationBannerCopy, getNavigationRouteError, getProfessionalStatusActions, getRouteFitCoordinates, getTrackingPanelMode } from '../src/roles/professional/intervention-tracking/model/route-presentation';

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

describe('Google navigation route orchestration', () => {
    it('rejects an intervention without usable coordinates', () => {
        expect(getGoogleNavigationWaypoint({ latitude: 'bad', longitude: 2 })).toBeNull();
    });

    it('creates a waypoint and recoverable route error copy', () => {
        expect(getGoogleNavigationWaypoint({ latitude: 36.8, longitude: 10.1, address: 'Client' })).toEqual({
            title: 'Client', position: { lat: 36.8, lng: 10.1 },
        });
        expect(getNavigationRouteError('NETWORK_ERROR')).toBe('Itinéraire indisponible (NETWORK_ERROR).');
        expect(getNavigationRouteError('OK')).toBeNull();
    });
});
