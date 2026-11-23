import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import type { DocumentType } from '@entities/user/model';

export async function previewDocument(
  blob: Blob,
  name: DocumentType,
  isCurrentSession: () => boolean,
) {
  const mime = blob.type.split(';')[0]?.toLowerCase() || '';
  const extensions: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
  };
  const extension = extensions[mime];
  if (!extension || !blob.size || blob.size > 20 * 1024 * 1024)
    throw new Error('Unsupported document');
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(',')[1];
      if (base64) resolve(base64);
      else reject(new Error('Empty document'));
    };
    reader.onerror = () => reject(new Error('Unable to read document'));
    reader.readAsDataURL(blob);
  });
  if (!isCurrentSession()) return;
  const path = `${
    RNFS.CachesDirectoryPath
  }/pro24-${name}-${Date.now()}.${extension}`;
  const remove = () => RNFS.unlink(path).catch(() => undefined);
  try {
    await RNFS.writeFile(path, content, 'base64');
    if (!isCurrentSession()) {
      await remove();
      return;
    }
    await FileViewer.open(path, {
      showOpenWithDialog: true,
      onDismiss: () => {
        void remove();
      },
    });
  } catch (error) {
    await remove();
    throw error;
  }
}
