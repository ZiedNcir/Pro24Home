import type { NavigatorScreenParams } from '@react-navigation/native';

export type ClientAuthStackParamList = {
  ClientSplash: undefined;
  ClientWelcome: undefined;
  ClientOnboardingOne: undefined;
  ClientOnboardingTwo: undefined;
  ClientOnboardingThree: undefined;
  ClientLogin: undefined;
  ClientRegister: undefined;
  ProfessionalRegister: undefined;
  ClientOtp: { phone?: string; email?: string } | undefined;
  ClientGpsPermission: undefined;
  ClientNotificationsPermission: undefined;
  ClientAccountType: undefined;
  ClientRegisterSuccess: undefined;
};

export type ClientStackParamList = {
  ClientHome: undefined;
  ClientCategories: undefined;
  ClientCreateRequest: { serviceId?: number } | undefined;
  ClientMatching: { interventionId: number };
  ClientQuote: { interventionId: number; devisId?: number };
  ClientTracking: { interventionId: number };
  ClientHistory: undefined;
  ClientNotifications: undefined;
  ClientProfile: undefined;
};

export type ProfessionalStackParamList = {
  ProDashboard: undefined;
  ProRequests: undefined;
  ProMissionDetails: { interventionId: number };
  ProQuoteCreation: { interventionId: number };
  ProNavigation: { interventionId: number };
  ProHistory: undefined;
  ProNotifications: undefined;
  ProProfile: undefined;
};

export type RootStackParamList = {
  ClientAuth: NavigatorScreenParams<ClientAuthStackParamList>;
  ClientApp: NavigatorScreenParams<ClientStackParamList>;
  ProfessionalApp: NavigatorScreenParams<ProfessionalStackParamList>;
};
