import { normalizeServicesResponse } from '../src/store/api/utils/servicesResponse';

describe('services response normalization', () => {
    it('normalizes a direct backend list without pagination metadata', () => {
        const service = { id: 1, name: 'Plomberie' };

        expect(normalizeServicesResponse([service])).toEqual({
            success: true,
            data: [service],
            message: 'Services fetched successfully',
        });
    });
});
