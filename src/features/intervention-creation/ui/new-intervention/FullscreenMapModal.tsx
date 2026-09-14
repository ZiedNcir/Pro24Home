import React, { useRef, useState } from 'react';
import { Modal, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon, type IconName } from '@components/Icon';
import { colors } from '@theme/index';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import type { FullscreenMapModalProps } from './types';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';

const FullscreenMapModal: React.FC<FullscreenMapModalProps> = ({
  visible,
  region,
  selectedLocation,
  isLookingUpAddress,
  onClose,
  onSelectCoordinate,
  onSearchAddress,
}) => (
  <MapModalContent
    visible={visible}
    onClose={onClose}
    region={region}
    selectedLocation={selectedLocation}
    isLookingUpAddress={isLookingUpAddress}
    onSelectCoordinate={onSelectCoordinate}
    onSearchAddress={onSearchAddress}
  />
);

const MapModalContent: React.FC<FullscreenMapModalProps> = ({
  visible,
  region,
  selectedLocation,
  isLookingUpAddress,
  onClose,
  onSelectCoordinate,
  onSearchAddress,
}) => {
  const [mapType, setMapType] = useState<
    'standard' | 'satellite' | 'hybrid' | 'terrain'
  >('standard');
  const mapRef = useRef<MapView>(null);
  const zoomFactor = useRef(1);
  const insets = useSafeAreaInsets();

  const zoomMap = (factor: number) => {
    zoomFactor.current = Math.min(
      4,
      Math.max(0.25, zoomFactor.current * factor),
    );
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta * zoomFactor.current,
        longitudeDelta: region.longitudeDelta * zoomFactor.current,
      },
      250,
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <FullscreenMapContainer>
        <FullscreenMap
          ref={mapRef}
          initialRegion={region}
          mapType={mapType}
          showsCompass
          showsScale
          showsBuildings
          showsPointsOfInterests
          showsUserLocation
          showsMyLocationButton
          showsTraffic={false}
          zoomEnabled
          scrollEnabled
          rotateEnabled
          pitchEnabled
          zoomControlEnabled
          toolbarEnabled
          onPress={event => {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            onSelectCoordinate(latitude, longitude);
          }}
          accessibilityLabel="Carte plein écran pour choisir une adresse"
        >
          {selectedLocation ? (
            <Marker coordinate={selectedLocation} pinColor={colors.primary} />
          ) : null}
        </FullscreenMap>

        <FullscreenMapHeader topInset={insets.top}>
          <InterventionHeader
            title="Sélectionner une adresse"
            showHelp={false}
            onClose={onClose}
          />
        </FullscreenMapHeader>

        <MapTypeSelector topInset={insets.top}>
          {MAP_TYPES.map(type => (
            <MapTypeButton
              key={type.value}
              active={mapType === type.value}
              onPress={() => setMapType(type.value)}
              accessibilityRole="button"
              accessibilityLabel={`Afficher la carte en mode ${type.label}`}
            >
              <SvgIcon
                name={type.icon}
                size={16}
                color={mapType === type.value ? colors.white : colors.black}
              />
            </MapTypeButton>
          ))}
        </MapTypeSelector>

        <MapControls bottomInset={insets.bottom}>
          <MapControlButton
            accessibilityRole="button"
            accessibilityLabel="Zoomer"
            onPress={() => zoomMap(0.5)}
          >
            <SvgIcon name="fa-plus" size={17} color={colors.black} />
          </MapControlButton>
          <MapControlButton
            accessibilityRole="button"
            accessibilityLabel="Dézoomer"
            onPress={() => zoomMap(2)}
          >
            <SvgIcon name="fa-minus" size={17} color={colors.black} />
          </MapControlButton>
        </MapControls>

        <FullscreenMapFooter>
          <FooterHandle />
          <FooterLabel>ADRESSE SÉLECTIONNÉE</FooterLabel>
          <SelectedAddressRow>
            <SelectedAddressIcon>
              <SvgIcon
                name="fa-map-marker-alt"
                size={18}
                color={colors.primary}
              />
            </SelectedAddressIcon>
            <SelectedAddressText numberOfLines={2}>
              {selectedLocation?.address ||
                'Touchez la carte pour choisir une adresse'}
            </SelectedAddressText>
          </SelectedAddressRow>
          {onSearchAddress ? (
            <SearchAddressButton
              accessibilityRole="button"
              accessibilityLabel="Rechercher une adresse"
              onPress={onSearchAddress}
            >
              <SvgIcon
                name="fa-map-marker-alt"
                size={16}
                color={colors.primary}
              />
              <Text variant="bold" color="black" fontSize={13}>
                Rechercher une adresse
              </Text>
            </SearchAddressButton>
          ) : null}
          <MapConfirmButton
            onPress={onClose}
            disabled={!selectedLocation || isLookingUpAddress}
          >
            <SvgIcon name="fa-check" size={16} color={colors.white} />
            <Text variant="bold" color="white" fontSize={14}>
              Valider l’adresse
            </Text>
          </MapConfirmButton>
        </FullscreenMapFooter>
      </FullscreenMapContainer>
    </Modal>
  );
};

