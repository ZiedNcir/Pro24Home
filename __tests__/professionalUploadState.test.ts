import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession } from '../src/core/session/session-storage';
import { hasFinishedProfessionalUpload, markProfessionalUploadFinished } from '../src/core/session/professional-upload-state';
import { getHomeRouteFromAuthResponse } from '../src/navigation/authNavigation';

beforeEach(async () => { await AsyncStorage.clear(); });
test('remembers completion across logout and recognizes the same account at next sign-in', async () => {
    const account = { id: 101, email: 'pro@example.test' };
    expect(await hasFinishedProfessionalUpload(account)).toBe(false);
    await markProfessionalUploadFinished(account);
    await clearSession();
    expect(await hasFinishedProfessionalUpload(account)).toBe(true);
    expect(await hasFinishedProfessionalUpload({ email: ' PRO@example.test ' })).toBe(true);
});
test('keeps completion isolated from another account, including a new user with a reused email', async () => {
    await markProfessionalUploadFinished({ id: 101, email: 'pro@example.test' });
    expect(await hasFinishedProfessionalUpload({ id: 102, email: 'other@example.test' })).toBe(false);
    expect(await hasFinishedProfessionalUpload({ id: 102, email: 'pro@example.test' })).toBe(false);
});
test('routes an inactive professional to upload before completion and pending afterwards', () => {
    const response = { is_active: false, is_verified: false, user: { id: 101, type: 'professional', documents: [] } } as any;
    expect(getHomeRouteFromAuthResponse(response, 'professional', false)).toBe('Documents');
    expect(getHomeRouteFromAuthResponse(response, 'professional', true)).toBe('ProfessionalVerificationPending');
});
test('an activated professional goes home even when login omits document metadata', () => {
    expect(getHomeRouteFromAuthResponse({ is_active: true, user: { type: 'professional', documents: [] } } as any, 'professional', true)).toBe('ProfessionnelHome');
});
test('explicit rejected documents return to correction even when completion was recorded', () => {
    expect(getHomeRouteFromAuthResponse({ is_active: false, user: { type: 'professional', documents: [{ name: 'rib', status: 'rejected', uploaded_at: '' }] } } as any, 'professional', true)).toBe('Documents');
});
test('records only successful uploads and finishes after all required types', async () => {
    const { recordProfessionalDocumentUpload } = require('../src/core/session/professional-upload-state');
    const account = { id: 101, email: 'pro@example.test' };
    const required = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib'];
    for (const name of required.slice(0, 4)) await recordProfessionalDocumentUpload(account, name, required);
    expect(await hasFinishedProfessionalUpload(account)).toBe(false);
    await recordProfessionalDocumentUpload(account, 'rib', required);
    expect(await hasFinishedProfessionalUpload(account)).toBe(true);
});
