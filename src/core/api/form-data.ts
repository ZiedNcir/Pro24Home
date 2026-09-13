import { Platform } from 'react-native';

type FileValue = {
  uri?: string;
  type?: string;
  name?: string;
};

export const createFormData = (
  data: Record<string, unknown>,
  fileFields: readonly string[] = [],
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== null && item !== undefined) formData.append(`${key}[]`, String(item));
      });
      return;
    }

    if (fileFields.includes(key) && typeof value === 'object') {
      const file = value as FileValue;
      if (file.uri) {
        formData.append(key, {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || `photo_${Date.now()}.jpg`,
        } as never);
      }
      return;
    }

    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }

    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  });

  return formData;
};
