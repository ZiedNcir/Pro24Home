/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigation/AppNavigator', () => () => null);
jest.mock('../src/utils/permissions', () => ({ requestPermissions: jest.fn() }));
jest.mock('../src/utils/i18n', () => ({}));
jest.mock('react-native-toast-notifications', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import App from '../App';

test('mounts the application providers and navigator', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree!.toJSON()).not.toBeNull();
});
