import { ACCOUNT_PENDING_STEPS, getPendingStep } from '../src/roles/client/home/model/accountPending';

describe('account pending content', () => {
    it('exposes the current verification step in the three-step timeline', () => {
        expect(ACCOUNT_PENDING_STEPS).toHaveLength(3);
        expect(getPendingStep()).toBe(1);
    });
});
