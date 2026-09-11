export type Coordinates = { latitude: number; longitude: number };

export const buildProfessionalStatusPayload = (online: boolean, coordinates: Coordinates) => ({
    onligne: online ? 1 as const : 0 as const,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
});
