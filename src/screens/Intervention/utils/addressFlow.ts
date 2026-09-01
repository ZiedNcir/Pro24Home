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
