export type SupportedLanguage = 'fr' | 'en';

export type DeviceLocale = {
  languageCode?: string;
  languageTag?: string;
};

export const resolveSupportedLanguage = (
  locales: readonly DeviceLocale[],
): SupportedLanguage => {
  for (const locale of locales) {
    const code = (locale.languageCode ?? locale.languageTag ?? '')
      .split(/[-_]/)[0]
      ?.toLowerCase();

    if (code === 'fr' || code === 'en') return code;
  }

  return 'fr';
};
