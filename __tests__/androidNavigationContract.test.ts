import { buildNavigationStartPayload, normalizeNavigationEvent } from '../src/core/navigation/native-navigation';

describe('android navigation contract', () => {
    it('builds the native start payload without changing destination fields', () => {
        expect(buildNavigationStartPayload({ latitude: 36.8, longitude: 10.18, placeId: 'place-1' }, { voiceGuidance: true }))
            .toEqual({ latitude: 36.8, longitude: 10.18, placeId: 'place-1', voiceGuidance: true });
    });

    it('preserves native error codes when normalizing events', () => {
        expect(normalizeNavigationEvent({ type: 'navigationError', errorCode: 'NOT_AUTHORIZED' }))
            .toEqual({ type: 'navigationError', errorCode: 'NOT_AUTHORIZED' });
    });
});
