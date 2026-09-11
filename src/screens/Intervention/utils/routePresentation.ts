export const formatRouteDistance = (distanceInKm?: number | null) => {
    if (distanceInKm === null || distanceInKm === undefined || !Number.isFinite(distanceInKm)) return 'Distance indisponible';
    if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)} m`;
    return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
};

export const getRouteFitCoordinates = <T extends { latitude: number; longitude: number }>(
    professional: T | null | undefined,
    client: T | null | undefined,
) => professional && client ? [professional, client] : null;
