import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import ClientForm from '../src/screens/Auth/component/ClientForm';
import { ThemeProvider } from '../src/theme/ThemeProvider';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@components/index', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { View: NativeView, Text: NativeText, Pressable } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    Button: ({ title, ...props }: { title: string }) => ReactModule.createElement(Pressable, props, ReactModule.createElement(NativeText, null, title)),
    Field: () => ReactModule.createElement(NativeView),
    FieldValidators: { required: () => ({}) },
    Text: (props: React.ComponentProps<typeof NativeText>) => ReactModule.createElement(NativeText, props),
    Spinner: () => ReactModule.createElement(NativeView),
  };
});

jest.mock('@services/index', () => ({
  validateClientRegistration: () => [],
  mapApiError: () => [],
  prepareRegistrationPayload: (data: unknown) => data,
}));

jest.mock('@store/api/endpoints/auth', () => ({
  useRegisterClientMutation: () => [jest.fn(() => ({ unwrap: async () => ({}) })), { isLoading: false, error: null, isSuccess: false }],
}));

jest.mock('@store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => false,
}));

jest.mock('@store/slices/authSlice', () => ({
  selectAuthLoading: () => false,
  setError: (value: unknown) => value,
  setLoading: (value: unknown) => value,
}));

jest.mock('react-native-toast-notifications', () => ({ Toast: { show: jest.fn() } }));

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children, ...props }: React.ComponentProps<typeof import('react-native').View>) =>
    require('react').createElement(require('react-native').View, props, children),
}));

describe('ClientForm visual flow', () => {
  it('shows the first step with a clear progress state and continue action', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(<ThemeProvider><ClientForm /></ThemeProvider>);
    });

    expect(renderer.root.findByProps({ testID: 'client-form-step' }).props.children.join('')).toContain('1');
    expect(renderer.root.findByProps({ testID: 'client-form-progress' })).toBeTruthy();
    expect(renderer.root.findByProps({ testID: 'client-form-primary-action' }).findByType(require('react-native').Text).props.children).toBe('ui.button.next');
  });
});
