import { toHomeRoute } from '../src/features/auth/model/use-auth-actions';
import { UserType } from '../src/entities';

describe('auth role routing', () => {
  it('selects the professional home route', () => {
    expect(toHomeRoute({ user: { type: UserType.PROFESSIONAL }, is_active: 1 })).toBe('ProfessionnelHome');
  });

  it('keeps inactive clients on the pending screen', () => {
    expect(toHomeRoute({ user: { type: UserType.CLIENT }, is_active: 0 })).toBe('AccountPendingScreen');
  });
});
