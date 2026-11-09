import { normalizeNavigationEvent } from '../src/core/navigation/native-navigation';

describe('ios navigation contract', () => {
    it.each([
        [{ type: 'routeReady', etaMinutes: 12, distanceKm: 4.2 }, 'routeReady'],
        [{ type: 'progress', instruction: 'Tournez à droite' }, 'progress'],
        [{ type: 'arrival' }, 'arrival'],
        [{ type: 'locationError', errorCode: 'LOCATION_PERMISSION_MISSING' }, 'locationError'],
        [{ type: 'routeError', errorCode: 'NETWORK_ERROR' }, 'routeError'],
    ] as const)('normalizes %s without changing its event type', (event, type) => {
        expect(normalizeNavigationEvent(event as any).type).toBe(type);
    });
});
