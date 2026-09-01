import React from 'react';
import { ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import AddressCard from '../AddressCard';
import BottomActions from '../BottomActions';
import AddressModal from './AddressModal';
import FullscreenMapModal from './FullscreenMapModal';
import type { AddressStepProps } from './types';

const DEFAULT_MAP_REGION = { latitude: 36.8065, longitude: 10.1815, latitudeDelta: 0.12, longitudeDelta: 0.12 };

const AddressStep: React.FC<AddressStepProps> = ({
    addresses,
    addressesLoading,
    selectedAddress,
    selectedMapRegion,
    isAddingAddress,
    isMapFullscreen,
    canContinue,
    addressModal,
    onSelectAddress,
    onOpenAddressModal,
    onCloseAddressModal,
    onOpenMapFullscreen,
    onCloseMapFullscreen,
    onNext,
    onPrevious,
}) => {
    const region = selectedMapRegion || DEFAULT_MAP_REGION;
    const selectedLocation = addressModal.selectedLocation;

    return (
        <>
            <SectionTitle>Où doit avoir lieu l’intervention ?</SectionTitle>
            <AddressIntro>
                <SvgIcon name="fa-map-marker-alt" size={18} color={colors.primary} />
                <Text variant="regularSmall" color="gray600">Sélectionnez une adresse enregistrée ou recherchez votre lieu d’intervention.</Text>
            </AddressIntro>

            {selectedMapRegion ? (
                <AddressMapPreview>
                    <AddressMap initialRegion={region} region={region} scrollEnabled={false} zoomEnabled={false} pitchEnabled={false} rotateEnabled={false} onPress={onOpenMapFullscreen} accessibilityLabel="Aperçu de l’adresse sélectionnée">
                        <Marker coordinate={region} pinColor={colors.primary} />
                    </AddressMap>
                </AddressMapPreview>
            ) : null}

            {addressesLoading ? (
                <AddressLoading><ActivityIndicator color={colors.primary} /><Text variant="regularSmall" color="gray600">Chargement de vos adresses...</Text></AddressLoading>
            ) : addresses.length > 0 ? (
                <>
                    <SmallLabel>Adresses enregistrées</SmallLabel>
                    {addresses.slice(0, 4).map(address => (
                        <AddressCard key={address.id} title={address.location_name || address.address} details={address.details || address.address} selected={selectedAddress === address.id} isDefault={address.is_default} onPress={() => onSelectAddress(address.id)} />
                    ))}
                </>
            ) : <EmptyAddress>Vous n’avez pas encore d’adresse enregistrée.</EmptyAddress>}

            <AddAddressButton accessibilityRole="button" accessibilityLabel="Rechercher une nouvelle adresse" onPress={onOpenAddressModal}>
                <SvgIcon name="fa-map-marker-alt" size={14} color={colors.primary} />
                <Text variant="bold" color="primary" fontSize={13}>Rechercher une nouvelle adresse</Text>
            </AddAddressButton>

            <AddressModal {...addressModal} visible={isAddingAddress} region={region} onClose={onCloseAddressModal} />
            <FullscreenMapModal visible={isMapFullscreen} region={region} selectedLocation={selectedLocation} isLookingUpAddress={addressModal.isLookingUpAddress} onClose={onCloseMapFullscreen} onSelectCoordinate={addressModal.onSelectCoordinate} />

            {canContinue ? <BottomActions primaryTitle="Continuer" onPrimaryPress={onNext} onSecondaryPress={onPrevious} /> : null}
        </>
    );
};

export default AddressStep;

const SectionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`margin-bottom: ${verticalScale(12)}px; margin-top: ${verticalScale(12)}px;`;
const AddressIntro = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(8)}px; padding: ${verticalScale(12)}px; border-radius: ${moderateScale(12)}px; background-color: #fff5ef; margin-bottom: ${verticalScale(16)}px;`;
const AddressLoading = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px; padding-vertical: ${verticalScale(14)}px;`;
const AddressMapPreview = styled.View`height: ${verticalScale(150)}px; overflow: hidden; border-radius: ${moderateScale(16)}px; margin-bottom: ${verticalScale(16)}px; background-color: #eef1ec;`;
const AddressMap = styled(MapView)`flex: 1;`;
const EmptyAddress = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`padding: ${verticalScale(14)}px; border-radius: ${moderateScale(12)}px; background-color: #f7f7f7;`;
const SmallLabel = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 12 })`margin-bottom: ${verticalScale(8)}px;`;
const AddAddressButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; border-radius: 12px; border-width: 1px; border-color: ${colors.primary}; flex-direction: row; justify-content: center; align-items: center; gap: ${horizontalScale(8)}px; margin-top: ${verticalScale(10)}px;`;
