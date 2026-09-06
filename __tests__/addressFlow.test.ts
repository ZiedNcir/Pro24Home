import { canContinueAddressSelection, formatAddressForSummary } from '../src/screens/Intervention/utils/addressFlow';

describe('canContinueAddressSelection', () => {
    it('blocks continue while searching or when no address is selected', () => {
        expect(canContinueAddressSelection({ selectedAddressId: null, isAddingAddress: false, isLookingUpAddress: false })).toBe(false);
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: true, isLookingUpAddress: false })).toBe(false);
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: false, isLookingUpAddress: true })).toBe(false);
    });

    it('allows continue with a selected address and a closed search form', () => {
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: false, isLookingUpAddress: false })).toBe(true);
    });

    it('formats the selected address with real location data', () => {
        expect(formatAddressForSummary({ location_name: 'Maison', address: '12 rue de Paris', details: 'Étage 2' })).toBe('Maison · 12 rue de Paris · Étage 2');
        expect(formatAddressForSummary(null, 'Adresse sélectionnée sur la carte')).toBe('Adresse sélectionnée sur la carte');
    });
});
