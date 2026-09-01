import { API_BASE_URL } from '../src/config/api';

test('uses the API host as base URL when endpoints provide the /api prefix', () => {
    expect(API_BASE_URL).toBe('https://dev.pro24home.com');
});
