import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SupportedLanguage } from './locale';

const languagePreferenceKey = 'pro24home:language-preference';

export const readLanguagePreference = async (): Promise<SupportedLanguage | null> => {
  const language = await AsyncStorage.getItem(languagePreferenceKey);
  return language === 'fr' || language === 'en' ? language : null;
};

export const saveLanguagePreference = (language: SupportedLanguage): Promise<void> =>
  AsyncStorage.setItem(languagePreferenceKey, language);
