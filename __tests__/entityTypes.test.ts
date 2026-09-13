import { Intervention, UserType } from '../src/entities';

describe('entity type facade', () => {
  it('preserves the intervention contract', () => {
    const intervention = {
      id: 1,
      address_id: 2,
      title: 'Fuite',
      status: 'pending',
      images: [],
    } as Intervention;

    expect(intervention.id).toBe(1);
  });

  it('preserves role discriminators', () => {
    expect(UserType.CLIENT).toBe('client');
  });
});
