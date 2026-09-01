import {
    GOOGLE_PLACES_REQUEST_HEADERS,
    GOOGLE_PLACES_SEARCH_OPTIONS,
} from '../src/config/googlePlaces';

test('sends Places API New requests as JSON', () => {
    expect(GOOGLE_PLACES_REQUEST_HEADERS['Content-Type']).toBe('application/json');
});

test('does not restrict address search to France', () => {
    expect(GOOGLE_PLACES_SEARCH_OPTIONS).not.toHaveProperty('includedRegionCodes');
});
