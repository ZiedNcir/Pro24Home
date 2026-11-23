type ParsedPhoneNumber = object;

type PhoneNumberUtilInstance = {
  parse: (number: string, region: string) => ParsedPhoneNumber;
  isValidNumberForRegion: (number: ParsedPhoneNumber, region: string) => boolean;
  format: (number: ParsedPhoneNumber, format: number) => string;
};

const { PhoneNumberUtil, PhoneNumberFormat } = require('google-libphonenumber') as {
  PhoneNumberUtil: { getInstance: () => PhoneNumberUtilInstance };
  PhoneNumberFormat: { E164: number };
};

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const compactPhoneNumber = (value: string) => value.replace(/[\s().-]/g, '');

export const isValidPhoneNumberForCountry = (value: string, countryCode: string): boolean => {
  const compact = compactPhoneNumber(value);
  if (!compact) return false;

  try {
    const parsedNumber = phoneNumberUtil.parse(compact, countryCode);
    return phoneNumberUtil.isValidNumberForRegion(parsedNumber, countryCode);
  } catch {
    return false;
  }
};

export const normalizePhoneNumberForCountry = (value: string, countryCode: string): string => {
  const compact = compactPhoneNumber(value);
  if (!compact) return compact;

  try {
    const parsedNumber = phoneNumberUtil.parse(compact, countryCode);
    if (!phoneNumberUtil.isValidNumberForRegion(parsedNumber, countryCode)) return compact;
    return phoneNumberUtil.format(parsedNumber, PhoneNumberFormat.E164);
  } catch {
    return compact;
  }
};
