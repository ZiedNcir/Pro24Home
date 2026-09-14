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

jest.mock('react-native-onesignal', () => ({
  LogLevel: { Verbose: 0 },
  OneSignal: {
    Debug: { setLogLevel: jest.fn() },
    initialize: jest.fn(),
  },
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'fr', languageTag: 'fr-FR', countryCode: 'FR', isRTL: false }],
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));
