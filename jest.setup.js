/* global jest */

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
