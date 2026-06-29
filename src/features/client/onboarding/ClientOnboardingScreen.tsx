import React from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { t } from '../../../translations/i18n';

import { CLIENT_ONBOARDING_TOTAL_STEPS } from './constants';
import { ClientOnboardingLayout } from './components';
import type { ClientOnboardingStep } from './types';

export interface ClientOnboardingScreenProps {
  step: ClientOnboardingStep;
  navigation: NativeStackNavigationProp<any>;
  nextRoute?: string;
  skipRoute: string;
}

export const ClientOnboardingScreen: React.FC<ClientOnboardingScreenProps> = ({
  step,
  navigation,
  nextRoute,
  skipRoute,
}) => {
  const handlePrimaryPress = () => {
    if (nextRoute) {
      navigation.navigate(nextRoute as never);
      return;
    }

    navigation.navigate(skipRoute as never);
  };

  const handleSecondaryPress = () => {
    navigation.navigate(skipRoute as never);
  };

  return (
    <ClientOnboardingLayout
      image={step.image}
      eyebrow={t(step.eyebrowKey)}
      title={t(step.titleKey)}
      description={t(step.descriptionKey)}
      current={step.current}
      total={CLIENT_ONBOARDING_TOTAL_STEPS}
      primaryLabel={t(step.primaryLabelKey)}
      secondaryLabel={step.secondaryLabelKey ? t(step.secondaryLabelKey) : undefined}
      onPrimaryPress={handlePrimaryPress}
      onSecondaryPress={handleSecondaryPress}
    />
  );
};
