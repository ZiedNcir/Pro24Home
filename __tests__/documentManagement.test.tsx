import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import PhotoSourceModal from '../src/shared/ui/image/PhotoSourceModal';
import Screen from '../src/roles/professional/documents/screens/DocumentManagementScreen';
import View from '../src/roles/professional/documents/ui/DocumentManagementView';
import { PROFESSIONAL_SETTINGS_DOCUMENT } from '../src/navigation/professionalNavigation';

let mockUser: any;
const mockDispatch = jest.fn();
const mockReset = jest.fn();
const mockUpload = jest.fn();
const mockDownload = jest.fn();
const mockPreview = jest.fn();
const mockPick = jest.fn();
const mockT = (key: string) => key;
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: mockT }) }));
jest.mock('@store/hooks', () => ({ useAppSelector: () => mockUser, useAppDispatch: () => mockDispatch }));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ reset: mockReset }) }));
jest.mock('@shared/ui/layout/ScreenContainer', () => ({ __esModule: true, default: ({ children }: any) => children }));
jest.mock('@shared/ui/navigation/InterventionHeader', () => () => null);
jest.mock('../src/shared/ui/image/PhotoSourceModal', () => jest.fn(() => null));
jest.mock('../src/roles/professional/documents/ui/DocumentManagementView', () => jest.fn(() => null));
jest.mock('../src/roles/professional/documents/model/document-preview', () => ({ previewDocument: (...args: any[]) => mockPreview(...args) }));
jest.mock('../src/roles/professional/documents/api/documents.api', () => ({ useUploadDocumentMutation: () => [mockUpload], useLazyDownloadDocumentQuery: () => [mockDownload] }));
jest.mock('react-native-document-picker', () => ({ __esModule: true, default: { pickSingle: (...args: any[]) => mockPick(...args), isCancel: () => false }, types: { images: 'images', pdf: 'pdf' } }));
jest.mock('react-native-image-picker', () => ({ launchCamera: jest.fn() }));
jest.mock('@core/notifications/toast', () => ({ Toast: { show: jest.fn() } }));
let tree: Renderer.ReactTestRenderer;
beforeEach(async () => {
    jest.clearAllMocks();
    mockUser = { id: 1, type: 'professional', documents: [{ name: 'rib', status: 'approved' }, { name: 'kbis', status: 'approved' }] };
    mockPick.mockResolvedValue({ uri: 'file:///new.pdf', type: 'application/pdf', name: 'new.pdf', size: 20 });
    mockUpload.mockReturnValue({ unwrap: async () => ({ success: true }) });
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
        const action = buttons?.find(b => b.text === 'professional.documentManagement.choose' || b.text === 'professional.documentManagement.send');
        action?.onPress?.();
    });
    await act(async () => { tree = Renderer.create(<Screen />); });
});
afterEach(async () => { await act(async () => tree.unmount()); jest.restoreAllMocks(); });
test('settings uses the management route independently of onboarding', () => {
    expect(PROFESSIONAL_SETTINGS_DOCUMENT.route).toBe('ProfessionalDocumentsManagement');
});
test('replaces only the chosen file and stays in settings without inventing approval', async () => {
    await act(async () => { tree.root.findByType(View).props.onReplace('rib'); });
    await act(async () => { tree.root.findByType(PhotoSourceModal).props.onChooseFile(); });
    expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining({ name: 'rib', type: 'pdf' }));
    const documents = mockDispatch.mock.calls[0][0].payload.documents;
    expect(documents.find((d: any) => d.name === 'kbis').status).toBe('approved');
    expect(documents.filter((d: any) => d.name === 'rib')).toHaveLength(1);
    expect(documents.find((d: any) => d.name === 'rib').status).toBeUndefined();
    expect(mockReset).not.toHaveBeenCalled();
});
test('preserves the previous document if upload fails', async () => {
    mockUpload.mockReturnValue({ unwrap: async () => { throw new Error('offline'); } });
    await act(async () => { tree.root.findByType(View).props.onReplace('rib'); });
    await act(async () => { tree.root.findByType(PhotoSourceModal).props.onChooseFile(); });
    expect(mockDispatch).not.toHaveBeenCalled();
});
test('rejects files over the size limit before uploading', async () => {
    mockPick.mockResolvedValue({ uri: 'file:///huge.pdf', type: 'application/pdf', size: 6 * 1024 * 1024 });
    await act(async () => { tree.root.findByType(View).props.onReplace('rib'); });
    await act(async () => { tree.root.findByType(PhotoSourceModal).props.onChooseFile(); });
    expect(mockUpload).not.toHaveBeenCalled();
});
test('does not update a different session after a pending upload completes', async () => {
    let resolve!: (result: any) => void;
    mockUpload.mockReturnValue({ unwrap: () => new Promise(r => { resolve = r; }) });
    await act(async () => { tree.root.findByType(View).props.onReplace('rib'); });
    await act(async () => { tree.root.findByType(PhotoSourceModal).props.onChooseFile(); });
    mockUser = { id: 2, documents: [] };
    await act(async () => { tree.update(<Screen />); });
    await act(async () => resolve({ success: true }));
    expect(mockDispatch).not.toHaveBeenCalled();
});
test('downloads selected document with the authenticated endpoint before viewing', async () => {
    const blob = { type: 'application/pdf' };
    const unsubscribe = jest.fn();
    mockDownload.mockReturnValue({ unwrap: async () => blob, unsubscribe });
    await act(async () => { await tree.root.findByType(View).props.onView(mockUser.documents[0]); });
    expect(mockDownload).toHaveBeenCalledWith('rib', false);
    expect(mockPreview).toHaveBeenCalledWith(blob, 'rib', expect.any(Function));
    expect(unsubscribe).toHaveBeenCalled();
});
