import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';
import { lightColors } from '../src/theme/colors/light';
import PendingScreen from '../src/roles/professional/documents/screens/ProfessionalVerificationPendingScreen';

let mockUser: any;
let mockProfileError: any;
const mockReset = jest.fn();
const mockT = (key: string) => key;
jest.mock('@store/hooks', () => ({ useAppDispatch: () => jest.fn(), useAppSelector: () => mockUser }));
jest.mock('@store/api/baseApi', () => ({ api: { util: { resetApiState: () => ({ type: 'reset' }) } } }));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ reset: mockReset }) }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: mockT }) }));
jest.mock('@theme', () => ({ useTheme: () => ({ theme: { colors: require('../src/theme/colors/light').lightColors }, themeMode: 'light' }) }));
jest.mock('@shared/ui/typography/Text', () => ({ __esModule: true, default: require('react-native').Text }));
jest.mock('@shared/ui/button/Button', () => ({ Button: (props: any) => require('react').createElement(require('react-native').Pressable, props) }));
jest.mock('@shared/ui/layout/ScreenContainer', () => ({ __esModule: true, default: ({ children }: any) => require('react').createElement(require('react-native').View, null, children) }));
jest.mock('@shared/ui/icon', () => ({ SvgIcon: () => null }));
jest.mock('@assets/svg/logo-mediumPro24.svg', () => ({ __esModule: true, default: () => null }));
jest.mock('@entities/user/api/user.api', () => ({ useGetProfileQuery: () => ({ data: { success: true, data: mockUser }, isFetching: false, isError: !!mockProfileError, error: mockProfileError, refetch: jest.fn() }) }));
jest.mock('@features/auth/api/auth.api', () => ({ useLogoutMutation: () => [jest.fn(), { isLoading: false }] }));
jest.mock('@core/session/professional-upload-state', () => ({ hasFinishedProfessionalUpload: async () => { throw new Error('Phone storage unavailable'); } }));
beforeEach(() => { mockReset.mockClear(); mockProfileError = null; mockUser = { id: 42, type: 'professional', email: 'pro@example.test', is_active: 0, documents: [] }; });
const open = async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><PendingScreen /></ThemeProvider>); });
    await act(async () => tree.unmount());
};
test('follows server activation even if phone metadata cannot be read', async () => {
    mockUser.is_active = 1;
    await open();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'ProfessionnelHome' }] });
});
test('follows a server rejection even if phone metadata cannot be read', async () => {
    mockUser.documents = [{ id: 1, name: 'rib', status: 'rejected', uploaded_at: '' }];
    await open();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Documents' }] });
});
test('stays pending when an inactive server response omits document metadata', async () => {
    await open();
    expect(mockReset).not.toHaveBeenCalled();
});
test('shows the actual review status of documents returned by the account', async () => {
    mockUser.documents = [
        { id: 1, name: 'kbis', status: 'pending', uploaded_at: '' },
        { id: 2, name: 'rib', status: 'approved', uploaded_at: '' },
    ];
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><PendingScreen /></ThemeProvider>); });
    const text = tree.root.findAllByType(require('react-native').Text).map(node => node.props.children);
    expect(text).toEqual(expect.arrayContaining([
        'professional.documents.kbis', 'professional.verificationPending.status.pending',
        'professional.documents.rib', 'professional.verificationPending.status.approved',
    ]));
    expect(mockReset).not.toHaveBeenCalled();
    await act(async () => tree.unmount());
});
test('does not claim a review status or submission progress when the server omits a document status', async () => {
    mockUser.documents = [{ id: 1, name: 'kbis', uploaded_at: '' }];
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><PendingScreen /></ThemeProvider>); });
    const text = tree.root.findAllByType(require('react-native').Text).map(node => node.props.children);
    expect(text).toContain('professional.verificationPending.status.unknown');
    expect(text).not.toContain('professional.verificationPending.status.pending');
    expect(tree.root.findAllByProps({ accessibilityRole: 'progressbar' })).toHaveLength(0);
    await act(async () => tree.unmount());
});
test('offers sign-in to refresh the account when the profile endpoint is unavailable', async () => {
    mockProfileError = { status: 404 };
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><PendingScreen /></ThemeProvider>); });
    const action = tree.root.findByProps({ title: 'professional.verificationPending.signInToCheck' });
    await act(async () => action.props.onPress());
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
    await act(async () => tree.unmount());
});
