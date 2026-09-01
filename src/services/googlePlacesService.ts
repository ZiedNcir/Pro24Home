import { GOOGLE_PLACES_API_KEY } from '../config/googlePlaces';

export const fetchGooglePlaceDetails = async (placeId: string) => {
    const response = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?key=${GOOGLE_PLACES_API_KEY}`,
        {
            headers: {
                'X-Goog-FieldMask': 'id,formattedAddress,location',
            },
        },
    );

    const body = await response.json();
    if (!response.ok || body?.error) {
        throw new Error(body?.error?.message || 'Impossible de récupérer cette adresse.');
    }

    return body;
};

export const fetchAddressFromCoordinates = async (latitude: number, longitude: number) => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=fr&key=${GOOGLE_PLACES_API_KEY}`,
    );
    const body = await response.json();

    if (!response.ok || body?.status !== 'OK' || !body.results?.[0]?.formatted_address) {
        throw new Error('Impossible de déterminer cette adresse.');
    }

    return body.results[0].formatted_address as string;
};
