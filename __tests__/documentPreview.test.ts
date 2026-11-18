import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { previewDocument } from '../src/roles/professional/documents/model/document-preview';
jest.mock('react-native-fs', () => ({ CachesDirectoryPath: '/cache', writeFile: jest.fn(async () => undefined), unlink: jest.fn(async () => undefined) }));
jest.mock('react-native-file-viewer', () => ({ open: jest.fn(async () => undefined) }));
const original = global.FileReader;
beforeEach(() => {
    jest.clearAllMocks();
    global.FileReader = class {
        result = 'data:application/pdf;base64,cGRm';
        onload: any;
        readAsDataURL() { this.onload(); }
    } as any;
});
afterEach(() => { global.FileReader = original; });
test('opens a local PDF and cleans it up when the native viewer closes', async () => {
    await previewDocument({ type: 'application/pdf', size: 10 } as Blob, 'rib', () => true);
    expect(RNFS.writeFile).toHaveBeenCalledWith(expect.stringMatching(/^\/cache\/pro24-rib-.*\.pdf$/), 'cGRm', 'base64');
    const [path, options] = (FileViewer.open as jest.Mock).mock.calls[0];
    await options.onDismiss();
    expect(RNFS.unlink).toHaveBeenCalledWith(path);
});
test('refuses server HTML errors and does not write or open them', async () => {
    await expect(previewDocument({ type: 'text/html', size: 10 } as Blob, 'rib', () => true)).rejects.toThrow();
    expect(FileViewer.open).not.toHaveBeenCalled();
    expect(RNFS.writeFile).not.toHaveBeenCalled();
});
test('does not open a private document after the account changes', async () => {
    await previewDocument({ type: 'image/png', size: 10 } as Blob, 'rib', () => false);
    expect(RNFS.writeFile).not.toHaveBeenCalled();
});
