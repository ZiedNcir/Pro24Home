import type { ImageSourcePropType } from 'react-native';

export type ClientOnboardingStepKey = 'repair' | 'quote' | 'tracking';

export interface ClientOnboardingStep {
  key: ClientOnboardingStepKey;
  image: ImageSourcePropType;
  eyebrowKey: string;
  titleKey: string;
  descriptionKey: string;
  current: number;
  primaryLabelKey: string;
  secondaryLabelKey?: string;
}

export type ClientOnboardingRouteName =
  | 'ClientOnboardingOne'
  | 'ClientOnboardingTwo'
  | 'ClientOnboardingThree';

export type ClientOnboardingStackParamList = {
  ClientOnboardingOne: undefined;
  ClientOnboardingTwo: undefined;
  ClientOnboardingThree: undefined;
};
