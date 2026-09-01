import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toast } from 'react-native-toast-notifications';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';

import InterventionHeader from '../components/InterventionHeader';
import StepProgress from '../components/StepProgress';
import BottomActions from '../components/BottomActions';
import AddressCard from '../components/AddressCard';
import { InterventionStep } from './types';
import { colors } from '@theme/index';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppStackType } from '../../../navigation/constant/core';
import { useGetServicesQuery } from '@store/api/endpoints/auth';
import { useAddAddressMutation, useGetAddressesQuery } from '@store/api/endpoints/client';
import { selectUser } from '@store/slices/authSlice';
import { getServicePannes } from '../utils/servicePannes';
import { mapGooglePlaceToAddress } from '../utils/googlePlaceAddress';
import {
    GOOGLE_PLACES_API_KEY,
    GOOGLE_PLACES_REQUEST_HEADERS,
    GOOGLE_PLACES_SEARCH_OPTIONS,
} from '../../../config/googlePlaces';
import {
    fetchAddressFromCoordinates,
    fetchGooglePlaceDetails,
} from '../../../services/googlePlacesService';
import { canContinueAddressSelection } from '../utils/addressFlow';
import ServiceStep from '../components/new-intervention/ServiceStep';
import DetailsStep from '../components/new-intervention/DetailsStep';
import SummaryStep from '../components/new-intervention/SummaryStep';

const DEFAULT_MAP_REGION = {
    latitude: 36.8065,
    longitude: 10.1815,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
};

