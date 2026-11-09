import type { AuthResponse } from '../api.types';

export const normalizeAuthResponse = (response: unknown): AuthResponse => {
    let payload = response && typeof response === 'object' ? response as Record<string, unknown> : {};
    for (let depth = 0; depth < 3; depth++) {
        const nested = payload.data;
        if (!nested || typeof nested !== 'object' || Array.isArray(nested)) break;
        payload = { ...payload, ...nested as Record<string, unknown> };
        if ((nested as Record<string, unknown>).data === undefined) break;
    }
    return payload as unknown as AuthResponse;
};
