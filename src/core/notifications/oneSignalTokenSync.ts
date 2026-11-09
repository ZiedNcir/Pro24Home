interface NotificationSession {
    userId: number;
    token: string;
}

export const createOneSignalTokenSynchronizer = (
    getSession: () => NotificationSession | null,
    updateToken: (subscriptionId: string) => Promise<unknown>,
) => {
    let subscriptionId: string | null = null;
    let lastAttempt: string | null = null;
    let lastSuccess: string | null = null;
    let inFlight = false;
    let stopped = false;

    const sync = () => {
        if (stopped) return;
        const session = getSession();
        if (!session) {
            lastAttempt = null;
            lastSuccess = null;
            return;
        }
        if (!subscriptionId || inFlight) return;
        const key = JSON.stringify([session.userId, session.token, subscriptionId]);
        if (key === lastAttempt || key === lastSuccess) return;
        lastAttempt = key;
        inFlight = true;
        updateToken(subscriptionId).then(() => { lastSuccess = key; }).catch(() => {
            // Retry when the app returns to the foreground, without a request loop.
        }).finally(() => {
            inFlight = false;
            sync();
        });
    };

    return {
        sync,
        setSubscriptionId: (id: string) => {
            if (!id.trim() || id.startsWith('local-')) return;
            subscriptionId = id;
            sync();
        },
        retry: () => {
            if (!inFlight && lastAttempt !== lastSuccess) lastAttempt = null;
            sync();
        },
        stop: () => { stopped = true; },
    };
};
