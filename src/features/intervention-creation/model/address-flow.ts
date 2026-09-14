interface AddressSelectionState {
    selectedAddressId: number | null;
    isAddingAddress: boolean;
    isLookingUpAddress: boolean;
}

export const canContinueAddressSelection = ({
    selectedAddressId,
    isAddingAddress,
    isLookingUpAddress,
}: AddressSelectionState) => (
    selectedAddressId !== null && !isAddingAddress && !isLookingUpAddress
);

export const formatAddressForSummary = (address?: Pick<Address, 'location_name' | 'address' | 'details'> | null, fallback = 'Adresse non sélectionnée') => {
    if (!address) return fallback;

    return [address.location_name, address.address, address.details]
        .map(value => value?.trim())
        .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index)
        .join(' · ') || fallback;
};
import type { Address } from '@entities/address/model';
