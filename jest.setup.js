/* global jest */

jest.mock('@googlemaps/react-native-navigation-sdk', () => ({
  NavigationProvider: ({ children }) => children,
  NavigationView: 'NavigationView',
  NavigationUIEnabledPreference: { AUTOMATIC: 0 },
  TaskRemovedBehavior: { CONTINUE_SERVICE: 0 },
  TravelMode: { DRIVING: 0 },
  AudioGuidance: { SILENT: 0, VOICE_ALERTS_AND_GUIDANCE: 4 },
  useNavigation: () => ({
    navigationController: {
      showTermsAndConditionsDialog: jest.fn(async () => true),
      init: jest.fn(async () => 'ok'),
      setDestinations: jest.fn(async () => 'OK'),
      startGuidance: jest.fn(async () => undefined),
      stopGuidance: jest.fn(async () => undefined),
      setAudioGuidanceType: jest.fn(),
    },
    setOnArrival: jest.fn(),
    setOnLocationChanged: jest.fn(),
    setOnRemainingTimeOrDistanceChanged: jest.fn(),
    removeAllListeners: jest.fn(),
  }),
}));

if (typeof window !== 'undefined' && typeof window.dispatchEvent !== 'function') {
  window.dispatchEvent = jest.fn();
}

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));

jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-onesignal', () => {
  const listeners = new Set();

  return {
    LogLevel: { Verbose: 0 },
    OneSignal: {
      Debug: { setLogLevel: jest.fn() },
      initialize: jest.fn(),
      Notifications: {
        getPermissionAsync: jest.fn(async () => true),
        requestPermission: jest.fn(async () => true),
        addEventListener: jest.fn(),
      },
      User: {
        pushSubscription: {
          getIdAsync: jest.fn(async () => null),
          addEventListener: jest.fn((_event, listener) => listeners.add(listener)),
          removeEventListener: jest.fn((_event, listener) => listeners.delete(listener)),
          emitChange: (id) => listeners.forEach(listener => listener({ current: { id } })),
        },
      },
    },
  };
});

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'fr', languageTag: 'fr-FR', countryCode: 'FR', isRTL: false }],
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));
