export const RootRoutes = {
  ClientAuth: 'ClientAuth',
  ClientApp: 'ClientApp',
  ProfessionalApp: 'ProfessionalApp',
} as const;

export const ClientAuthRoutes = {
  Splash: 'ClientSplash',
  Welcome: 'ClientWelcome',
  OnboardingOne: 'ClientOnboardingOne',
  OnboardingTwo: 'ClientOnboardingTwo',
  OnboardingThree: 'ClientOnboardingThree',
  Login: 'ClientLogin',
  Register: 'ClientRegister',
  ProfessionalRegister: 'ProfessionalRegister',
  Otp: 'ClientOtp',
  GpsPermission: 'ClientGpsPermission',
  NotificationsPermission: 'ClientNotificationsPermission',
  AccountType: 'ClientAccountType',
  RegisterSuccess: 'ClientRegisterSuccess',

} as const;

export const ClientRoutes = {
  Home: 'ClientHome',
  Categories: 'ClientCategories',
  CreateRequest: 'ClientCreateRequest',
  Matching: 'ClientMatching',
  Quote: 'ClientQuote',
  Tracking: 'ClientTracking',
  History: 'ClientHistory',
  Notifications: 'ClientNotifications',
  Profile: 'ClientProfile',
} as const;

export const ProfessionalRoutes = {
  Dashboard: 'ProDashboard',
  Requests: 'ProRequests',
  MissionDetails: 'ProMissionDetails',
  QuoteCreation: 'ProQuoteCreation',
  Navigation: 'ProNavigation',
  History: 'ProHistory',
  Notifications: 'ProNotifications',
  Profile: 'ProProfile',
} as const;
