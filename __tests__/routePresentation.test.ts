import { formatRouteDistance, getRouteFitCoordinates } from '../src/screens/Intervention/utils/routePresentation';

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
