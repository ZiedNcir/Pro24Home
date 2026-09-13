export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string[]>;
  isNetworkError: boolean;
  raw: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toFieldErrors = (value: unknown): Record<string, string[]> => {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([field, messages]) => [
      field,
      (Array.isArray(messages) ? messages : [messages]).map(String),
    ]),
  );
};

export const toApiError = (error: unknown): ApiError => {
  const record = isRecord(error) ? error : {};
  const data = isRecord(record.data) ? record.data : {};
  const status = typeof record.status === 'number' ? record.status : 0;
  const message =
    (typeof data.message === 'string' && data.message) ||
    (typeof record.message === 'string' && record.message) ||
    (typeof record.error === 'string' && record.error) ||
    'Erreur réseau';

  return {
    status,
    message,
    fieldErrors: toFieldErrors(data.errors),
    isNetworkError: status === 0,
    raw: error,
  };
};
