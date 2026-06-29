export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type LoginField = 'email' | 'password';

export type RegisterField =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'address'
  | 'postalCode'
  | 'termsAccepted';

export type OtpField = 'code';

const phoneRegex = /^(\+33|0|\+216)?[0-9\s]{8,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  postalCode: string;
  termsAccepted: boolean;
}

export interface OtpFormValues {
  code: string;
}

export const validateLoginForm = (
  values: LoginFormValues,
  messages: {
    required: string;
    invalidEmail: string;
    passwordTooShort: string;
  },
): FieldErrors<LoginField> => {
  const errors: FieldErrors<LoginField> = {};

  if (values.email.trim() && !emailRegex.test(values.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  if (!values.password.trim()) {
    errors.password = messages.required;
  } else if (values.password.length < 6) {
    errors.password = messages.passwordTooShort;
  }

  return errors;
};

export const validateRegisterForm = (
  values: RegisterFormValues,
  messages: {
    required: string;
    invalidPhone: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    termsRequired: string;
  },
): FieldErrors<RegisterField> => {
  const errors: FieldErrors<RegisterField> = {};

  if (!values.firstName.trim()) errors.firstName = messages.required;
  if (!values.lastName.trim()) errors.lastName = messages.required;

  if (!values.phone.trim()) {
    errors.phone = messages.required;
  } else if (!phoneRegex.test(values.phone.trim())) {
    errors.phone = messages.invalidPhone;
  }

  if (values.email.trim() && !emailRegex.test(values.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  if (!values.password.trim()) {
    errors.password = messages.required;
  } else if (values.password.length < 6) {
    errors.password = messages.passwordTooShort;
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = messages.required;
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = messages.passwordsDoNotMatch;
  }

  if (!values.address.trim()) errors.address = messages.required;
  if (!values.postalCode.trim()) errors.postalCode = messages.required;
  if (!values.termsAccepted) errors.termsAccepted = messages.termsRequired;

  return errors;
};

export const validateOtpForm = (
  values: OtpFormValues,
  length: number,
  messages: {
    required: string;
    invalidOtp: string;
  },
): FieldErrors<OtpField> => {
  const errors: FieldErrors<OtpField> = {};

  if (!values.code.trim()) {
    errors.code = messages.required;
  } else if (values.code.length !== length) {
    errors.code = messages.invalidOtp;
  }

  return errors;
};

export const hasErrors = (errors: Record<string, unknown>) =>
  Object.keys(errors).length > 0;
