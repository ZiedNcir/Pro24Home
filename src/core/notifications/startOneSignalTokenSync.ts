import { AppState } from 'react-native';
import { store } from '../../store';
import { authApiEndpoints } from '../../store/api/endpoints/auth';
import { subscribeToOneSignalSubscription } from './oneSignalSubscription';
import { createOneSignalTokenSynchronizer } from './oneSignalTokenSync';

export const startOneSignalTokenSync = (): (() => void) => {
    let activeRequest: { abort: () => void } | null = null;
    let requestOwner: { userId?: number; token: string | null } | null = null;
    const synchronizer = createOneSignalTokenSynchronizer(
        () => {
            const { auth } = store.getState();
            return auth.isAuthenticated && auth.user && auth.token
                ? { userId: auth.user.id, token: auth.token }
                : null;
        },
        async onesignal_key => {
            const { auth } = store.getState();
            requestOwner = { userId: auth.user?.id, token: auth.token };
            const request = store.dispatch(authApiEndpoints.endpoints.updateNotificationToken.initiate({ onesignal_key }));
            activeRequest = request;
            try {
                const response = await request.unwrap();
                if (response?.success === false) throw new Error('Notification subscription update rejected');
            } finally {
                if (activeRequest === request) {
                    activeRequest = null;
                    requestOwner = null;
                }
                request.reset();
            }
        },
    );
    const unsubscribeStore = store.subscribe(() => {
        const { auth } = store.getState();
        if (activeRequest && requestOwner && (auth.user?.id !== requestOwner.userId || auth.token !== requestOwner.token)) {
            activeRequest.abort();
        }
        synchronizer.sync();
    });
    const unsubscribeSubscription = subscribeToOneSignalSubscription(synchronizer.setSubscriptionId);
    const foregroundListener = AppState.addEventListener('change', state => {
        if (state === 'active') synchronizer.retry();
    });
    synchronizer.sync();
    return () => {
        synchronizer.stop();
        activeRequest?.abort();
        unsubscribeStore();
        unsubscribeSubscription();
        foregroundListener.remove();
    };
};
