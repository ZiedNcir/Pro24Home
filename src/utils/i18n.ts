import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import EnglishDictionary from '../translations/en.json';
import FrenchDictionary from '../translations/fr.json';
import { Language } from './constant';

const defaultLanguage = Language.FR;

export const resources = {
  fr: {
    translation: FrenchDictionary,
  },

  en: {
    translation: EnglishDictionary,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    lng: getLocales()[0].languageCode || defaultLanguage,
    fallbackLng: defaultLanguage,
    resources,
  });

export default i18n;
