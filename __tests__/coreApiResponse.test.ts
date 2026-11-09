import { unwrapArray, unwrapData } from '@core/api/response';

describe('API response unwrapping', () => {
  it('returns the payload nested under data', () => {
    expect(unwrapData<{ id: number }>({ data: { id: 2 } })).toEqual({ id: 2 });
  });

  it('returns a root payload unchanged', () => {
    expect(unwrapData<{ id: number }>({ id: 2 })).toEqual({ id: 2 });
  });

  it('returns an empty list for a non-list payload', () => {
    expect(unwrapArray<number>({ data: { id: 2 } })).toEqual([]);
  });
});
