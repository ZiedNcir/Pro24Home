import { mapApiError, validateProfessionalRegistration } from '../src/features/auth/services/registration';

test('preserves a server rejection message even without field errors', () => {
    expect(mapApiError({ status: 422, data: { message: 'Email already registered' } })).toEqual([{ message: 'Email already registered', type: 'api' }]);
});
test('identifies field errors for correction without losing the server message', () => {
    expect(mapApiError({ status: 422, data: { errors: { email: ['Email already registered'], siret_number: ['Invalid SIRET'] } } })).toEqual([
        { field: 'email', message: 'Email already registered', type: 'api' },
        { field: 'siret_number', message: 'Invalid SIRET', type: 'api' },
    ]);
});
test('rejects incomplete professional information and missing services before submission', () => {
    const errors = validateProfessionalRegistration({ first_name: 'Test', last_name: 'Pro', email: 'test@example.test', password: 'test-password', phone_number: '+33000000000', postal_code: '75001', company_name: '', siret_number: '123' }, []);
    expect(errors.map(error => error.field)).toEqual(expect.arrayContaining(['company_name', 'siret_number', 'services']));
});
