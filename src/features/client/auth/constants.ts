export const CLIENT_AUTH_ROUTES = {
  splash: 'ClientSplash',
  welcome: 'ClientWelcome',
  onboardingOne: 'ClientOnboardingOne',
  onboardingTwo: 'ClientOnboardingTwo',
  onboardingThree: 'ClientOnboardingThree',
  login: 'ClientLogin',
  register: 'ClientRegister',
  professionalRegister: 'ProfessionalRegister',
  accountType: 'ClientAccountType',
  otp: 'ClientOtp',
  gps: 'ClientGpsPermission',
  notifications: 'ClientNotificationsPermission',
  firstHome: 'ClientFirstHome',
  registerSuccess: 'ClientRegisterSuccess',
} as const;

export const OTP_CODE_LENGTH = 6;
