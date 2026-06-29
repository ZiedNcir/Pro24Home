import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CLIENT_ONBOARDING_ROUTES } from '../constants';
import { ClientOnboardingScreen } from '../ClientOnboardingScreen';
import { clientOnboardingSteps } from '../content';

type Props = NativeStackScreenProps<any>;

export const C02ClientOnboardingOne: React.FC<Props> = ({ navigation }) => (
  <ClientOnboardingScreen
    step={clientOnboardingSteps.repair}
    navigation={navigation}
    nextRoute={CLIENT_ONBOARDING_ROUTES.two}
    skipRoute={CLIENT_ONBOARDING_ROUTES.login}
  />
);
