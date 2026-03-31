// src/services/authService.ts
import { RegisterClientRequest, RegisterProfessionalRequest } from '@store/api/api.types';

/**
 * Auth Service - Centralized authentication business logic
 * Handles validation, error mapping, and registration workflows
 */

export interface RegistrationError {
  field?: string;
  message: string;
  type: 'validation' | 'api' | 'network';
}

/**
 * Validate client registration data
 */
export const validateClientRegistration = (data: Partial<RegisterClientRequest>): RegistrationError[] => {
  const errors: RegistrationError[] = [];

  if (!data.first_name?.trim()) {
    errors.push({ field: 'first_name', message: 'First name is required', type: 'validation' });
  }

  if (!data.last_name?.trim()) {
    errors.push({ field: 'last_name', message: 'Last name is required', type: 'validation' });
  }

  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required', type: 'validation' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format', type: 'validation' });
  }

  if (!data.password || data.password.length < 8) {
    errors.push({ 
      field: 'password', 
      message: 'Password must be at least 8 characters', 
      type: 'validation' 
    });
  }

  if (!data.phone_number?.trim()) {
    errors.push({ field: 'phone_number', message: 'Phone number is required', type: 'validation' });
  }

  if (!data.postal_code?.trim()) {
    errors.push({ field: 'postal_code', message: 'Postal code is required', type: 'validation' });
  } else if (!/^\d{5}$/.test(data.postal_code)) {
    errors.push({ field: 'postal_code', message: 'Postal code must be 5 digits', type: 'validation' });
  }

  return errors;
};

/**
 * Validate professional registration data
 */
export const validateProfessionalRegistration = (
  data: Partial<RegisterProfessionalRequest>,
  selectedServices: number[]
): RegistrationError[] => {
  const errors: RegistrationError[] = [];

  // Include client validation
  errors.push(...validateClientRegistration(data));

  if (!data.company_name?.trim()) {
    errors.push({ field: 'company_name', message: 'Company name is required', type: 'validation' });
  }

  if (!data.siret_number?.trim()) {
    errors.push({ field: 'siret_number', message: 'SIRET is required', type: 'validation' });
  } else if (!/^\d{14}$/.test(data.siret_number)) {
    errors.push({ field: 'siret_number', message: 'SIRET must be 14 digits', type: 'validation' });
  }

  if (selectedServices.length === 0) {
    errors.push({ field: 'services', message: 'At least one service is required', type: 'validation' });
  }

  return errors;
};

/**
 * Map API error response to structured errors
 */
export const mapApiError = (apiError: any): RegistrationError[] => {
  const errors: RegistrationError[] = [];

  if (!apiError) {
    return [{
      message: 'An unexpected error occurred',
      type: 'network',
    }];
  }

  // Handle RTK Query error format
  if ('data' in apiError && apiError.data) {
    const errorData = apiError.data as any;

    if (errorData.errors && typeof errorData.errors === 'object') {
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        const msgArray = Array.isArray(messages) ? messages : [messages];
        msgArray.forEach((msg: any) => {
          errors.push({
            field,
            message: String(msg),
            type: 'api',
          });
        });
      });
    } else if (typeof errorData.errors === 'string') {
      errors.push({
        message: errorData.errors,
        type: 'api',
      });
    }
  } else if ('message' in apiError) {
    errors.push({
      message: apiError.message || 'Registration failed',
      type: 'api',
    });
  }

  return errors.length > 0 ? errors : [{
    message: 'Registration failed. Please try again.',
    type: 'api',
  }];
};

/**
 * Prepare registration payload with defaults
 */
export const prepareRegistrationPayload = (
  data: any,
  role: 'client' | 'professional',
  onesignalKey: string,
  selectedServices?: number[]
) => {
  const basePayload = {
    ...data,
    onesignal_key: onesignalKey,
    lang: 'fr',
  };

  if (role === 'professional' && selectedServices) {
    return {
      ...basePayload,
      services: selectedServices,
    } as RegisterProfessionalRequest;
  }

  return basePayload as RegisterClientRequest;
};
