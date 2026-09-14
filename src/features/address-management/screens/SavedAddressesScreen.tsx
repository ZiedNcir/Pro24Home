import React, { useMemo, useState } from 'react';
import { Modal, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Toast } from '@core/notifications/toast';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import InterventionHeader from '@screens/Intervention/components/InterventionHeader';
import AddressModal from '@features/intervention-creation/ui/new-intervention/AddressModal';
import FullscreenMapModal from '@features/intervention-creation/ui/new-intervention/FullscreenMapModal';
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
} from '@entities/address/api/address.api';
import { useAppSelector } from '@store/hooks';
import { selectUser } from '@store/slices/authSlice';
import { fetchGooglePlaceDetails } from '@core/maps/google-places-client';
import { fetchAddressFromCoordinates } from '@core/maps/google-geocoding-client';
import {
  mapGooglePlaceToAddress,
  type SelectedAddressLocation,
} from '@features/intervention-creation/model/google-place-address';
import { colors } from '@theme/index';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import type { Address } from '@store/api/api.types';

const toCoordinate = (value: number | string | undefined, fallback: number) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : fallback;
};

const SavedAddressesScreen = () => {
  const navigation = useNavigation<any>();
  const {
    data: addresses = [],
    isLoading,
    isFetching,
  } = useGetAddressesQuery();
  const [addAddress, { isLoading: isSavingAddress }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const user = useAppSelector(selectUser);
  const [mapOpen, setMapOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addMapOpen, setAddMapOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<SelectedAddressLocation | null>(
    null,
  );
  const [locationName, setLocationName] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const selectedAddress = useMemo<Address | undefined>(() => {
    if (!addresses.length) return undefined;
    return (
      addresses.find(address => address.id === selectedId) ||
      addresses.find(address => address.is_default) ||
      addresses[0]
    );
  }, [addresses, selectedId]);

  const selectedLocation = selectedAddress
    ? {
        address:
          selectedAddress.address ||
          selectedAddress.location_name ||
          'Adresse sélectionnée',
        latitude: toCoordinate(selectedAddress.latitude, 36.8065),
        longitude: toCoordinate(selectedAddress.longitude, 10.1815),
      }
    : {
        address: 'Adresse sélectionnée',
        latitude: 36.8065,
        longitude: 10.1815,
      };

  const mapRegion = {
    ...selectedLocation,
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  };

  const handleDelete = (address: Address) => setAddressToDelete(address);

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    await deleteAddress(addressToDelete.id);
    setAddressToDelete(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddMapOpen(false);
    setNewAddress(null);
    setLocationName('');
    setLocationDetails('');
    setIsLookingUpAddress(false);
  };

  const selectPlace = async (placeId: string) => {
    setIsLookingUpAddress(true);
    try {
      const details = await fetchGooglePlaceDetails(placeId);
      setNewAddress(mapGooglePlaceToAddress(details));
    } catch (error: any) {
      Toast.show(error?.message || 'Impossible de récupérer cette adresse.', {
        type: 'danger',
        placement: 'bottom',
      });
    } finally {
      setIsLookingUpAddress(false);
    }
  };

  const selectCoordinate = async (latitude: number, longitude: number) => {
    setIsLookingUpAddress(true);
    try {
      const address = await fetchAddressFromCoordinates(latitude, longitude);
      setNewAddress({ address, latitude, longitude });
    } catch {
      setNewAddress({
        address: 'Adresse sélectionnée sur la carte',
        latitude,
        longitude,
      });
    } finally {
      setIsLookingUpAddress(false);
    }
  };

  const saveNewAddress = async () => {
    if (!newAddress) return;
    try {
      await addAddress({
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        address: newAddress.address,
        location_name: locationName.trim() || 'Mon adresse',
        details: locationDetails.trim(),
        phone: user?.phone_number || '',
        zone_id: 1,
        type: 'maison',
      }).unwrap();
      closeAddModal();
    } catch (error: any) {
      Toast.show(
        error?.data?.message ||
          error?.message ||
          'Impossible d’enregistrer cette adresse.',
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
      contentContainerStyle={{ paddingBottom: verticalScale(110) }}
    >
      <InterventionHeader title="Mes adresses" showHelp={false} />
      <Text
        variant="regular"
        color="gray600"
        style={{ marginTop: verticalScale(10) }}
      >
        Gérez les adresses utilisées pour localiser vos interventions.
      </Text>

      {isLoading || isFetching ? (
        <LoadingBox>
          <Text variant="regular" color="gray600">
            Chargement de vos adresses…
          </Text>
        </LoadingBox>
      ) : null}

      {selectedAddress ? (
        <MapCard
          accessibilityRole="button"
          accessibilityLabel="Ouvrir la carte"
          onPress={() => setMapOpen(true)}
          activeOpacity={0.9}
        >
          <AddressMap
            initialRegion={mapRegion}
            region={mapRegion}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={selectedLocation} pinColor={colors.primary} />
          </AddressMap>
          <MapCallout>
            <SvgIcon
              name="fa-map-marker-alt"
              size={14}
              color={colors.primary}
            />
            <Text variant="bold" color="black" fontSize={11} numberOfLines={1}>
              {selectedAddress.location_name || selectedAddress.address}
            </Text>
          </MapCallout>
          <OpenMap>
            <SvgIcon
              name="fa-map-marked-alt"
              size={14}
              color={colors.primary}
            />
            <Text variant="bold" color="black" fontSize={11}>
              Ouvrir la carte
            </Text>
          </OpenMap>
        </MapCard>
      ) : null}

      <SectionTitle>ADRESSES ENREGISTRÉES</SectionTitle>
      {!isLoading && !addresses.length ? (
        <EmptyState>
          <SvgIcon name="fa-map-marker-alt" size={22} color={colors.primary} />
          <Text
            variant="regular"
            color="gray600"
            style={{ marginTop: verticalScale(8) }}
          >
            Vous n’avez pas encore d’adresse enregistrée.
          </Text>
        </EmptyState>
      ) : null}

      {addresses.map(address => (
        <AddressItem
          key={address.id}
          address={address}
          selected={selectedAddress?.id === address.id}
          onSelect={() => setSelectedId(address.id)}
          onEdit={() => navigation.navigate('AddAddress')}
          onDelete={() => handleDelete(address)}
        />
      ))}

      <AddButton onPress={() => setAddModalOpen(true)} activeOpacity={0.85}>
        <SvgIcon name="fa-plus" size={15} color={colors.white} />
        <Text variant="bold" color="white" fontSize={14}>
          Ajouter une adresse
        </Text>
      </AddButton>

      <FullscreenMapModal
        visible={mapOpen}
        region={mapRegion}
        selectedLocation={selectedLocation}
        isLookingUpAddress={false}
        onClose={() => setMapOpen(false)}
        onSelectCoordinate={() => undefined}
      />

      <AddressModal
        visible={addModalOpen}
        region={
          addMapOpen
            ? {
                latitude: newAddress?.latitude || 36.8065,
                longitude: newAddress?.longitude || 10.1815,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }
            : mapRegion
        }
        selectedLocation={newAddress}
        locationName={locationName}
        locationDetails={locationDetails}
        isLookingUpAddress={isLookingUpAddress}
        isSavingAddress={isSavingAddress}
        onClose={closeAddModal}
        onChangeLocationName={setLocationName}
        onChangeLocationDetails={setLocationDetails}
        onSelectPlace={selectPlace}
        onSelectCoordinate={selectCoordinate}
        onOpenMapFullscreen={() => setAddMapOpen(true)}
        onSave={saveNewAddress}
      />
      <FullscreenMapModal
        visible={addMapOpen}
        region={{
          latitude: newAddress?.latitude || 36.8065,
          longitude: newAddress?.longitude || 10.1815,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        selectedLocation={newAddress}
        isLookingUpAddress={isLookingUpAddress}
        onClose={() => setAddMapOpen(false)}
        onSelectCoordinate={selectCoordinate}
        onSearchAddress={() => {
          setAddMapOpen(false);
          setAddModalOpen(true);
        }}
      />

      <Modal
        visible={Boolean(addressToDelete)}
        transparent
        animationType="fade"
        onRequestClose={() => setAddressToDelete(null)}
      >
        <ConfirmationBackdrop>
          <ConfirmationModal>
            <ConfirmationIcon>
              <SvgIcon name="fa-trash" size={22} color={colors.danger} />
            </ConfirmationIcon>
            <ConfirmationTitle variant="bold" color="black" fontSize={18}>
              Supprimer cette adresse ?
            </ConfirmationTitle>
            <ConfirmationMessage
              variant="regular"
              color="gray600"
              fontSize={13}
            >
              Cette adresse sera définitivement supprimée de votre compte.
            </ConfirmationMessage>
            <ConfirmationActions>
              <CancelButton
                onPress={() => setAddressToDelete(null)}
                activeOpacity={0.8}
              >
                <Text variant="bold" color="gray700" fontSize={13}>
                  Annuler
                </Text>
              </CancelButton>
              <DeleteButton onPress={confirmDelete} activeOpacity={0.8}>
                <Text variant="bold" color="white" fontSize={13}>
                  Supprimer
                </Text>
              </DeleteButton>
            </ConfirmationActions>
          </ConfirmationModal>
        </ConfirmationBackdrop>
      </Modal>
    </ScreenContainer>
  );
};

const AddressItem = ({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <AddressCard selected={selected} onPress={onSelect} activeOpacity={0.85}>
    <AddressIcon>
      <SvgIcon name="fa-home" size={17} color={colors.primary} />
    </AddressIcon>
    <AddressContent>
      <AddressTitleRow>
        <Text variant="bold" color="black" fontSize={14}>
          {address.location_name || address.type || 'Adresse'}
        </Text>
        {address.is_default ? (
          <DefaultBadge>
            <Text variant="bold" color="primary" fontSize={10}>
              PAR DÉFAUT
            </Text>
          </DefaultBadge>
        ) : null}
      </AddressTitleRow>
      <Text variant="regularSmall" color="gray700" numberOfLines={1}>
        {address.address || 'Adresse non renseignée'}
      </Text>
      {address.details ? (
        <Text variant="regularSmall" color="gray600" numberOfLines={1}>
          {address.details}
        </Text>
      ) : null}
    </AddressContent>
    <ActionColumn>
      <ActionButton onPress={onEdit} accessibilityLabel="Modifier l’adresse">
        <SvgIcon name="fa-pen" size={14} color={colors.gray600} />
      </ActionButton>
      <ActionButton onPress={onDelete} accessibilityLabel="Supprimer l’adresse">
        <SvgIcon name="fa-trash" size={14} color={colors.gray600} />
      </ActionButton>
    </ActionColumn>
    {selected ? (
      <SvgIcon name="fa-check-circle" size={18} color={colors.primary} />
    ) : null}
  </AddressCard>
);

export default SavedAddressesScreen;

const LoadingBox = styled.View`
  margin-top: ${verticalScale(18)}px;
  padding: ${verticalScale(18)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: ${colors.warningLight};
  align-items: center;
`;
const MapCard = styled.TouchableOpacity`
  height: ${verticalScale(162)}px;
  margin-top: ${verticalScale(18)}px;
  overflow: hidden;
  border-radius: ${moderateScale(18)}px;
  border-width: 1px;
  border-color: ${colors.primaryLighter};
`;
const AddressMap = styled(MapView).attrs({
  provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined,
})`
  flex: 1;
`;
const MapCallout = styled.View`
  position: absolute;
  top: ${verticalScale(12)}px;
  left: ${horizontalScale(12)}px;
  right: ${horizontalScale(12)}px;
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  padding: ${verticalScale(9)}px ${horizontalScale(11)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: white;
`;
const OpenMap = styled.View`
  position: absolute;
  bottom: ${verticalScale(10)}px;
  left: ${horizontalScale(12)}px;
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  padding: ${verticalScale(8)}px ${horizontalScale(10)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: white;
`;
const SectionTitle = styled(Text).attrs({
  variant: 'bold',
  color: 'gray700',
  fontSize: 11,
})`
  margin-top: ${verticalScale(24)}px;
  margin-bottom: ${verticalScale(9)}px;
  letter-spacing: 0.5px;
`;
const EmptyState = styled.View`
  padding: ${verticalScale(24)}px;
  align-items: center;
  border-radius: ${moderateScale(16)}px;
  background-color: ${colors.gray50};
`;
const AddressCard = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(76)}px;
  margin-bottom: ${verticalScale(10)}px;
  padding: ${verticalScale(11)}px ${horizontalScale(11)}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${moderateScale(16)}px;
  border-width: 1.5px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : colors.borderLight};
  background-color: ${({ selected }) =>
    selected ? colors.warningLight : colors.white};
`;
const AddressIcon = styled.View`
  width: ${horizontalScale(36)}px;
  height: ${horizontalScale(36)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.primaryLighter};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(10)}px;
`;
const AddressContent = styled.View`
  flex: 1;
`;
const AddressTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(7)}px;
`;
const DefaultBadge = styled.View`
  padding: ${verticalScale(3)}px ${horizontalScale(6)}px;
  border-radius: ${moderateScale(6)}px;
  background-color: ${colors.primaryLighter};
`;
const ActionColumn = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${horizontalScale(5)}px;
`;
const ActionButton = styled.TouchableOpacity`
  padding: ${verticalScale(8)}px ${horizontalScale(4)}px;
`;
const AddButton = styled.TouchableOpacity`
  height: ${verticalScale(54)}px;
  margin-top: ${verticalScale(12)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: ${colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${horizontalScale(9)}px;
`;
const ConfirmationBackdrop = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${horizontalScale(24)}px;
  background-color: ${colors.overlay};
`;
const ConfirmationModal = styled.View`
  width: 100%;
  padding: ${verticalScale(24)}px ${horizontalScale(20)}px
    ${verticalScale(18)}px;
  border-radius: ${moderateScale(22)}px;
  background-color: ${colors.white};
`;
const ConfirmationIcon = styled.View`
  width: ${horizontalScale(48)}px;
  height: ${horizontalScale(48)}px;
  border-radius: ${moderateScale(16)}px;
  margin-bottom: ${verticalScale(14)}px;
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: ${colors.dangerLight};
`;
const ConfirmationTitle = styled(Text)`
  text-align: center;
`;
const ConfirmationMessage = styled(Text)`
  margin-top: ${verticalScale(8)}px;
  text-align: center;
`;
const ConfirmationActions = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
  margin-top: ${verticalScale(22)}px;
`;
const CancelButton = styled.TouchableOpacity`
  flex: 1;
  height: ${verticalScale(46)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: ${colors.borderLight};
  background-color: ${colors.white};
`;
const DeleteButton = styled.TouchableOpacity`
  flex: 1;
  height: ${verticalScale(46)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.danger};
`;
