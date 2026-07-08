export interface ProfessionalRegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  city: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  siret_number: string;
  activity_domain: string;
  services: number[];
  termsAccepted: boolean;
}

export const PROFESSIONAL_FORM_DEFAULT_VALUES: ProfessionalRegisterFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  address: '',
  postal_code: '',
  city: '',
  password: '',
  password_confirmation: '',
  company_name: '',
  siret_number: '',
  activity_domain: '',
  services: [],
  termsAccepted: false,
};
