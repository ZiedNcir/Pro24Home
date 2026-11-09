const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const unwrapData = <T>(response: unknown): T => {
  if (isRecord(response) && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }

  return response as T;
};

export const unwrapArray = <T>(response: unknown): T[] => {
  const data = unwrapData<unknown>(response);
  return Array.isArray(data) ? (data as T[]) : [];
};
