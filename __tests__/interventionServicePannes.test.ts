import { getServicePannes } from '../src/screens/Intervention/utils/servicePannes';

describe('getServicePannes', () => {
    it('maps the selected service children into panne choices', () => {
        expect(getServicePannes({
            id: 7,
            name: 'Électricité',
            children: [
                { id: 11, service_id: 7, name: 'Coupure de courant', price_range: '50 €' },
                { id: 12, service_id: 7, name: 'Prise défectueuse' },
            ],
        })).toEqual([
            { id: 11, title: 'Coupure de courant', description: '50 €' },
            { id: 12, title: 'Prise défectueuse', description: '' },
        ]);
    });

    it('returns no panne choices when the API service has no children', () => {
        expect(getServicePannes({ id: 7, name: 'Électricité' })).toEqual([]);
    });
});
