import { normalizeInterventionResponse } from '../src/store/api/utils/interventionResponse';

describe('intervention detail response normalization', () => {
    it('unwraps intervention and maps the backend address and numeric fields', () => {
        const result = normalizeInterventionResponse({
            intervention: {
                id: 86,
                adresse_id: 23,
                price: '20.00',
                adress: { id: 23, address: 'Adresse sélectionnée sur la carte', latitude: '35.30', longitude: '10.71' },
            },
        });

        expect(result).toMatchObject({
            id: 86,
            address_id: 23,
            price: 20,
            address: { id: 23, latitude: 35.3, longitude: 10.71 },
        });
    });
});
