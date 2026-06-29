import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CLIENT_ONBOARDING_ROUTES } from '../constants';
import { ClientOnboardingScreen } from '../ClientOnboardingScreen';
import { clientOnboardingSteps } from '../content';

type Props = NativeStackScreenProps<any>;

export const C04ClientOnboardingThree: React.FC<Props> = ({ navigation }) => (
  <ClientOnboardingScreen
    step={clientOnboardingSteps.tracking}
    navigation={navigation}
    skipRoute={CLIENT_ONBOARDING_ROUTES.login}
  />
);
