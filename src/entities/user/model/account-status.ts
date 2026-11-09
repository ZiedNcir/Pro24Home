export const isUnverifiedAccount = (response: unknown): boolean => {
    if (!response || typeof response !== 'object') return false;
    const root = response as Record<string, unknown>;
    const payload = root.data && typeof root.data === 'object' ? root.data as Record<string, unknown> : root;
    const user = payload.user && typeof payload.user === 'object' ? payload.user as Record<string, unknown> : undefined;
    const verified = payload.is_verified ?? root.is_verified ?? user?.is_verified;
    return verified === false || verified === 0 || verified === '0';
};
