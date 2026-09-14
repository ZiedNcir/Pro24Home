import { buildInterventionPayload } from '../src/features/intervention-creation/model/intervention-payload';

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

    it('uses the entered description and maps selected photos to multipart fields', () => {
        const payload = buildInterventionPayload({
            serviceId: 1,
            addressId: 23,
            problemTitle: 'Chauffage',
            problemDescription: 'Description par défaut',
            description: 'La chaudière fuit',
            timing: 'asap',
            photos: [
                { uri: 'file:///photo-1.jpg', type: 'image/jpeg', name: 'photo-1.jpg' },
                { uri: 'file:///photo-2.jpg', type: 'image/jpeg', name: 'photo-2.jpg' },
            ],
        });

        expect(payload.description).toBe('La chaudière fuit Disponibilité : dès que possible.');
        expect(payload.image_1).toEqual({ uri: 'file:///photo-1.jpg', type: 'image/jpeg', name: 'photo-1.jpg' });
        expect(payload.image_2).toEqual({ uri: 'file:///photo-2.jpg', type: 'image/jpeg', name: 'photo-2.jpg' });
        expect(payload.image_3).toBeUndefined();
    });
});
