import type { NavigationEvent, NavigationState } from './types';

type NavigationAddress = {
    latitude?: number | string | null;
    longitude?: number | string | null;
    place_id?: string | null;
    placeId?: string | null;
    address?: string | null;
    location_name?: string | null;
};

export const getNavigationDestination = (address?: NavigationAddress | null) => {
    const latitude = Number(address?.latitude);
    const longitude = Number(address?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return {
        latitude,
        longitude,
        ...(address?.place_id || address?.placeId ? { placeId: address.place_id || address.placeId || undefined } : {}),
        ...(address?.location_name || address?.address ? { label: address.location_name || address.address || undefined } : {}),
    };
};

export const getNavigationState = (event: NavigationEvent, previous: NavigationState): NavigationState => {
    if (event.type === 'routeReady') {
        return { ...previous, status: 'active', etaMinutes: event.etaMinutes, distanceKm: event.distanceKm, instruction: event.instruction, errorCode: undefined };
    }
    if (event.type === 'progress') {
        return { ...previous, status: 'active', etaMinutes: event.etaMinutes ?? previous.etaMinutes, distanceKm: event.distanceKm ?? previous.distanceKm, instruction: event.instruction ?? previous.instruction };
    }
    if (event.type === 'arrival') return { ...previous, status: 'arrived', etaMinutes: 0, distanceKm: 0 };
    if (event.type === 'locationError' || event.type === 'routeError' || event.type === 'navigationError') {
        return { ...previous, status: 'error', errorCode: event.errorCode || event.type };
    }
    return previous;
};
