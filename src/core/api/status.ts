export const acceptApiResponse = (response: { status: number }, body: unknown): boolean => (
    response.status >= 200 && response.status < 300
    && !(body && typeof body === 'object' && 'success' in body && body.success === false)
);