export const NewInterventionScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'NewIntervention'>>();
    const navigation = useNavigation();
    const { data: servicesResponse, isLoading: servicesLoading } = useGetServicesQuery({ lang: 'fr' });
    const services = useMemo(() => servicesResponse?.data || [], [servicesResponse?.data]);
    const selectedService = useMemo(() => {
        const serviceId = route.params?.service_id;
        const serviceName = route.params?.service_name?.toLowerCase();

        return services.find(service => service.id === serviceId)
            || services.find(service => service.name.toLowerCase() === serviceName);
    }, [route.params?.service_id, route.params?.service_name, services]);

    const problemTypes = useMemo(() => getServicePannes(selectedService), [selectedService]);
    const [step, setStep] = useState<InterventionStep>(1);
    const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
    const [selectedTiming, setSelectedTiming] = useState('asap');
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
    const [selectedLocation, setSelectedLocation] = useState<ReturnType<typeof mapGooglePlaceToAddress>>(null);
    const user = useSelector(selectUser);
    const selectedAddressRecord = useMemo(
        () => addresses.find(address => address.id === selectedAddress),
        [addresses, selectedAddress],
    );
    const canContinueAddress = canContinueAddressSelection({
        selectedAddressId: selectedAddress,
        isAddingAddress,
        isLookingUpAddress,
    });
    const closeAddressModal = () => {
        setIsAddingAddress(false);
        setSelectedLocation(null);
        setLocationName('');
        setLocationDetails('');
        setIsLookingUpAddress(false);
        setIsMapFullscreen(false);
    };
    const selectedMapRegion = useMemo(() => {
        const latitude = selectedLocation?.latitude || selectedAddressRecord?.latitude;
        const longitude = selectedLocation?.longitude || selectedAddressRecord?.longitude;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return null;
        }

        return {
            latitude,
            longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
        };
    }, [selectedAddressRecord, selectedLocation]);
    const modalMapRegion = selectedMapRegion || DEFAULT_MAP_REGION;

    const selectMapLocation = async (latitude: number, longitude: number) => {
        setIsLookingUpAddress(true);
        try {
            const address = await fetchAddressFromCoordinates(latitude, longitude);
            setSelectedLocation({ address, latitude, longitude });
        } catch {
            setSelectedLocation({
                address: 'Adresse sélectionnée sur la carte',
                latitude,
                longitude,
            });
        } finally {
            setIsLookingUpAddress(false);
        }
    };

    useEffect(() => {
        if (selectedAddress === null && addresses.length > 0) {
            const defaultAddress = addresses.find(address => address.is_default) || addresses[0];
            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
            }
        }
    }, [addresses, selectedAddress]);
    const goNext = () => {
        if (step === 3 && selectedAddress === null) {
            return;
        }

        if (step < 4) {
            setStep((step + 1) as InterventionStep);
            return;
        }

        //navigation.navigate('PriceEstimation' , { service_id: selectedService?.id });
    };

    const goPrevious = () => {
        if (step > 1) {
            setStep((step - 1) as InterventionStep);
        }
    };

    const saveAddress = async () => {
        if (!selectedLocation) {
            return;
        }

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
            setIsAddingAddress(false);
            setSelectedLocation(null);
            setLocationName('');
            setLocationDetails('');
        } catch (error: any) {
            Toast.show(
                error?.data?.message || error?.message || 'Impossible d’enregistrer cette adresse.',
                { type: 'danger', placement: 'bottom' },
            );
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
                    problemTypes={problemTypes}
                    servicesLoading={servicesLoading}
                    selectedProblem={selectedProblem}
                    onSelectProblem={setSelectedProblem}
                    onNext={goNext}
                />
            ) : null}

            {step === 2 ? (
                <DetailsStep
                    selectedTiming={selectedTiming}
                    onSelectTiming={setSelectedTiming}
                    onNext={goNext}
                    onPrevious={goPrevious}
                />
            ) : null}

            {step === 3 ? (
                <>
                    <SectionTitle>Où doit avoir lieu l’intervention ?</SectionTitle>

                    <AddressIntro>
                        <SvgIcon name="fa-map-marker-alt" size={18} color={colors.primary} />
                        <Text variant="regularSmall" color="gray600">
                            Sélectionnez une adresse enregistrée ou recherchez votre lieu d’intervention.
                        </Text>
                    </AddressIntro>

                    {selectedMapRegion ? (
                        <AddressMapPreview>
                            <AddressMap
                                initialRegion={selectedMapRegion}
                                region={selectedMapRegion}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                                onPress={() => setIsMapFullscreen(true)}
                                accessibilityLabel="Aperçu de l’adresse sélectionnée"
                            >
                                <Marker coordinate={selectedMapRegion} pinColor={colors.primary} />
                            </AddressMap>
                        </AddressMapPreview>
                    ) : null}

                    {addressesLoading ? (
                        <AddressLoading>
                            <ActivityIndicator color={colors.primary} />
                            <Text variant="regularSmall" color="gray600">Chargement de vos adresses...</Text>
                        </AddressLoading>
                    ) : addresses.length > 0 ? (
                        <>
                            <SmallLabel>Adresses enregistrées</SmallLabel>
                            {addresses.slice(0, 4).map(address => (
                                <AddressCard
                                    key={address.id}
                                    title={address.location_name || address.address}
                                    details={address.details || address.address}
                                    selected={selectedAddress === address.id}
                                    isDefault={address.is_default}
                                    onPress={() => setSelectedAddress(address.id)}
                                />
                            ))}
                        </>
                    ) : (
                        <EmptyAddress>Vous n’avez pas encore d’adresse enregistrée.</EmptyAddress>
                    )}

                    <AddAddressButton
                        accessibilityRole="button"
                        accessibilityLabel="Rechercher une nouvelle adresse"
                        onPress={() => {
                            setSelectedLocation(null);
                            setIsAddingAddress(true);
                        }}
                    >
                        <SvgIcon name="fa-map-marker-alt" size={14} color={colors.primary} />
                        <Text variant="bold" color="primary" fontSize={13}>
                            Rechercher une nouvelle adresse
                        </Text>
                    </AddAddressButton>

                    <Modal
                        visible={isAddingAddress}
                        transparent
                        animationType="slide"
                        onRequestClose={closeAddressModal}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ModalBackdrop>
                                <ModalKeyboardAvoider
                                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                >
                                    <TouchableWithoutFeedback>
                                        <NewAddressPanel>
                                            <ModalHandle />
                                            <ModalHeader>
                                                <PanelTitle>Ajouter une adresse</PanelTitle>
                                                <ModalCloseButton
                                                    accessibilityRole="button"
                                                    accessibilityLabel="Fermer"
                                                    onPress={closeAddressModal}
                                                >
                                                    <SvgIcon name="fa-times" size={14} color={colors.gray600} />
                                                </ModalCloseButton>
                                            </ModalHeader>

                                            <ModalScroll
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
                                            >
                                                <GooglePlacesAutocomplete
                                                    placeholder="Rechercher une adresse"
                                                    fetchDetails={false}
                                                    isNewPlacesAPI
                                                    enablePoweredByContainer={false}
                                                    keyboardShouldPersistTaps="handled"
                                                    query={{
                                                        key: GOOGLE_PLACES_API_KEY,
                                                        ...GOOGLE_PLACES_SEARCH_OPTIONS,
                                                    }}
                                                    requestUrl={{
                                                        url: 'https://places.googleapis.com',
                                                        useOnPlatform: 'all',
                                                        headers: GOOGLE_PLACES_REQUEST_HEADERS,
                                                    }}
                                                    onPress={async data => {
                                                        if (!data?.place_id) {
                                                            return;
                                                        }

                                                        setIsLookingUpAddress(true);
                                                        try {
                                                            const details = await fetchGooglePlaceDetails(data.place_id);
                                                            setSelectedLocation(mapGooglePlaceToAddress(details));
                                                        } catch (error: any) {
                                                            Toast.show(error?.message || 'Impossible de récupérer cette adresse.', {
                                                                type: 'danger',
                                                                placement: 'bottom',
                                                            });
                                                        } finally {
                                                            setIsLookingUpAddress(false);
                                                        }
                                                    }}
                                                    onNotFound={() => Toast.show('Adresse introuvable.', { type: 'warning', placement: 'bottom' })}
                                                    onFail={() => Toast.show('La recherche d’adresse est indisponible.', { type: 'danger', placement: 'bottom' })}
                                                    styles={googlePlacesStyles}
                                                    textInputProps={{
                                                        accessibilityLabel: 'Rechercher une adresse avec Google',
                                                    }}
                                                />

                                                {selectedLocation ? (
                                                    <SelectedPlace>
                                                        <SvgIcon name="fa-check-circle" size={16} color={colors.success} />
                                                        <Text variant="regularSmall" color="black" numberOfLines={2}>
                                                            {selectedLocation.address}
                                                        </Text>
                                                    </SelectedPlace>
                                                ) : null}

                                                {isAddingAddress ? (
                                                    <AddressMapPreview>
                                                        <AddressMap
                                                            initialRegion={modalMapRegion}
                                                            region={modalMapRegion}
                                                            scrollEnabled
                                                            zoomEnabled
                                                            pitchEnabled={false}
                                                            rotateEnabled={false}
                                                            onPress={event => {
                                                                const { latitude, longitude } = event.nativeEvent.coordinate;
                                                                selectMapLocation(latitude, longitude);
                                                            }}
                                                            accessibilityLabel="Aperçu de la nouvelle adresse"
                                                        >
                                                            {selectedLocation ? (
                                                                <Marker coordinate={selectedLocation} pinColor={colors.primary} />
                                                            ) : null}
                                                        </AddressMap>
                                                    </AddressMapPreview>
                                                ) : null}

                                                {isLookingUpAddress ? (
                                                    <AddressLoading>
                                                        <ActivityIndicator color={colors.primary} />
                                                        <Text variant="regularSmall" color="gray600">Récupération de l’adresse...</Text>
                                                    </AddressLoading>
                                                ) : null}

                                                <CompactInput
                                                    placeholder="Nom (ex. Maison)"
                                                    placeholderTextColor="#9A9A9A"
                                                    value={locationName}
                                                    onChangeText={setLocationName}
                                                />
                                                <CompactInput
                                                    placeholder="Complément (étage, code, bâtiment)"
                                                    placeholderTextColor="#9A9A9A"
                                                    value={locationDetails}
                                                    onChangeText={setLocationDetails}
                                                />
                                            </ModalScroll>

                                            <PanelActions>
                                                <CancelButton onPress={closeAddressModal}>
                                                    <Text variant="bold" color="black" fontSize={13}>Annuler</Text>
                                                </CancelButton>
                                                <SaveAddressButton
                                                    onPress={saveAddress}
                                                    disabled={!selectedLocation || isSavingAddress || isLookingUpAddress}
                                                    activeOpacity={0.85}
                                                >
                                                    {isSavingAddress ? <ActivityIndicator color={colors.white} /> : (
                                                        <Text variant="bold" color="white" fontSize={13}>Enregistrer</Text>
                                                    )}
                                                </SaveAddressButton>
                                            </PanelActions>
                                        </NewAddressPanel>
                                    </TouchableWithoutFeedback>
                                </ModalKeyboardAvoider>
                            </ModalBackdrop>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <Modal
                        visible={isMapFullscreen}
                        animationType="slide"
                        onRequestClose={() => setIsMapFullscreen(false)}
                    >
                        <FullscreenMapContainer>
                            <FullscreenMap
                                initialRegion={modalMapRegion}
                                mapType="standard"
                                showsCompass
                                showsScale
                                showsBuildings
                                showsPointsOfInterests
                                showsTraffic={false}
                                zoomEnabled
                                scrollEnabled
                                rotateEnabled
                                pitchEnabled
                                zoomControlEnabled
                                toolbarEnabled
                                onPress={event => {
                                    const { latitude, longitude } = event.nativeEvent.coordinate;
                                    selectMapLocation(latitude, longitude);
                                }}
                                accessibilityLabel="Carte plein écran pour choisir une adresse"
                            >
                                {selectedLocation ? (
                                    <Marker coordinate={selectedLocation} pinColor={colors.primary} />
                                ) : null}
                            </FullscreenMap>

                            <FullscreenMapHeader>
                                <MapCloseButton
                                    accessibilityRole="button"
                                    accessibilityLabel="Fermer la carte"
                                    onPress={() => setIsMapFullscreen(false)}
                                >
                                    <SvgIcon name="fa-times" size={16} color={colors.black} />
                                </MapCloseButton>
                                <MapHeaderTitle>Choisir sur la carte</MapHeaderTitle>
                                <MapSpacer />
                            </FullscreenMapHeader>

                            <FullscreenMapFooter>
                                <Text variant="regularSmall" color="gray600">
                                    Touchez un point pour placer le repère. Vous pouvez zoomer et déplacer la carte.
                                </Text>
                                <MapConfirmButton
                                    onPress={() => setIsMapFullscreen(false)}
                                    disabled={!selectedLocation || isLookingUpAddress}
                                >
                                    <Text variant="bold" color="white" fontSize={14}>Valider cette position</Text>
                                </MapConfirmButton>
                            </FullscreenMapFooter>
                        </FullscreenMapContainer>
                    </Modal>

                    {canContinueAddress ? (
                        <BottomActions
                            primaryTitle="Continuer"
                            onPrimaryPress={goNext}
                            onSecondaryPress={goPrevious}
                        />
                    ) : null}
                </>
            ) : null}

            {step === 4 ? (
                <SummaryStep
                    serviceName={selectedService?.name || route.params?.service_name || 'Service sélectionné'}
                    address={selectedAddressRecord?.address || 'Adresse non sélectionnée'}
                    timing={selectedTiming}
                    onNext={() => navigation.navigate('PriceEstimation', { service_id: selectedService?.id })}
                    onPrevious={goPrevious}
                />
            ) : null}
        </ScreenContainer>
    );
};


const SectionTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const AddressIntro = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  padding: ${verticalScale(12)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: #fff5ef;
  margin-bottom: ${verticalScale(16)}px;
`;

const AddressLoading = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
  padding-vertical: ${verticalScale(14)}px;
`;

const AddressMapPreview = styled.View`
  height: ${verticalScale(150)}px;
  overflow: hidden;
  border-radius: ${moderateScale(16)}px;
  margin-bottom: ${verticalScale(16)}px;
  background-color: #eef1ec;
`;

const AddressMap = styled(MapView)`
  flex: 1;
`;

const FullscreenMapContainer = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;

const FullscreenMap = styled(MapView)`
  flex: 1;
`;

const FullscreenMapHeader = styled.View`
  position: absolute;
  top: ${verticalScale(18)}px;
  left: ${horizontalScale(18)}px;
  right: ${horizontalScale(18)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MapCloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${horizontalScale(21)}px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  shadow-color: #000000;
  shadow-opacity: 0.16;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

const MapHeaderTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 15,
})`
  background-color: ${Colors.white};
  padding: ${verticalScale(10)}px ${horizontalScale(16)}px;
  border-radius: ${moderateScale(18)}px;
`;

const MapSpacer = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
`;

const FullscreenMapFooter = styled.View`
  position: absolute;
  left: ${horizontalScale(18)}px;
  right: ${horizontalScale(18)}px;
  bottom: ${verticalScale(22)}px;
  padding: ${verticalScale(14)}px;
  border-radius: ${moderateScale(16)}px;
  background-color: ${Colors.white};
  shadow-color: #000000;
  shadow-opacity: 0.16;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
  elevation: 4;
`;

const MapConfirmButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: ${verticalScale(48)}px;
  margin-top: ${verticalScale(12)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  justify-content: center;
  align-items: center;
`;

const EmptyAddress = styled(Text).attrs({
    variant: 'regularSmall',
    color: 'gray600',
})`
  padding: ${verticalScale(14)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: #f7f7f7;
`;

const NewAddressPanel = styled.View`
  padding: ${verticalScale(12)}px ${horizontalScale(18)}px ${verticalScale(20)}px;
  border-top-left-radius: ${moderateScale(22)}px;
  border-top-right-radius: ${moderateScale(22)}px;
  background-color: ${Colors.white};
  max-height: 88%;
`;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.42);
`;

const ModalKeyboardAvoider = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: flex-end;
`;

const ModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  background-color: #d9d9d9;
  align-self: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ModalCloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;

const ModalScroll = styled.ScrollView`
  flex-grow: 0;
`;

const PanelTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 13,
})`
  margin-bottom: ${verticalScale(10)}px;
`;

const SelectedPlace = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  padding: ${verticalScale(10)}px;
  margin-top: ${verticalScale(8)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: #eef9f1;
`;

const CompactInput = styled.TextInput`
  min-height: ${verticalScale(44)}px;
  border-radius: ${moderateScale(10)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  background-color: ${Colors.white};
  padding-horizontal: ${horizontalScale(12)}px;
  color: ${Colors.black};
  margin-top: ${verticalScale(8)}px;
`;

const PanelActions = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
  margin-top: ${verticalScale(12)}px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  height: ${verticalScale(46)}px;
  border-radius: ${moderateScale(10)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
`;

const SaveAddressButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 1.4;
  height: ${verticalScale(46)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  justify-content: center;
  align-items: center;
`;

const googlePlacesStyles = {
    container: { flex: 0 },
    textInput: {
        height: verticalScale(44),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: '#e5e5e5',
        backgroundColor: Colors.white,
        color: Colors.black,
        paddingHorizontal: horizontalScale(12),
        fontSize: 13,
    },
    listView: {
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderRadius: moderateScale(10),
        marginTop: verticalScale(4),
        backgroundColor: Colors.white,
    },
    row: {
        padding: horizontalScale(12),
    },
    description: {
        color: Colors.black,
        fontSize: 13,
    },
};

const SmallLabel = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 12,
})`
  margin-bottom: ${verticalScale(8)}px;
`;

const AddAddressButton = styled.TouchableOpacity`
  height: ${verticalScale(48)}px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${colors.primary};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  margin-top: ${verticalScale(10)}px;
`;
