import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ThemeProvider } from 'styled-components/native';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors } from '../src/theme/colors/light';
import { hasFinishedProfessionalUpload } from '../src/core/session/professional-upload-state';
import DocumentsScreen from '../src/roles/professional/documents/screens/DocumentsScreen';

const mockT = (key: string) => key;
const mockReset = jest.fn();
const mockUpload = jest.fn(() => ({ unwrap: async () => ({ success: true }) }));
let mockUser: any;
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: mockT }) }));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ reset: mockReset, canGoBack: () => false, goBack: jest.fn() }) }));
jest.mock('react-redux', () => ({ useSelector: () => mockUser }));
jest.mock('@theme', () => ({ useTheme: () => ({ theme: { colors: require('../src/theme/colors/light').lightColors } }) }));
jest.mock('@shared/ui/typography/Text', () => ({ __esModule: true, default: require('react-native').Text }));
jest.mock('@shared/ui/layout/ScreenContainer', () => ({ __esModule: true, default: ({ children }: any) => require('react').createElement(require('react-native').View, null, children) }));
jest.mock('@shared/ui/icon', () => ({ SvgIcon: () => null }));
jest.mock('@assets/svg/logo-mediumPro24.svg', () => ({ __esModule: true, default: () => null }));
jest.mock('@core/notifications/toast', () => ({ Toast: { show: jest.fn() } }));
jest.mock('@entities/user/api/user.api', () => ({ useGetProfileQuery: () => ({ data: { success: true, data: mockUser }, isFetching: false, isError: false, refetch: () => ({ unwrap: async () => ({ success: true, data: mockUser }) }) }) }));
jest.mock('@roles/professional/documents/api/documents.api', () => ({ useUploadDocumentMutation: () => [mockUpload, { isLoading: false }] }));
jest.mock('react-native-document-picker', () => ({ __esModule: true, default: { pickSingle: async () => ({ uri: 'file:///document.pdf', name: 'document.pdf', type: 'application/pdf', size: 100 }), isCancel: () => false }, types: { images: 'images', pdf: 'pdf' } }));
jest.mock('react-native-image-picker', () => ({ launchCamera: jest.fn() }));
beforeEach(async () => {
    await AsyncStorage.clear(); mockReset.mockClear(); mockUpload.mockClear();
    mockUser = { id: 42, email: 'pro@example.test', type: 'professional', is_active: 0, documents: [] };
});
const upload = async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><DocumentsScreen /></ThemeProvider>); });
    await act(async () => { await tree.root.findByProps({ accessibilityLabel: 'professional.documents.chooseFile' }).props.onPress(); });
    await act(async () => tree.unmount());
};
test('records the last successful document and immediately opens pending without requiring profile metadata', async () => {
    mockUser.documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis'].map((name, id) => ({ id, name, type: 'pdf', url: '', uploaded_at: '', status: 'pending' }));
    await upload();
    expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining({ name: 'rib' }));
    expect(await hasFinishedProfessionalUpload(mockUser)).toBe(true);
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'ProfessionalVerificationPending' }] });
});
test('does not mark completion after only one successful document', async () => {
    await upload();
    expect(await hasFinishedProfessionalUpload(mockUser)).toBe(false);
    expect(mockReset).not.toHaveBeenCalled();
});

test('does not finish the dossier or navigate when the server rejects an upload', async () => {
    mockUser.documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis'].map((name, id) => ({ id, name, type: 'pdf', url: '', uploaded_at: '', status: 'pending' }));
    mockUpload.mockImplementationOnce(() => ({ unwrap: async () => { throw new Error('Upload failed'); } }));
    await upload();
    expect(await hasFinishedProfessionalUpload(mockUser)).toBe(false);
    expect(mockReset).not.toHaveBeenCalled();
});

test('uploads the document selected from the next documents list', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><DocumentsScreen /></ThemeProvider>); });
    await act(async () => { tree.root.findByProps({ accessibilityLabel: 'professional.documents.kbis' }).props.onPress(); });
    await act(async () => { await tree.root.findByProps({ accessibilityLabel: 'professional.documents.chooseFile' }).props.onPress(); });
    expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining({ name: 'kbis' }));
    expect(await hasFinishedProfessionalUpload(mockUser)).toBe(false);
    await act(async () => tree.unmount());
});


test('sends a camera photo as the current document', async () => {
    (launchCamera as jest.Mock).mockResolvedValueOnce({ assets: [{ uri: 'file:///camera.jpg', type: 'image/jpeg', fileName: 'camera.jpg', fileSize: 100 }] });
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => { tree = ReactTestRenderer.create(<ThemeProvider theme={{ colors: lightColors }}><DocumentsScreen /></ThemeProvider>); });
    await act(async () => { await tree.root.findByProps({ accessibilityLabel: 'professional.documents.takePhoto' }).props.onPress(); });
    expect(launchCamera).toHaveBeenCalledWith(expect.objectContaining({ mediaType: 'photo', cameraType: 'back' }));
    expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining({ name: 'identity_front', type: 'img', file: expect.objectContaining({ uri: 'file:///camera.jpg' }) }));
    await act(async () => tree.unmount());
});
