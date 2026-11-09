// src/utils/api.helpers.ts
import { createFormData } from '@core/api/form-data';

/**
 * Prepares FormData for multipart/form-data requests
 */
export const prepareFormData = <T extends Record<string, unknown>>(
    data: T,
    fileFields: string[] = [],
): FormData => createFormData(data, fileFields);

/**
 * Creates query params from object
 */
export const createQueryParams = (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach(item => queryParams.append(`${key}[]`, String(item)));
            } else {
                queryParams.append(key, String(value));
            }
        }
    });

    return queryParams.toString();
};

/**
 * Handles API errors consistently
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        public data: any,
        message?: string
    ) {
        super(message || `API Error: ${status}`);
        this.name = 'ApiError';
    }

    static fromResponse(error: any): ApiError {
        if (error?.status && error?.data) {
            return new ApiError(error.status, error.data, error.data?.message);
        }
        return new ApiError(0, error, 'Network error');
    }
}

/**
 * Safe parsing of API responses
 */
export const safeParseResponse = <T>(response: any): T => {
    if (!response) {
        throw new ApiError(0, null, 'Empty response');
    }

    if (response.success === false) {
        throw new ApiError(400, response, response.message);
    }

    return response.data || response;
};
