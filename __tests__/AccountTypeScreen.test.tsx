import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AccountTypeScreen from '../src/screens/Auth/AccountTypeScreen';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const themedScreen = <ThemeProvider><AccountTypeScreen /></ThemeProvider>;

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('@components/index', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ScreenContainer: ({ children, ...props }: React.ComponentProps<typeof NativeView>) =>
      ReactModule.createElement(NativeView, { ...props, testID: 'screen-container' }, children),
    Text: ({ children, ...props }: React.ComponentProps<typeof NativeView>) =>
      ReactModule.createElement(NativeView, props, children),
  };
});

jest.mock('@components/Text', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { Text: NativeText } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    __esModule: true,
    default: (props: React.ComponentProps<typeof NativeText>) => ReactModule.createElement(NativeText, props),
  };
});

jest.mock('@assets/svg/logo-mediumPro24.svg', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');
  return { __esModule: true, default: (props: React.ComponentProps<typeof NativeView>) => ReactModule.createElement(NativeView, props) };
});

describe('AccountTypeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockGoBack.mockReset();
  });

  it('routes each account type to the matching registration form', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(themedScreen);
    });
    const root = renderer.root;

    await act(() => root.findByProps({ accessibilityLabel: 'Je suis un client' }).props.onPress());
    expect(mockNavigate).toHaveBeenLastCalledWith('RegisterScreen', { role: 'client' });

    await act(() => root.findByProps({ accessibilityLabel: 'Je suis un professionnel' }).props.onPress());
    expect(mockNavigate).toHaveBeenLastCalledWith('RegisterScreen', { role: 'professional' });
  });

  it('returns to the tutorial when the back action is pressed', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(themedScreen);
    });
    await act(() => renderer.root.findByProps({ accessibilityLabel: 'Retour' }).props.onPress());
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
