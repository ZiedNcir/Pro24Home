import { OneSignal } from 'react-native-onesignal';
let mockAuthenticated = true;
let mockReady = true;
const mockNavigate = jest.fn();
const mockDispatch = jest.fn(() => ({ unwrap: () => new Promise(() => {}) }));
jest.mock('../src/store', () => ({ store: {
    getState: () => ({ auth: { isAuthenticated: mockAuthenticated, user: { type: 'client' } } }),
    dispatch: (action: unknown) => mockDispatch(action),
} }));
jest.mock('../src/store/api/endpoints/notification', () => ({ notificationEndpoints: { endpoints: { readNotification: { initiate: (id: string) => ({ type: 'mark-read', id }) } } } }));
jest.mock('../src/store/api/endpoints/intervention', () => ({ interventionEndpoints: { endpoints: { getInterventions: { initiate: () => ({ type: 'get-latest' }) } } } }));
jest.mock('../src/app/navigation/navigation-service', () => ({ navigationRef: {
    isReady: () => mockReady,
    navigate: (...args: unknown[]) => mockNavigate(...args),
} }));
import { initializeNotificationOpenHandler, flushPendingNotificationOpen } from '../src/core/notifications/notification-open';
let click: (event: any) => void;
beforeAll(() => {
    initializeNotificationOpenHandler();
    click = (OneSignal.Notifications.addEventListener as jest.Mock).mock.calls.find(([name]) => name === 'click')[1];
});
beforeEach(() => { mockAuthenticated = true; mockReady = true; mockNavigate.mockClear(); mockDispatch.mockClear(); });

test('opens the message intervention immediately while mark-as-read is pending', () => {
    click({ notification: { additionalData: { notification_id: 'message-a', intervention_id: '42' } } });
    expect(mockNavigate).toHaveBeenCalledWith('InterventionDetail', { intervention_id: 42 });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'mark-read', id: 'message-a' });
});
test('never fetches or opens an unrelated intervention when the ID is absent', () => {
    click({ notification: { additionalData: {} } });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('Notifications');
});
test('keeps the exact intervention until navigation and sign-in are ready', () => {
    mockReady = false;
    mockAuthenticated = false;
    click({ notification: { additionalData: { intervention_id: 71 } } });
    expect(mockNavigate).not.toHaveBeenCalled();
    mockReady = true;
    mockAuthenticated = true;
    flushPendingNotificationOpen();
    expect(mockNavigate).toHaveBeenCalledWith('InterventionDetail', { intervention_id: 71 });
});
