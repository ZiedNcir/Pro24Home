import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import EnglishDictionary from '../translations/en.json';
import FrenchDictionary from '../translations/fr.json';
import { resolveSupportedLanguage } from './locale';

const defaultLanguage = 'fr';

export const resources = {
  fr: {
    translation: FrenchDictionary,
  },

  en: {
    translation: EnglishDictionary,
  },
};

i18n
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    lng: resolveSupportedLanguage(getLocales()),
    fallbackLng: defaultLanguage,
    resources,
  });

export default i18n;
