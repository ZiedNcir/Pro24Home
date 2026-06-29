export const getApiFieldErrors = (error: unknown): Record<string, string> => {
  const anyError = error as any;
  const errors = anyError?.data?.errors ?? anyError?.data?.data?.errors;

  if (!errors || typeof errors !== 'object') {
    return {};
  }

  return Object.entries(errors).reduce<Record<string, string>>((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = String(value[0]);
      return acc;
    }

    acc[key] = String(value);
    return acc;
  }, {});
};

export const getApiMessage = (
  error: unknown,
  fallback: string,
): string => {
  const anyError = error as any;

  return (
    anyError?.data?.formattedMessage ??
    anyError?.data?.message ??
    anyError?.error ??
    fallback
  );
};
