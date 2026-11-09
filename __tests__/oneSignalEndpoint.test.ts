let mockDefinitions: any;
jest.mock('../src/store/api/baseApi', () => ({
    api: {
        injectEndpoints: (options: any) => {
            mockDefinitions = options.endpoints({ query: (value: any) => value, mutation: (value: any) => value });
            return { endpoints: mockDefinitions };
        },
    },
}));
require('../src/store/api/endpoints/auth');

test('uses the documented POST route and multipart subscription ID', () => {
    const request = mockDefinitions.updateNotificationToken.query({ onesignal_key: 'device-subscription' });
    expect(request.url).toBe('/api/update-oneSignal_id');
    expect(request.method).toBe('POST');
    expect(Array.from(request.body.entries())).toEqual([['onesignal_key', 'device-subscription']]);
});
test('does not apply an old account response to a newly signed-in account', async () => {
    let auth = { user: { id: 1 }, token: 'first' };
    const actions: unknown[] = [];
    let complete!: (value: unknown) => void;
    const queryFulfilled = new Promise(resolve => { complete = resolve; });
    const done = mockDefinitions.updateNotificationToken.onQueryStarted({ onesignal_key: 'device-subscription' }, {
        getState: () => ({ auth }), dispatch: (action: unknown) => actions.push(action), queryFulfilled,
    });
    auth = { user: { id: 2 }, token: 'second' };
    complete({ data: { success: true } });
    await done;
    expect(actions).toEqual([]);
});
test('saves the token only when the API acknowledges success for the same account', async () => {
    const actions: unknown[] = [];
    await mockDefinitions.updateNotificationToken.onQueryStarted({ onesignal_key: 'device-subscription' }, {
        getState: () => ({ auth: { user: { id: 1 }, token: 'first' } }),
        dispatch: (action: unknown) => actions.push(action), queryFulfilled: Promise.resolve({ data: { success: true } }),
    });
    expect(actions).toEqual([{ type: 'auth/updateNotificationToken', payload: 'device-subscription' }]);
});
