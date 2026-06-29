export const CLIENT_AUTH_ROUTES = {
  splash: 'ClientSplash',
  welcome: 'ClientWelcome',
  onboardingOne: 'ClientOnboardingOne',
  onboardingTwo: 'ClientOnboardingTwo',
  onboardingThree: 'ClientOnboardingThree',
  login: 'ClientLogin',
  register: 'ClientRegister',
  otp: 'ClientOtp',
  gps: 'ClientGpsPermission',
  notifications: 'ClientNotificationsPermission',
  firstHome: 'ClientFirstHome',
} as const;

export const OTP_CODE_LENGTH = 6;
