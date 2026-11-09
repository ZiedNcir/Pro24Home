import { getNavigationDestination, getNavigationState } from '../src/core/navigation/navigation-state';

describe('navigationState', () => {
    it('moves from starting to active when a route is ready', () => {
        expect(getNavigationState({ type: 'routeReady', etaMinutes: 18, distanceKm: 7.4 }, { status: 'starting' }))
            .toEqual({ status: 'active', etaMinutes: 18, distanceKm: 7.4, errorCode: undefined });
    });

    it('returns an invalid destination when coordinates are not finite', () => {
        expect(getNavigationDestination({ latitude: 'bad', longitude: 2 } as any)).toBeNull();
    });

    it('stops active guidance at arrival', () => {
        expect(getNavigationState({ type: 'arrival' }, { status: 'active', etaMinutes: 1, distanceKm: 0.1 }))
            .toMatchObject({ status: 'arrived' });
    });
});
