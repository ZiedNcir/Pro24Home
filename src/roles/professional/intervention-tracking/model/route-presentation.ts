export const formatRouteDistance = (distanceInKm?: number | null) => {
    if (distanceInKm === null || distanceInKm === undefined || !Number.isFinite(distanceInKm)) return null;
    if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)} m`;
    return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
};

export const getRoutePolylineDistanceMeters = (points: ReadonlyArray<{ lat: number; lng: number }>) => {
    if (points.length < 2 || points.some(point => !Number.isFinite(point.lat) || !Number.isFinite(point.lng))) return null;
    const radians = (degrees: number) => degrees * Math.PI / 180;
    let distanceMeters = 0;
    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        if (!previous || !current) return null;
        const latitudeDelta = radians(current.lat - previous.lat);
        const longitudeDelta = radians(current.lng - previous.lng);
        const previousLatitude = radians(previous.lat);
        const currentLatitude = radians(current.lat);
        const rawHaversine = Math.sin(latitudeDelta / 2) ** 2
            + Math.cos(previousLatitude) * Math.cos(currentLatitude) * Math.sin(longitudeDelta / 2) ** 2;
        const haversine = Math.min(1, Math.max(0, rawHaversine));
        distanceMeters += 6371008.8 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    }
    return Number.isFinite(distanceMeters) && distanceMeters > 0 ? distanceMeters : null;
};

export const getRouteFitCoordinates = <T extends { latitude: number; longitude: number }>(
    professional: T | null | undefined,
    client: T | null | undefined,
) => professional && client ? [professional, client] : null;

export const getNavigationBannerCopy = (isTripStarted: boolean) => isTripStarted
    ? { titleKey: 'professional.tracking.active', subtitleKey: 'professional.tracking.activeSubtitle' }
    : { titleKey: 'professional.tracking.ready', subtitleKey: 'professional.tracking.readySubtitle' };

export const getTrackingPanelMode = (isTripStarted: boolean): 'expanded' | 'compact' => isTripStarted ? 'compact' : 'expanded';

export const getProfessionalStatusActions = () => [
    { status: 'in progress' as const, labelKey: 'professional.tracking.inProgress' },
    { status: 'rejected' as const, labelKey: 'professional.tracking.reject' },
    { status: 'completed' as const, labelKey: 'professional.tracking.complete' },
];

export const getGoogleNavigationWaypoint = (address?: { latitude?: unknown; longitude?: unknown; address?: string | null }) => {
    const parseCoordinate = (value: unknown, min: number, max: number) => {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) return null;
        const coordinate = Number(value);
        return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max ? coordinate : null;
    };
    const latitude = parseCoordinate(address?.latitude, -90, 90);
    const longitude = parseCoordinate(address?.longitude, -180, 180);
    if (latitude === null || longitude === null) return null;
    return { title: address?.address || '', position: { lat: latitude, lng: longitude } };
};

export const getNavigationRouteError = (status?: string) => status && status !== 'OK' ? status : null;
