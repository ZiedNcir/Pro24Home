import { toApiError } from '@core/api/api-error';

describe('toApiError', () => {
  it('preserves validation details returned by the API', () => {
    const error = toApiError({
      status: 422,
      data: {
        message: 'Invalide',
        errors: { email: ['Déjà utilisé'] },
      },
    });

    expect(error).toEqual({
      status: 422,
      message: 'Invalide',
      fieldErrors: { email: ['Déjà utilisé'] },
      isNetworkError: false,
      raw: expect.any(Object),
    });
  });

  it('labels an error without an HTTP status as a network error', () => {
    expect(toApiError(new Error('Connexion indisponible'))).toMatchObject({
      status: 0,
      message: 'Connexion indisponible',
      fieldErrors: {},
      isNetworkError: true,
    });
  });
});
