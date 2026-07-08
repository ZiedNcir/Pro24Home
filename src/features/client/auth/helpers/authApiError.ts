import { t } from '../../../../translations/i18n';

export const getAuthApiMessage = (
  error: unknown,
  fallback: string,
): string => {
  const anyError = error as any;

  if (typeof error === 'string') {
    return t(error) !== error ? t(error) : error;
  }

  if (anyError?.data?.message) {
    const message = String(anyError.data.message);
    return t(message) !== message ? t(message) : message;
  }

  const apiErrors = anyError?.data?.errors;
  if (apiErrors && typeof apiErrors === 'object') {
    const first = Object.values(apiErrors)[0];

    if (Array.isArray(first) && first[0]) {
      const message = String(first[0]);
      return t(message) !== message ? t(message) : message;
    }

    if (typeof first === 'string') {
      return t(first) !== first ? t(first) : first;
    }
  }

  if (anyError?.message) {
    const message = String(anyError.message);
    return t(message) !== message ? t(message) : message;
  }

  if (anyError && typeof anyError === 'object') {
    const firstError = Object.values(anyError)[0];

    if (typeof firstError === 'string') {
      return t(firstError) !== firstError ? t(firstError) : firstError;
    }
  }

  return fallback;
};
