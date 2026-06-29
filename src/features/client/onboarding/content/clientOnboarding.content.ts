import { OnboardingIllustrations } from '../../../../assets/illustrations/onboarding';
import type { ClientOnboardingStep } from '../types';

export const clientOnboardingSteps: Record<
  ClientOnboardingStep['key'],
  ClientOnboardingStep
> = {
  repair: {
    key: 'repair',
    image: OnboardingIllustrations.Repair,
    eyebrowKey: 'onboarding.repair.eyebrow',
    titleKey: 'onboarding.repair.title',
    descriptionKey: 'onboarding.repair.description',
    current: 0,
    primaryLabelKey: 'common.next',
    secondaryLabelKey: 'common.skip',
  },
  quote: {
    key: 'quote',
    image: OnboardingIllustrations.Quote,
    eyebrowKey: 'onboarding.quote.eyebrow',
    titleKey: 'onboarding.quote.title',
    descriptionKey: 'onboarding.quote.description',
    current: 1,
    primaryLabelKey: 'common.next',
    secondaryLabelKey: 'common.skip',
  },
  tracking: {
    key: 'tracking',
    image: OnboardingIllustrations.Tracking,
    eyebrowKey: 'onboarding.tracking.eyebrow',
    titleKey: 'onboarding.tracking.title',
    descriptionKey: 'onboarding.tracking.description',
    current: 2,
    primaryLabelKey: 'common.start',
  },
};
