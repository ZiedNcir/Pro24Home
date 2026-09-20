import { NativeEventEmitter, NativeModules } from 'react-native';

import type { NavigationDestination, NavigationEvent, NavigationEventListener, NavigationOptions, NativeNavigationModule } from './types';

const MODULE_NAME = 'Pro24HomeNavigation';
const EVENT_NAME = 'navigationEvent';
const nativeModule = NativeModules[MODULE_NAME] as {
    startNavigation?: (destination: NavigationDestination, options: NavigationOptions) => Promise<void>;
    stopNavigation?: () => Promise<void>;
    setVoiceGuidance?: (enabled: boolean) => Promise<void>;
} | undefined;
const eventEmitter = nativeModule ? new NativeEventEmitter(nativeModule as any) : null;

const unavailable = () => Promise.reject(new Error('Navigation native module is unavailable'));

export const nativeNavigation: NativeNavigationModule = {
    startNavigation: (destination, options) => nativeModule?.startNavigation
        ? nativeModule.startNavigation(destination, options)
        : unavailable(),
    stopNavigation: () => nativeModule?.stopNavigation ? nativeModule.stopNavigation() : unavailable(),
    setVoiceGuidance: enabled => nativeModule?.setVoiceGuidance ? nativeModule.setVoiceGuidance(enabled) : unavailable(),
    addListener: (listener: NavigationEventListener) => {
        if (!eventEmitter) return { remove: () => undefined };
        const subscription = eventEmitter.addListener(EVENT_NAME, (event: NavigationEvent) => listener(event));
        return { remove: () => subscription.remove() };
    },
};
