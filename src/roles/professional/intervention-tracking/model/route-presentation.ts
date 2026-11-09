export const formatRouteDistance = (distanceInKm?: number | null) => {
    if (distanceInKm === null || distanceInKm === undefined || !Number.isFinite(distanceInKm)) return null;
    if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)} m`;
    return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
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
    const latitude = Number(address?.latitude);
    const longitude = Number(address?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { title: address?.address || '', position: { lat: latitude, lng: longitude } };
};

export const getNavigationRouteError = (status?: string) => status && status !== 'OK' ? status : null;
