import { canContinueAddressSelection } from '../src/screens/Intervention/utils/addressFlow';

describe('canContinueAddressSelection', () => {
    it('blocks continue while searching or when no address is selected', () => {
        expect(canContinueAddressSelection({ selectedAddressId: null, isAddingAddress: false, isLookingUpAddress: false })).toBe(false);
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: true, isLookingUpAddress: false })).toBe(false);
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: false, isLookingUpAddress: true })).toBe(false);
    });

    it('allows continue with a selected address and a closed search form', () => {
        expect(canContinueAddressSelection({ selectedAddressId: 4, isAddingAddress: false, isLookingUpAddress: false })).toBe(true);
    });
});
