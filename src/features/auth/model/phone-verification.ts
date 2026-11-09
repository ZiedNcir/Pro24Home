import type { VerificationRequest } from '@entities/user/model';

export const buildPhoneVerificationRequest = (code: string, phoneNumber: string): VerificationRequest => {
    const normalizedCode = code.trim();
    const phone = phoneNumber.trim();
    if (!/^\d{6}$/.test(normalizedCode)) throw new Error('Invalid verification code');
    if (!phone) throw new Error('Missing verification phone');
    return { code: normalizedCode, phone_number: phone };
};
