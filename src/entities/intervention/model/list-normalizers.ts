import type { ApiResponse } from '../../../store/api/api.types';
import type { Intervention } from './types';

export const normalizeInterventionsResponse = (response: unknown): ApiResponse<Intervention[]> => {
    if (Array.isArray(response)) {
        return {
            success: true,
            data: response as Intervention[],
            message: 'Interventions fetched successfully',
        };
    }

    if (response && typeof response === 'object') {
        const payload = response as { success?: boolean; data?: unknown; interventions?: unknown; message?: string };
        const interventions = Array.isArray(payload.interventions) ? payload.interventions : payload.data;

        if (Array.isArray(interventions)) {
            return {
                success: payload.success !== false,
                data: interventions as Intervention[],
                message: payload.message || 'Interventions fetched successfully',
            };
        }
    }

    return { success: false, data: [], message: 'Invalid response format' };
};
