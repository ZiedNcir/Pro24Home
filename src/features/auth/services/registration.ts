// src/services/authService.ts
import type { RegisterClientRequest, RegisterProfessionalRequest } from '@entities/user/model/types';
import i18n from '@utils/i18n';

/**
 * Auth Service - Centralized authentication business logic
 * Handles validation, error mapping, and registration workflows
 */

export interface RegistrationError {
  field?: string;
  message: string;
  type: 'validation' | 'api' | 'network';
}

export const isValidPostalCode = (value?: string): boolean =>
  /^\d{5}$/.test(value?.trim() || '');

/**
 * Validate client registration data
 */
export const validateClientRegistration = (data: Partial<RegisterClientRequest>): RegistrationError[] => {
  const errors: RegistrationError[] = [];

  if (!data.first_name?.trim()) {
    errors.push({ field: 'first_name', message: i18n.t('ui.form.firstName.required'), type: 'validation' });
  }

  if (!data.last_name?.trim()) {
    errors.push({ field: 'last_name', message: i18n.t('ui.form.lastName.required'), type: 'validation' });
  }

  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: i18n.t('ui.form.email.required'), type: 'validation' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: i18n.t('ui.form.email.invalidEmail'), type: 'validation' });
  }

  if (!data.password || data.password.length < 8) {
    errors.push({ 
      field: 'password', 
      message: i18n.t('ui.form.password.minLength', { count: 8 }),
      type: 'validation' 
    });
  }

  if (!data.phone_number?.trim()) {
    errors.push({ field: 'phone_number', message: i18n.t('ui.form.phone.required'), type: 'validation' });
  }

  if (!data.postal_code?.trim()) {
    errors.push({ field: 'postal_code', message: i18n.t('ui.form.postCode.required'), type: 'validation' });
  } else if (!isValidPostalCode(data.postal_code)) {
    errors.push({ field: 'postal_code', message: i18n.t('auth.postalCodeFiveDigits'), type: 'validation' });
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
    errors.push({ field: 'company_name', message: i18n.t('ui.form.companyName.required'), type: 'validation' });
  }

  if (!data.siret_number?.trim()) {
    errors.push({ field: 'siret_number', message: i18n.t('ui.form.siret.required'), type: 'validation' });
  } else if (!/^\d{14}$/.test(data.siret_number)) {
    errors.push({ field: 'siret_number', message: i18n.t('auth.siretFourteenDigits'), type: 'validation' });
  }

  if (selectedServices.length === 0) {
    errors.push({ field: 'services', message: i18n.t('auth.serviceRequired'), type: 'validation' });
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
      message: i18n.t('auth.unexpectedError'),
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
        message: apiError.message || i18n.t('auth.registrationError'),
      type: 'api',
    });
  }

  return errors.length > 0 ? errors : [{
    message: i18n.t('auth.registrationTryAgain'),
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
  if (!onesignalKey.trim()) {
    throw new Error(i18n.t('auth.onesignalKeyRequired'));
  }

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
