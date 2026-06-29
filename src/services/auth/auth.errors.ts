export const getApiErrorMessage = (error: unknown): string => {
  const anyError = error as any;

  return (
    anyError?.data?.formattedMessage ??
    anyError?.data?.message ??
    anyError?.error ??
    'Une erreur est survenue.'
  );
};
