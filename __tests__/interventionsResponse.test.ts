import { normalizeInterventionsResponse } from '../src/store/api/utils/interventionsResponse';

describe('interventions response normalization', () => {
    it('normalizes the backend list without pagination metadata', () => {
        const intervention = { id: 7, title: 'Réparer une fuite' };

        expect(normalizeInterventionsResponse([intervention])).toEqual({
            success: true,
            data: [intervention],
            message: 'Interventions fetched successfully',
        });
    });
});
