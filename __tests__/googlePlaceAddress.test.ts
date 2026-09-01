import { mapGooglePlaceToAddress } from '../src/screens/Intervention/utils/googlePlaceAddress';

describe('mapGooglePlaceToAddress', () => {
    it('extracts the address and coordinates selected from Google Places', () => {
        expect(mapGooglePlaceToAddress({
            formatted_address: '10 Rue de la Paix, Paris',
            geometry: { location: { lat: 48.8698, lng: 2.3316 } },
        })).toEqual({
            address: '10 Rue de la Paix, Paris',
            latitude: 48.8698,
            longitude: 2.3316,
        });
    });

    it('returns null when a place has no coordinates', () => {
        expect(mapGooglePlaceToAddress({ formatted_address: 'Paris' })).toBeNull();
    });

    it('extracts coordinates from a Places API New response', () => {
        expect(mapGooglePlaceToAddress({
            formattedAddress: 'Paris, France',
            location: { latitude: 48.8566, longitude: 2.3522 },
        })).toEqual({
            address: 'Paris, France',
            latitude: 48.8566,
            longitude: 2.3522,
        });
    });
});
