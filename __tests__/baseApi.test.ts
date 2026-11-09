import { invalidatesEntity, providesList } from '@core/api/tags';

describe('RTK Query cache tags', () => {
  it('provides a stable list tag', () => {
    expect(providesList('Addresses')).toEqual([{ type: 'Addresses', id: 'LIST' }]);
  });

  it('invalidates an entity and its list', () => {
    expect(invalidatesEntity('Interventions', 7)).toEqual([
      { type: 'Interventions', id: 7 },
      { type: 'Interventions', id: 'LIST' },
    ]);
  });
});
