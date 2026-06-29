import type {
  RegisterClientRequest,
  RegisterProfessionalRequest,
} from '../../store/api/api.types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const required = (
  errors: Record<string, string>,
  field: string,
  value: unknown,
  message: string,
) => {
  if (value === undefined || value === null || value === '') {
    errors[field] = message;
  }
};

export const validateClientRegister = (
  payload: Partial<RegisterClientRequest>,
): ValidationResult => {
  const errors: Record<string, string> = {};

  required(errors, 'first_name', payload.first_name, 'Le prénom est obligatoire.');
  required(errors, 'last_name', payload.last_name, 'Le nom est obligatoire.');
  required(errors, 'email', payload.email, 'L’e-mail est obligatoire.');
  required(errors, 'password', payload.password, 'Le mot de passe est obligatoire.');
  required(errors, 'phone_number', payload.phone_number, 'Le téléphone est obligatoire.');
  required(errors, 'address', payload.address, 'L’adresse est obligatoire.');
  required(errors, 'postal_code', payload.postal_code, 'Le code postal est obligatoire.');

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateProfessionalRegister = (
  payload: Partial<RegisterProfessionalRequest>,
): ValidationResult => {
  const result = validateClientRegister(payload);
  const errors = { ...result.errors };

  required(errors, 'company_name', payload.company_name, 'Le nom de société est obligatoire.');
  required(errors, 'siret_number', payload.siret_number, 'Le SIRET est obligatoire.');

  if (!payload.services?.length) {
    errors.services = 'Au moins un service est obligatoire.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
