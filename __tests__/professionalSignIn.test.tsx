import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession } from '../src/core/session/session-storage';
import { markProfessionalUploadFinished } from '../src/core/session/professional-upload-state';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';
import { lightColors } from '../src/theme/colors/light';
import { SignIn } from '../src/features/auth/ui/SignIn';

let mockResponse: any;
const mockReset = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
let mockFailure: unknown = null;
let mockRole = 'professional';
const mockToast = jest.fn();
jest.mock('@store/hooks', () => ({ useAppDispatch: () => mockDispatch }));
jest.mock('@react-navigation/native', () => ({
    useRoute: () => ({ params: { role: mockRole } }),
    useNavigation: () => ({ reset: mockReset, navigate: mockNavigate, goBack: jest.fn(), getState: () => ({ routeNames: ['Documents', 'VerifyScreen', 'ProfessionalVerificationPending', 'ProfessionnelHome'] }) }),
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('@theme', () => ({ useTheme: () => ({ theme: { colors: require('../src/theme/colors/light').lightColors }, themeMode: 'light' }) }));
jest.mock('@shared/ui', () => ({ Text: require('react-native').Text, Spinner: () => null }));
jest.mock('@shared/ui/button/Button', () => ({ Button: (props: any) => require('react').createElement(require('react-native').Pressable, props) }));
jest.mock('@shared/ui/form/HookFormField', () => ({ __esModule: true, default: () => null }));
jest.mock('@shared/ui/layout/ScreenContainer', () => ({ __esModule: true, default: ({ children }: any) => require('react').createElement(require('react-native').View, null, children) }));
jest.mock('@assets/svg/logo-mediumPro24.svg', () => ({ __esModule: true, default: () => null }));
jest.mock('@core/notifications/toast', () => ({ Toast: { show: (...args: unknown[]) => mockToast(...args) } }));
jest.mock('@features/auth/api/auth.api', () => ({ useLoginMutation: () => [() => ({ unwrap: async () => { if (mockFailure) throw mockFailure; return mockResponse; } }), { isLoading: false }] }));
jest.mock('react-hook-form', () => ({ useForm: () => ({ control: {}, handleSubmit: (callback: any) => () => callback({ email: 'test@example.test', password: 'test-password' }) }) }));

beforeEach(async () => { await AsyncStorage.clear(); mockReset.mockClear(); mockNavigate.mockClear(); mockToast.mockClear(); mockDispatch.mockClear(); mockFailure = null; mockRole = 'professional'; });
const submit = async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><SignIn /></ThemeProvider>); });
    await act(async () => { await tree.root.findByProps({ title: 'ui.button.signIn' }).props.onPress(); });
    await act(async () => tree.unmount());
};
test('does not open an authenticated screen when a fulfilled login has no access token', async () => {
    mockResponse = { is_verified: true, user: { id: 1, type: 'professional', documents: [] } };
    await submit();
    expect(mockReset).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith('auth.loginFailed', expect.objectContaining({ type: 'danger' }));
});
test('does not enter document upload without a server session even when the professional is unverified', async () => {
    mockResponse = { is_verified: false, user: { id: 1, type: 'professional', email: 'test@example.test', phone_number: '+33000000000' } };
    await submit();
    expect(mockReset).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith('auth.loginFailed', expect.objectContaining({ type: 'danger' }));
});
test('opens document upload for a verified, authenticated professional with missing documents', async () => {
    mockResponse = { access_token: 'test-session', is_verified: true, user: { id: 1, type: 'professional', documents: [] } };
    await submit();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Documents' }] });
});

test('opens documents for a newly registered inactive professional with a server session', async () => {
    mockResponse = { access_token: 'test-session', is_active: false, is_verified: false, user: { id: 42, email: 'pro@example.test', type: 'professional', documents: [] } };
    await submit();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Documents' }] });
});
test('opens pending after a later sign-in when completion survived logout and documents are omitted', async () => {
    await markProfessionalUploadFinished({ id: 42, email: 'pro@example.test' });
    await clearSession();
    mockResponse = { access_token: 'test-session', is_active: false, is_verified: false, user: { id: 42, email: 'pro@example.test', type: 'professional' } };
    await submit();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'ProfessionalVerificationPending' }] });
});
test('uses the provided server session when an inactive response is returned as an API error', async () => {
    await markProfessionalUploadFinished({ id: 42, email: 'pro@example.test' });
    mockFailure = { status: 403, data: { is_active: false, access_token: 'test-session', user: { id: 42, email: 'pro@example.test', type: 'professional' } } };
    await submit();
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setCredentials' }));
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'ProfessionalVerificationPending' }] });
});

test('does not bypass professional credentials through the default client sign-in error path', async () => {
    mockRole = 'client';
    mockFailure = { status: 403, data: { is_active: false, user: { id: 42, type: 'professional', documents: [] } } };
    await submit();
    expect(mockReset).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
});
test('keeps sign-in blocked for the real inactive-account response without user or token', async () => {
    mockFailure = { status: 401, data: { exist: 1, is_verified: 1, is_active: 0, message: "Votre compte n'est pas actif." } };
    await submit();
    expect(mockReset).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith("Votre compte n'est pas actif.", expect.objectContaining({ type: 'danger' }));
});


test('opens account type selection from the separate create-account button', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><SignIn /></ThemeProvider>); });
    await act(async () => tree.root.findByProps({ title: 'auth.signInDesign.createAccount' }).props.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('AccountType');
    await act(async () => tree.unmount());
});
test('opens password recovery from the sign-in screen', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><SignIn /></ThemeProvider>); });
    await act(async () => tree.root.findByProps({ accessibilityLabel: 'terms.forgetPassword' }).props.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('ForgetPassword');
    await act(async () => tree.unmount());
});
