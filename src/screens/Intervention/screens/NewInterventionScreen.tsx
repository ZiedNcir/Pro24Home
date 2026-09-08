import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import ScreenContainer from '@components/ScreenContainer';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import InterventionHeader from '../components/InterventionHeader';
import StepProgress from '../components/StepProgress';
import ServiceStep from '../components/new-intervention/ServiceStep';
import DetailsStep from '../components/new-intervention/DetailsStep';
import AddressStep from '../components/new-intervention/AddressStep';
import SummaryStep from '../components/new-intervention/SummaryStep';
import { InterventionStep } from './types';
import { AppStackType } from '../../../navigation/constant/core';
import { useGetServicesQuery } from '@store/api/endpoints/auth';
import { useAddAddressMutation, useGetAddressesQuery } from '@store/api/endpoints/client';
import { selectUser } from '@store/slices/authSlice';
import { getServicePannes } from '../utils/servicePannes';
import { canContinueAddressSelection, formatAddressForSummary } from '../utils/addressFlow';
import { mapGooglePlaceToAddress, type SelectedAddressLocation } from '../utils/googlePlaceAddress';
import { fetchAddressFromCoordinates, fetchGooglePlaceDetails } from '../../../services/googlePlacesService';
import { buildInterventionPayload } from '../utils/interventionPayload';
import type { InterventionPhoto } from '../components/new-intervention/types';

