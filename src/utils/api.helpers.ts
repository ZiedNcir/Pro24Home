// src/utils/api.helpers.ts
import { Platform } from 'react-native';

/**
 * Prepares FormData for multipart/form-data requests
 */
export const prepareFormData = <T extends Record<string, any>>(
    data: T,
    fileFields: string[] = []
): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return;
        }

        // Handle arrays (like services[])
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item !== null && item !== undefined) {
                    formData.append(`${key}[]`, String(item));
                }
            });
        }
        // Handle files
        else if (fileFields.includes(key) && value) {
            // For React Native, file object should have uri, type, name
            if (value.uri) {
                const file = {
                    uri: Platform.OS === 'ios' ? value.uri.replace('file://', '') : value.uri,
                    type: value.type || 'image/jpeg',
                    name: value.name || `photo_${Date.now()}.jpg`,
                };
                formData.append(key, file as any);
            }
        }
        // Handle boolean values
        else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
        }
        // Handle numbers
        else if (typeof value === 'number') {
            formData.append(key, String(value));
        }
        // Handle objects (stringify)
        else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        }
        // Handle strings
        else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

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