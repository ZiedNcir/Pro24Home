// Provide the key through the app runtime configuration before enabling production search.
// Google Places Autocomplete requires Places API Web Service + billing enabled.
export const GOOGLE_PLACES_API_KEY = 'AIzaSyC_gjKwzxFzut6jUeUP5bMtSqvFWSalHJg';

// Directions uses the Google Maps web service key configured for the mobile map.
export const GOOGLE_DIRECTIONS_API_KEY = 'AIzaSyBSKNWoXE0jFU4yqXavXZxK7MDVOk-GUgg';

export const GOOGLE_PLACES_REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
};

export const GOOGLE_PLACES_SEARCH_OPTIONS = {
    languageCode: 'fr',
};
