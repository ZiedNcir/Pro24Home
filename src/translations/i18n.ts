import { translations, TranslationLocale } from './index';

let currentLocale: TranslationLocale = 'fr';

export const setLocale = (locale: TranslationLocale) => {
  currentLocale = locale;
};

export const getLocale = () => currentLocale;

export const t = (key: string): string => {
  const parts = key.split('.');
  let value: any = translations[currentLocale];

  for (const part of parts) {
    value = value?.[part];
  }

  return typeof value === 'string' ? value : key;
};