export default FullscreenMapModal;

const FullscreenMapContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const FullscreenMap = styled(MapView).attrs({
  provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined,
})`
  flex: 1;
`;

const MAP_TYPES = [
  {
    value: 'standard' as const,
    label: 'Plan',
    icon: 'fa-map-marked-alt' as IconName,
  },
  {
    value: 'satellite' as const,
    label: 'Satellite',
    icon: 'fa-layer-group' as IconName,
  },
  {
    value: 'hybrid' as const,
    label: 'Hybride',
    icon: 'fa-building' as IconName,
  },
  {
    value: 'terrain' as const,
    label: 'Relief',
    icon: 'fa-map-marker-alt' as IconName,
  },
];

const FullscreenMapHeader = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ topInset }) => topInset + verticalScale(8)}px;
  left: 0;
  right: 0;
  padding: 0 ${horizontalScale(12)}px;
  border-width: 1px;
  border-color: ${colors.borderLight};
  border-radius: ${moderateScale(14)}px;
  background-color: ${colors.white};
  elevation: 4;
  z-index: 10;
`;

const MapTypeSelector = styled.View<{ topInset: number }>`
  position: absolute;
  top: ${({ topInset }) => topInset + verticalScale(76)}px;
  right: ${horizontalScale(18)}px;
  z-index: 9;
  gap: ${verticalScale(8)}px;
`;

const MapTypeButton = styled.TouchableOpacity<{ active: boolean }>`
  width: ${horizontalScale(46)}px;
  height: ${horizontalScale(46)}px;
  border-radius: ${horizontalScale(23)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ active }) => (active ? colors.primary : colors.white)};
  border-width: 1px;
  border-color: ${({ active }) =>
    active ? colors.primary : colors.borderLight};
  elevation: 4;
`;

const MapControls = styled.View<{ bottomInset: number }>`
  position: absolute;
  bottom: ${({ bottomInset }: { bottomInset: number }) =>
    bottomInset + verticalScale(248)}px;
  right: ${horizontalScale(18)}px;
  z-index: 9;
  gap: ${verticalScale(8)}px;
`;

const MapControlButton = styled.TouchableOpacity`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${horizontalScale(21)}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
  elevation: 3;
`;

const FooterHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  align-self: center;
  margin-bottom: ${verticalScale(14)}px;
  background-color: ${colors.gray400};
`;

const FooterLabel = styled(Text).attrs({
  variant: 'bold',
  color: 'gray600',
  fontSize: 11,
})`
  letter-spacing: 1.2px;
  margin-bottom: ${verticalScale(10)}px;
`;

const SelectedAddressRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(14)}px;
`;

const SelectedAddressIcon = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${horizontalScale(21)}px;
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(10)}px;
  background-color: ${colors.primaryLighter};
`;

const SelectedAddressText = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 14,
})`
  flex: 1;
`;

const FullscreenMapFooter = styled.View`
  position: absolute;
  left: ${horizontalScale(18)}px;
  right: ${horizontalScale(18)}px;
  bottom: ${verticalScale(22)}px;
  padding: ${verticalScale(14)}px;
  border-radius: ${moderateScale(16)}px;
  background-color: ${colors.white};
  elevation: 4;
`;

const MapConfirmButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: ${verticalScale(48)}px;
  flex-direction: row;
  gap: ${horizontalScale(8)}px;
  margin-top: ${verticalScale(12)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  justify-content: center;
  align-items: center;
`;

const SearchAddressButton = styled.TouchableOpacity`
  height: ${verticalScale(46)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${horizontalScale(8)}px;
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.white};
`;
