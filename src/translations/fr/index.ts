import { common } from './common';
import { auth } from './auth';
import { onboarding } from './onboarding';
import { permissions } from './permissions';
import { validation } from './validation';
import { module1 } from './module1';
import { navigation } from './navigation';
import { ui } from './ui';

export const fr = {
  common,
  auth,
  onboarding,
  permissions,
  validation,
  module1,
  navigation,
  ui,
};

export type TranslationSchema = typeof fr;
