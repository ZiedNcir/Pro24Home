import { createOneSignalTokenSynchronizer } from '../src/core/notifications/oneSignalTokenSync';

const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

test('waits for sign-in, sends once, then updates a changed device subscription', async () => {
    let session: { userId: number; token: string } | null = null;
    const sent: string[] = [];
    const sync = createOneSignalTokenSynchronizer(() => session, async id => { sent.push(id); });
    sync.setSubscriptionId('device-a');
    expect(sent).toEqual([]);
    session = { userId: 1, token: 'session-a' };
    sync.sync();
    await flush();
    sync.sync();
    expect(sent).toEqual(['device-a']);
    sync.setSubscriptionId('device-b');
    await flush();
    expect(sent).toEqual(['device-a', 'device-b']);
});
test('resynchronizes the same device when the signed-in account changes', async () => {
    let session: { userId: number; token: string } | null = { userId: 1, token: 'a' };
    const sent: number[] = [];
    const sync = createOneSignalTokenSynchronizer(() => session, async () => { sent.push(session!.userId); });
    sync.setSubscriptionId('device-a');
    await flush();
    session = null;
    sync.sync();
    session = { userId: 2, token: 'b' };
    sync.sync();
    await flush();
    expect(sent).toEqual([1, 2]);
});
test('serializes updates and sends the latest ID received during an in-flight request', async () => {
    let finish!: () => void;
    const sent: string[] = [];
    const sync = createOneSignalTokenSynchronizer(() => ({ userId: 1, token: 'a' }), id => {
        sent.push(id);
        return sent.length === 1 ? new Promise<void>(resolve => { finish = resolve; }) : Promise.resolve();
    });
    sync.setSubscriptionId('device-a');
    sync.setSubscriptionId('device-b');
    sync.setSubscriptionId('device-c');
    expect(sent).toEqual(['device-a']);
    finish();
    await flush();
    expect(sent).toEqual(['device-a', 'device-c']);
});
test('does not loop on failure and can retry on foreground', async () => {
    let attempts = 0;
    const sync = createOneSignalTokenSynchronizer(() => ({ userId: 1, token: 'a' }), async () => { attempts++; throw new Error('offline'); });
    sync.setSubscriptionId('device-a');
    await flush();
    sync.sync();
    expect(attempts).toBe(1);
    sync.retry();
    await flush();
    expect(attempts).toBe(2);
});
test('ignores placeholders and stops sending after cleanup', async () => {
    const sent: string[] = [];
    const sync = createOneSignalTokenSynchronizer(() => ({ userId: 1, token: 'a' }), async id => { sent.push(id); });
    sync.setSubscriptionId('local-pending-registration');
    expect(sent).toEqual([]);
    sync.stop();
    sync.setSubscriptionId('device-a');
    await flush();
    expect(sent).toEqual([]);
});
