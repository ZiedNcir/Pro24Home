export * from './fr';

import { fr } from './fr';

export const translations = {
  fr,
};

export type TranslationLocale = keyof typeof translations;
