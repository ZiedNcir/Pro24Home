export type RegistrationStep = 'personal' | 'security' | 'company' | 'services';

export const createClientRegistrationSteps = (): RegistrationStep[] => [
  'personal',
  'security',
];

export const createProfessionalRegistrationSteps = (_services: number[]): RegistrationStep[] => [
  ...createClientRegistrationSteps(),
  'company',
  'services',
];
