import type { VerificationRequest } from '@entities/user/model';

export const normalizeVerificationPhone = (phoneNumber: string): string =>
    phoneNumber.replace(/[\s().-]/g, '');

export const buildPhoneVerificationRequest = (code: string, phoneNumber: string): VerificationRequest => {
    const normalizedCode = code.trim();
    const phone = normalizeVerificationPhone(phoneNumber);
    if (!/^\d{6}$/.test(normalizedCode)) throw new Error('Invalid verification code');
    if (!phone) throw new Error('Missing verification phone');
    if (phone.length > 15) throw new Error('Verification phone exceeds 15 characters');
    if (!/^\+?\d+$/.test(phone)) throw new Error('Invalid verification phone');
    return { code: normalizedCode, phone_number: phone };
};
