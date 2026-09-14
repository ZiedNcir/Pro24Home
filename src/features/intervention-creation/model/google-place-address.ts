export interface GooglePlaceDetailsLike {
    formatted_address?: string;
    formattedAddress?: string;
    geometry?: {
        location?: {
            lat?: number;
            lng?: number;
        };
    };
    location?: {
        latitude?: number;
        longitude?: number;
    };
}

export interface SelectedAddressLocation {
    address: string;
    latitude: number;
    longitude: number;
}

export const mapGooglePlaceToAddress = (
    details?: GooglePlaceDetailsLike | null,
): SelectedAddressLocation | null => {
    const latitude = details?.geometry?.location?.lat ?? details?.location?.latitude;
    const longitude = details?.geometry?.location?.lng ?? details?.location?.longitude;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return null;
    }

    return {
        address: details?.formatted_address || details?.formattedAddress || 'Adresse sélectionnée',
        latitude,
        longitude,
    };
};
