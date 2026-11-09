import { toHomeRoute } from '../src/features/auth/model/use-auth-actions';
import { UserType } from '../src/entities';

describe('auth role routing', () => {
  it('selects the professional home route', () => {
    const documents = ['identity_front', 'identity_back', 'proof_of_address', 'kbis', 'rib']
      .map((name, id) => ({ id, name, type: 'img', url: '', uploaded_at: '', status: 'approved' }));

    expect(toHomeRoute({ user: { type: UserType.PROFESSIONAL, documents }, is_active: 1 })).toBe('ProfessionnelHome');
  });

  it('keeps inactive clients on the pending screen', () => {
    expect(toHomeRoute({ user: { type: UserType.CLIENT }, is_active: 0 })).toBe('AccountPendingScreen');
  });
});
