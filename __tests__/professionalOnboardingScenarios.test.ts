import { buildPhoneVerificationRequest } from '../src/features/auth/model/phone-verification';
import { getDocumentSubmissionProgress } from '../src/roles/professional/documents/model/professional-documents';
import { getHomeRouteFromAuthResponse } from '../src/navigation/authNavigation';

const names = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib'];
const documents = (status: string) => names.map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status })) as any;

test('verifies the submitted phone with the six-digit code', () => {
    expect(buildPhoneVerificationRequest(' 123456 ', ' +33000000000 ')).toEqual({ code: '123456', phone_number: '+33000000000' });
    expect(() => buildPhoneVerificationRequest('123456', '')).toThrow();
    expect(() => buildPhoneVerificationRequest('1234', '+33000000000')).toThrow();
});
test('professionals follow the sign-in to documents journey even before account verification', () => {
    expect(getHomeRouteFromAuthResponse({ is_verified: false, user: { type: 'professional', documents: [] } })).toBe('Documents');
});
test('reads validation status from the user returned by the profile API', () => {
    expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', is_verified: 1, is_active: 0, documents: documents('approved') } })).toBe('ProfessionalVerificationPending');
    expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', is_verified: 1, is_active: 1, documents: documents('approved') } })).toBe('ProfessionnelHome');
});
test('counts pending documents as submitted and allows proceeding to validation', () => {
    expect(getDocumentSubmissionProgress(documents('pending'))).toEqual({ submitted: 5, total: 5, canContinue: true, nextMissing: undefined });
    expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', documents: documents('pending') } })).toBe('ProfessionalVerificationPending');
});
test('missing and rejected documents must be supplied before the dossier can continue', () => {
    expect(getDocumentSubmissionProgress(documents('pending').slice(0, 4))).toMatchObject({ submitted: 4, canContinue: false, nextMissing: 'rib' });
    const rejected = documents('pending');
    rejected[2].status = 'rejected';
    expect(getDocumentSubmissionProgress(rejected)).toMatchObject({ submitted: 4, canContinue: false, nextMissing: 'proof_of_address' });
});
test('a newer uploaded replacement resolves a previously rejected document', () => {
    const dossier = documents('pending');
    dossier[3] = { ...dossier[3], status: 'rejected', uploaded_at: '2026-11-01T10:00:00Z' };
    dossier.push({ ...dossier[3], id: 9, status: 'pending', uploaded_at: '2026-11-07T10:00:00Z' });
    expect(getDocumentSubmissionProgress(dossier).canContinue).toBe(true);
    expect(getHomeRouteFromAuthResponse({ user: { type: 'professional', documents: dossier } })).toBe('ProfessionalVerificationPending');
});
