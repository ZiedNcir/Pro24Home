import React from 'react';
import { View } from 'react-native';

import type { RegistrationStep } from '../model/registration-steps';

interface RegistrationWizardProps {
  steps: RegistrationStep[];
  activeStep: number;
  children: React.ReactNode;
}

export const RegistrationWizard = ({ steps, activeStep, children }: RegistrationWizardProps) => (
  <View accessibilityLabel={`Étape ${activeStep + 1} sur ${steps.length}`}>
    {children}
  </View>
);
