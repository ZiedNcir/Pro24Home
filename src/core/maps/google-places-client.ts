import { GOOGLE_PLACES_API_KEY } from '../../config/googlePlaces';

export const lookupPlace = async (placeId: string) => {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?key=${GOOGLE_PLACES_API_KEY}`,
    { headers: { 'X-Goog-FieldMask': 'id,formattedAddress,location' } },
  );
  const body = await response.json();

  if (!response.ok || body?.error) {
    throw new Error(body?.error?.message || 'Impossible de récupérer cette adresse.');
  }

  return body;
};

export const fetchGooglePlaceDetails = lookupPlace;
