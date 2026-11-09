let mockDefinitions: any;
jest.mock('../src/store/api/baseApi', () => ({ api: { injectEndpoints: (options: any) => {
    mockDefinitions = options.endpoints({ query: (value: any) => value, mutation: (value: any) => value });
    return { endpoints: mockDefinitions };
} } }));
require('../src/store/api/endpoints/auth');

test('sends professional signup as multipart with repeated services[] and optional referral context', () => {
    const request = mockDefinitions.registerProfessional.query({
        first_name: 'Test', last_name: 'Pro', email: 'test@example.test', password: 'test-password',
        phone_number: '+33000000000', address: 'Test address', postal_code: '75001',
        company_name: 'Test company', siret_number: '12345678901234', services: [1, 2], onesignal_key: 'subscription',
        source: 'referral', commercial_id: 5,
    });
    expect(request.url).toBe('/api/register-professional');
    expect(request.method).toBe('POST');
    expect(Array.from(request.body.entries())).toEqual(expect.arrayContaining([
        ['services[]', '1'], ['services[]', '2'], ['source', 'referral'], ['commercial_id', '5'], ['onesignal_key', 'subscription'],
    ]));
});
test('does not authenticate an account immediately after professional registration', async () => {
    const actions: unknown[] = [];
    if (mockDefinitions.registerProfessional.onQueryStarted) {
        await mockDefinitions.registerProfessional.onQueryStarted({}, {
            dispatch: (action: unknown) => actions.push(action),
            queryFulfilled: Promise.resolve({ data: { user: { id: 1 }, access_token: 'registration-token' } }),
        });
    }
    expect(actions).toEqual([]);
});
test('verifies by phone and resends by email using the documented multipart fields', () => {
    const verification = mockDefinitions.verifyAccount.query({ code: '123456', phone_number: '+33000000000' });
    expect(verification.url).toBe('/api/register-verification');
    expect(verification.method).toBe('POST');
    expect(Array.from(verification.body.entries())).toEqual([['code', '123456'], ['phone_number', '+33000000000']]);
    const resend = mockDefinitions.resendVerification.query({ email: 'test@example.test' });
    expect(resend.url).toBe('/api/resend-verification');
    expect(Array.from(resend.body.entries())).toEqual([['email', 'test@example.test']]);
});
test.each(['registerProfessional', 'verifyAccount', 'resendVerification'])('does not accept an HTTP 200 business rejection for %s', name => {
    const request = mockDefinitions[name].query({ code: '123456', phone_number: '+33000000000', email: 'test@example.test' });
    expect(request.validateStatus({ status: 200 }, { success: false, message: 'Rejected' })).toBe(false);
    expect(request.validateStatus({ status: 200 }, { success: true })).toBe(true);
});
test('unverified logins do not create an authenticated session', async () => {
    const actions: unknown[] = [];
    await mockDefinitions.login.onQueryStarted({}, {
        dispatch: (action: unknown) => actions.push(action),
        queryFulfilled: Promise.resolve({ data: { is_verified: false, user: { id: 1 }, access_token: 'unverified-token' } }),
    });
    expect(actions).toEqual([]);
});
test('retains the session supplied for an inactive professional so documents can be uploaded', async () => {
    const actions: unknown[] = [];
    const user = { id: 42, type: 'professional', is_active: 0, is_verified: 0 };
    await mockDefinitions.login.onQueryStarted({}, {
        dispatch: (action: unknown) => actions.push(action),
        queryFulfilled: Promise.resolve({ data: { is_active: false, is_verified: false, user, access_token: 'test-session' } }),
    });
    expect(actions).toEqual([expect.objectContaining({ type: 'auth/setCredentials', payload: expect.objectContaining({ user, token: 'test-session' }) })]);
});
