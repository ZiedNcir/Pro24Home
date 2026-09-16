import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toast } from '@core/notifications/toast';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { colors } from '@theme';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import {
  GOOGLE_PLACES_API_KEY,
  GOOGLE_PLACES_REQUEST_HEADERS,
  GOOGLE_PLACES_SEARCH_OPTIONS,
} from '../../../../config/googlePlaces';
import type { AddressModalProps } from './types';

const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  region,
  selectedLocation,
  locationName,
  locationDetails,
  isLookingUpAddress,
  isSavingAddress,
  onClose,
  onChangeLocationName,
  onChangeLocationDetails,
  onSelectPlace,
  onOpenMapFullscreen,
  onSave,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
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
                  onPress={onClose}
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
                  onPress={data =>
                    data?.place_id && onSelectPlace(data.place_id)
                  }
                  onNotFound={() =>
                    Toast.show('Adresse introuvable.', {
                      type: 'warning',
                      placement: 'bottom',
                    })
                  }
                  onFail={() =>
                    Toast.show('La recherche d’adresse est indisponible.', {
                      type: 'danger',
                      placement: 'bottom',
                    })
                  }
                  styles={googlePlacesStyles}
                  textInputProps={{
                    accessibilityLabel: 'Rechercher une adresse avec Google',
                  }}
                />

                {selectedLocation ? (
                  <SelectedPlace>
                    <SvgIcon
                      name="fa-check-circle"
                      size={16}
                      color={colors.success}
                    />
                    <Text
                      variant="regularSmall"
                      color="black"
                      numberOfLines={2}
                    >
                      {selectedLocation.address}
                    </Text>
                  </SelectedPlace>
                ) : null}

                <AddressMapPreview>
                  <AddressMap
                    initialRegion={region}
                    region={region}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    accessibilityLabel="Aperçu de la nouvelle adresse"
                  >
                    {selectedLocation ? (
                      <AddressMarker
                        coordinate={selectedLocation}
                        pinColor={colors.primary}
                      />
                    ) : null}
                  </AddressMap>
                  <PreviewOpenOverlay
                    accessibilityRole="button"
                    accessibilityLabel="Ouvrir la carte en plein écran"
                    onPress={onOpenMapFullscreen}
                  >
                    <SvgIcon
                      name="fa-map-marked-alt"
                      size={14}
                      color={colors.primary}
                    />
                    <Text variant="bold" color="black" fontSize={11}>
                      Ouvrir la carte
                    </Text>
                  </PreviewOpenOverlay>
                </AddressMapPreview>

                {isLookingUpAddress ? (
                  <AddressLoading>
                    <ActivityIndicator color={colors.primary} />
                    <Text variant="regularSmall" color="gray600">
                      Récupération de l’adresse...
                    </Text>
                  </AddressLoading>
                ) : null}

                <CompactInput
                  placeholder="Nom (ex. Maison)"
                  placeholderTextColor={colors.gray500}
                  value={locationName}
                  onChangeText={onChangeLocationName}
                />
                <CompactInput
                  placeholder="Complément (étage, code, bâtiment)"
                  placeholderTextColor={colors.gray500}
                  value={locationDetails}
                  onChangeText={onChangeLocationDetails}
                />
              </ModalScroll>

              <PanelActions>
                <CancelButton onPress={onClose}>
                  <Text variant="bold" color="black" fontSize={13}>
                    Annuler
                  </Text>
                </CancelButton>
                <SaveAddressButton
                  onPress={onSave}
                  disabled={
                    !selectedLocation || isSavingAddress || isLookingUpAddress
                  }
                  activeOpacity={0.85}
                >
                  {isSavingAddress ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text variant="bold" color="white" fontSize={13}>
                      Enregistrer
                    </Text>
                  )}
                </SaveAddressButton>
              </PanelActions>
            </NewAddressPanel>
          </TouchableWithoutFeedback>
        </ModalKeyboardAvoider>
      </ModalBackdrop>
    </TouchableWithoutFeedback>
  </Modal>
);

export default AddressModal;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: ${colors.overlay};
`;
const ModalKeyboardAvoider = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: flex-end;
`;
const NewAddressPanel = styled.View`
  padding: ${verticalScale(12)}px ${horizontalScale(18)}px
    ${verticalScale(20)}px;
  border-top-left-radius: ${moderateScale(22)}px;
  border-top-right-radius: ${moderateScale(22)}px;
  background-color: ${colors.white};
  max-height: 88%;
`;
const ModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  background-color: ${colors.gray300};
  align-self: center;
  margin-bottom: ${verticalScale(12)}px;
`;
const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const PanelTitle = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 13,
})`
  margin-bottom: ${verticalScale(10)}px;
`;
const ModalCloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  background-color: ${colors.gray100};
  justify-content: center;
  align-items: center;
`;
const ModalScroll = styled.ScrollView`
  flex-grow: 0;
`;
const SelectedPlace = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  padding: ${verticalScale(10)}px;
  margin-top: ${verticalScale(8)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: ${colors.successLight};
`;
const AddressMapPreview = styled.View`
  height: ${verticalScale(150)}px;
  overflow: hidden;
  border-radius: ${moderateScale(16)}px;
  margin-top: ${verticalScale(12)}px;
  border-width: 2px;
  border-color: ${colors.danger};
  background-color: ${colors.surfaceVariant};
`;
const AddressMap = styled(MapView).attrs({
  provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined,
})`
  flex: 1;
`;
const PreviewOpenOverlay = styled.TouchableOpacity`
  position: absolute;
  right: ${horizontalScale(10)}px;
  bottom: ${verticalScale(10)}px;
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  padding: ${verticalScale(8)}px ${horizontalScale(10)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: ${colors.white};
`;
const AddressMarker = Marker;
const AddressLoading = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
  padding-vertical: ${verticalScale(14)}px;
`;
const CompactInput = styled.TextInput`
  min-height: ${verticalScale(44)}px;
  border-radius: ${moderateScale(10)}px;
  border-width: 1px;
  border-color: ${colors.borderLight};
  background-color: ${colors.white};
  padding-horizontal: ${horizontalScale(12)}px;
  color: ${colors.black};
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
  border-color: ${colors.borderLight};
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
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    color: colors.black,
    paddingHorizontal: horizontalScale(12),
    fontSize: 13,
  },
  listView: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: moderateScale(10),
    marginTop: verticalScale(4),
    backgroundColor: colors.white,
  },
  row: { padding: horizontalScale(12) },
  description: { color: colors.black, fontSize: 13 },
};