export const NewInterventionScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'NewIntervention'>>();
    const navigation = useNavigation();
    const { data: servicesResponse, isLoading: servicesLoading } = useGetServicesQuery({ lang: 'fr' });
    const services = useMemo(() => servicesResponse?.data || [], [servicesResponse?.data]);
    const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(route.params?.service_id);
    const selectedService = useMemo(() => {
        const serviceName = route.params?.service_name?.toLowerCase();
        return services.find(service => service.id === selectedServiceId)
            || services.find(service => service.name.toLowerCase() === serviceName);
    }, [route.params?.service_name, selectedServiceId, services]);
    const [step, setStep] = useState<InterventionStep>(1);
    const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
    const [selectedTiming, setSelectedTiming] = useState('asap');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState<InterventionPhoto[]>([]);
    const problemTypes = useMemo(() => getServicePannes(selectedService), [selectedService]);
    const selectedProblemRecord = useMemo(
        () => problemTypes.find(problem => problem.id === selectedProblem),
        [problemTypes, selectedProblem],
    );
    const { data: addresses = [], isLoading: addressesLoading } = useGetAddressesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [addAddress, { isLoading: isSavingAddress }] = useAddAddressMutation();
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [locationName, setLocationName] = useState('');
    const [locationDetails, setLocationDetails] = useState('');
    const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [shouldReopenAddressModal, setShouldReopenAddressModal] = useState(false);
    const user = useSelector(selectUser);
    const [selectedLocation, setSelectedLocation] = useState<SelectedAddressLocation | null>(null);

    const selectedAddressRecord = useMemo(
        () => addresses.find(address => address.id === selectedAddress),
        [addresses, selectedAddress],
    );
    const canContinueAddress = canContinueAddressSelection({
        selectedAddressId: selectedAddress,
        isAddingAddress,
        isLookingUpAddress,
    });
    const selectedMapRegion = useMemo(() => {
        const latitude = selectedLocation?.latitude || selectedAddressRecord?.latitude;
        const longitude = selectedLocation?.longitude || selectedAddressRecord?.longitude;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
        return { latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 };
    }, [selectedAddressRecord, selectedLocation]);
    const mapRegion = selectedMapRegion || { latitude: 36.8065, longitude: 10.1815, latitudeDelta: 0.12, longitudeDelta: 0.12 };

    useEffect(() => {
        if (selectedAddress === null && addresses.length > 0) {
            const defaultAddress = addresses.find(address => address.is_default) || addresses[0];
            if (defaultAddress) setSelectedAddress(defaultAddress.id);
        }
    }, [addresses, selectedAddress]);

    const goNext = () => {
        if (step === 1 && selectedProblem === null) return;
        if (step === 3 && !canContinueAddress) return;
        if (step < 4) setStep((step + 1) as InterventionStep);
    };

    const goPrevious = () => {
        if (step > 1) setStep((step - 1) as InterventionStep);
    };

    const addPhoto = async (source: 'camera' | 'gallery') => {
        const picker = source === 'camera' ? launchCamera : launchImageLibrary;
        const result = await picker({ mediaType: 'photo', selectionLimit: 1, quality: 0.8, ...(source === 'camera' ? { cameraType: 'back', saveToPhotos: false } : {}) });
        if (result.didCancel) return;
        if (result.errorCode) {
            Toast.show(result.errorMessage || 'Impossible d’ajouter cette photo.', { type: 'danger', placement: 'bottom' });
            return;
        }
        const asset = result.assets?.[0];
        const uri = asset?.uri;
        if (!uri) return;
        setPhotos(current => [...current, {
            uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `intervention-photo-${Date.now()}.jpg`,
        }].slice(0, 3));
    };

    const closeAddressModal = () => {
        setIsAddingAddress(false);
        setShouldReopenAddressModal(false);
        setIsMapFullscreen(false);
        setSelectedLocation(null);
        setLocationName('');
        setLocationDetails('');
        setIsLookingUpAddress(false);
    };

    const selectPlace = async (placeId: string) => {
        setIsLookingUpAddress(true);
        try {
            const details = await fetchGooglePlaceDetails(placeId);
            setSelectedLocation(mapGooglePlaceToAddress(details));
        } catch (error: any) {
            Toast.show(error?.message || 'Impossible de récupérer cette adresse.', { type: 'danger', placement: 'bottom' });
        } finally {
            setIsLookingUpAddress(false);
        }
    };

    const selectCoordinate = async (latitude: number, longitude: number) => {
        setIsLookingUpAddress(true);
        try {
            const address = await fetchAddressFromCoordinates(latitude, longitude);
            setSelectedLocation({ address, latitude, longitude });
        } catch {
            setSelectedLocation({ address: 'Adresse sélectionnée sur la carte', latitude, longitude });
        } finally {
            setIsLookingUpAddress(false);
        }
    };

    const saveAddress = async () => {
        if (!selectedLocation) return;
        try {
            const savedAddress = await addAddress({
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                address: selectedLocation.address,
                location_name: locationName.trim() || 'Mon adresse',
                details: locationDetails.trim(),
                phone: user?.phone_number || '',
                zone_id: 1,
                type: 'maison',
            }).unwrap();
            setSelectedAddress(savedAddress.id);
            closeAddressModal();
        } catch (error: any) {
            Toast.show(error?.data?.message || error?.message || 'Impossible d’enregistrer cette adresse.', { type: 'danger', placement: 'bottom' });
        }
    };

    const closeMapFullscreen = () => {
        setIsMapFullscreen(false);
        if (shouldReopenAddressModal) {
            setShouldReopenAddressModal(false);
            setIsAddingAddress(true);
        }
    };

    return (
        <ScreenContainer
            mode="light"
            scrollable
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
            contentContainerStyle={{ paddingBottom: verticalScale(30) }}
        >
            <InterventionHeader />
            <StepProgress currentStep={step} />

            {step === 1 ? (
                <ServiceStep
                    service={selectedService}
                    services={services}
                    selectedServiceId={selectedService?.id}
                    problemTypes={problemTypes}
                    servicesLoading={servicesLoading}
                    selectedProblem={selectedProblem}
                    onSelectProblem={setSelectedProblem}
                    onSelectService={(serviceId) => {
                        setSelectedServiceId(serviceId);
                        setSelectedProblem(null);
                    }}
                    onNext={goNext}
                />
            ) : null}
            {step === 2 ? (
                <DetailsStep
                    description={description}
                    photos={photos}
                    selectedTiming={selectedTiming}
                    selectedDate={selectedDate}
                    onChangeDescription={setDescription}
                    onAddPhoto={(source) => addPhoto(source).catch(() => undefined)}
                    onRemovePhoto={(index) => setPhotos(current => current.filter((_, photoIndex) => photoIndex !== index))}
                    onSelectTiming={setSelectedTiming}
                    onSelectDate={setSelectedDate}
                    onNext={goNext}
                    onPrevious={goPrevious}
                />
            ) : null}
            {step === 3 ? (
                <AddressStep
                    addresses={addresses}
                    addressesLoading={addressesLoading}
                    selectedAddress={selectedAddress}
                    selectedMapRegion={selectedMapRegion}
                    onSelectAddress={setSelectedAddress}
                    onOpenAddressModal={() => setIsAddingAddress(true)}
                    onPrevious={goPrevious}
                    onNext={goNext}
                    canContinue={canContinueAddress}
                    addressModal={{
                        region: mapRegion,
                        selectedLocation,
                        isSavingAddress,
                        isLookingUpAddress,
                        locationName,
                        locationDetails,
                        onClose: closeAddressModal,
                        onChangeLocationName: setLocationName,
                        onChangeLocationDetails: setLocationDetails,
                        onSelectPlace: selectPlace,
                        onSelectCoordinate: selectCoordinate,
                        onOpenMapFullscreen: () => {
                            setShouldReopenAddressModal(true);
                            setIsAddingAddress(false);
                            setIsMapFullscreen(true);
                        },
                        onSave: saveAddress,
                    }}
                    isAddingAddress={isAddingAddress}
                    onCloseAddressModal={closeAddressModal}
                    isMapFullscreen={isMapFullscreen}
                    onOpenMapFullscreen={() => setIsMapFullscreen(true)}
                    onCloseMapFullscreen={closeMapFullscreen}
                />
            ) : null}
            {step === 4 ? (
                <SummaryStep
                    serviceName={selectedService?.name || route.params?.service_name || 'Service sélectionné'}
                    description={description}
                    photos={photos}
                    address={formatAddressForSummary(selectedAddressRecord, selectedLocation?.address || 'Adresse non sélectionnée')}
                    timing={selectedTiming}
                    scheduledDate={selectedDate}
                    onNext={() => {
                        if (!selectedService?.id || !selectedAddressRecord?.id || !selectedProblemRecord) return;
                        (navigation as any).navigate('PriceEstimation', {
                            intervention: buildInterventionPayload({
                                serviceId: selectedService.id,
                                addressId: selectedAddressRecord.id,
                                problemTitle: selectedProblemRecord.title,
                                problemDescription: selectedProblemRecord.description,
                                description,
                                timing: selectedTiming,
                                photos,
                            }),
                        });
                    }}
                    onPrevious={goPrevious}
                />
            ) : null}
        </ScreenContainer>
    );
};
