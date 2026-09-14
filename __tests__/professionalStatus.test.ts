import { buildProfessionalStatusPayload } from '../src/roles/professional/dashboard/model/professional-status';

describe('buildProfessionalStatusPayload', () => {
    it('sends the onligne flag and current coordinates to update-status', () => {
        expect(buildProfessionalStatusPayload(true, { latitude: 36.8065, longitude: 10.1815 })).toEqual({
            onligne: 1,
            latitude: 36.8065,
            longitude: 10.1815,
        });
    });
});
