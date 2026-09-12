export const formatRouteDistance = (distanceInKm?: number | null) => {
    if (distanceInKm === null || distanceInKm === undefined || !Number.isFinite(distanceInKm)) return 'Distance indisponible';
    if (distanceInKm < 1) return `${Math.round(distanceInKm * 1000)} m`;
    return `${distanceInKm.toFixed(1).replace('.', ',')} km`;
};

export const getRouteFitCoordinates = <T extends { latitude: number; longitude: number }>(
    professional: T | null | undefined,
    client: T | null | undefined,
) => professional && client ? [professional, client] : null;

export const getNavigationBannerCopy = (isTripStarted: boolean) => isTripStarted
    ? { title: 'Navigation active', subtitle: 'Suivez l’itinéraire dans Pro24Home' }
    : { title: 'Prêt à partir ?', subtitle: 'Itinéraire vers le client' };

export const getTrackingPanelMode = (isTripStarted: boolean): 'expanded' | 'compact' => isTripStarted ? 'compact' : 'expanded';

export const getProfessionalStatusActions = () => [
    { status: 'in progress' as const, label: 'Intervention en cours' },
    { status: 'rejected' as const, label: 'Refuser l’intervention' },
    { status: 'completed' as const, label: 'Terminer l’intervention' },
];
