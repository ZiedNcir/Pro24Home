import type { ApiResponse } from '../../../store/api/api.types';
import type { Service } from './types';

export const normalizeServicesResponse = (response: unknown): ApiResponse<Service[]> => {
    if (Array.isArray(response)) {
        return {
            success: true,
            data: response as Service[],
            message: 'Services fetched successfully',
        };
    }

    if (response && typeof response === 'object') {
        const payload = response as { success?: boolean; data?: unknown; services?: unknown; message?: string; meta?: ApiResponse['meta'] };
        const services = Array.isArray(payload.services) ? payload.services : payload.data;

        if (Array.isArray(services)) {
            return {
                success: payload.success !== false,
                data: services as Service[],
                message: payload.message || 'Services fetched successfully',
                ...(payload.meta ? { meta: payload.meta } : {}),
            };
        }
    }

    return {
        success: false,
        data: [],
        message: 'Invalid response format',
    };
};
