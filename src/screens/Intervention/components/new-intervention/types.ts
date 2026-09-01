import type { Address, Service } from '../../../../store/api/api.types';
import type { SelectedAddressLocation } from '../../utils/googlePlaceAddress';

export interface StepNavigationProps {
    onNext: () => void;
    onPrevious?: () => void;
}

export interface ServiceStepProps extends StepNavigationProps {
    service?: Service;
    problemTypes: Array<{ id: number; title: string; description?: string }>;
    servicesLoading: boolean;
    selectedProblem: number | null;
    onSelectProblem: (id: number) => void;
}

export interface DetailsStepProps extends StepNavigationProps {
    selectedTiming: string;
    onSelectTiming: (timing: string) => void;
}

export interface FullscreenMapModalProps {
    visible: boolean;
    region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
    selectedLocation: SelectedAddressLocation | null;
    isLookingUpAddress: boolean;
    onClose: () => void;
    onSelectCoordinate: (latitude: number, longitude: number) => void;
}

export interface AddressModalProps {
    visible: boolean;
    region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
    selectedLocation: SelectedAddressLocation | null;
    locationName: string;
    locationDetails: string;
    isLookingUpAddress: boolean;
    isSavingAddress: boolean;
    onClose: () => void;
    onChangeLocationName: (value: string) => void;
    onChangeLocationDetails: (value: string) => void;
    onSelectPlace: (placeId: string) => void;
    onSelectCoordinate: (latitude: number, longitude: number) => void;
    onSave: () => void;
}

export interface AddressStepProps extends StepNavigationProps {
    addresses: Address[];
    addressesLoading: boolean;
    selectedAddress: number | null;
    selectedMapRegion: FullscreenMapModalProps['region'] | null;
    isAddingAddress: boolean;
    isMapFullscreen: boolean;
    canContinue: boolean;
    addressModal: Omit<AddressModalProps, 'visible'>;
    onSelectAddress: (id: number) => void;
    onOpenAddressModal: () => void;
    onCloseAddressModal: () => void;
    onOpenMapFullscreen: () => void;
    onCloseMapFullscreen: () => void;
}

export interface SummaryStepProps extends StepNavigationProps {
    serviceName: string;
    address: string;
    timing: string;
}
