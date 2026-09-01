import { buildInterventionPayload } from '../src/screens/Intervention/utils/interventionPayload';

describe('buildInterventionPayload', () => {
    it('builds the payload required by addIntervention from the selected flow data', () => {
        expect(buildInterventionPayload({
            serviceId: 3,
            addressId: 18,
            problemTitle: 'Prise électrique défectueuse',
            problemDescription: 'La prise ne fonctionne plus.',
            timing: 'asap',
        })).toEqual({
            service_id: 3,
            address_id: 18,
            title: 'Prise électrique défectueuse',
            description: 'La prise ne fonctionne plus. Disponibilité : dès que possible.',
            price: 50,
        });
    });
});
