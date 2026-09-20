export type NavigationDestination = {
    latitude: number;
    longitude: number;
    placeId?: string;
    label?: string;
};

export type NavigationOptions = {
    voiceGuidance: boolean;
};

export type NavigationEvent = {
    type: 'routeReady' | 'progress' | 'arrival' | 'locationError' | 'routeError' | 'navigationError';
    etaMinutes?: number;
    distanceKm?: number;
    instruction?: string;
    errorCode?: string;
};

export type NavigationState = {
    status: 'idle' | 'starting' | 'active' | 'arrived' | 'error';
    etaMinutes?: number;
    distanceKm?: number;
    instruction?: string;
    errorCode?: string;
};

export type NavigationEventListener = (event: NavigationEvent) => void;

export type NativeNavigationModule = {
    startNavigation: (destination: NavigationDestination, options: NavigationOptions) => Promise<void>;
    stopNavigation: () => Promise<void>;
    setVoiceGuidance: (enabled: boolean) => Promise<void>;
    addListener: (listener: NavigationEventListener) => { remove: () => void };
};
