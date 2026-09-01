import React from 'react';
import { Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import type { FullscreenMapModalProps } from './types';

const FullscreenMapModal: React.FC<FullscreenMapModalProps> = ({
    visible,
    region,
    selectedLocation,
    isLookingUpAddress,
    onClose,
    onSelectCoordinate,
}) => (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <FullscreenMapContainer>
            <FullscreenMap
                initialRegion={region}
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
                    onSelectCoordinate(latitude, longitude);
                }}
                accessibilityLabel="Carte plein écran pour choisir une adresse"
            >
                {selectedLocation ? <Marker coordinate={selectedLocation} pinColor={colors.primary} /> : null}
            </FullscreenMap>

            <FullscreenMapHeader>
                <MapCloseButton accessibilityRole="button" accessibilityLabel="Fermer la carte" onPress={onClose}>
                    <SvgIcon name="fa-times" size={16} color={colors.black} />
                </MapCloseButton>
                <MapHeaderTitle>Choisir sur la carte</MapHeaderTitle>
                <MapSpacer />
            </FullscreenMapHeader>

            <FullscreenMapFooter>
                <Text variant="regularSmall" color="gray600">
                    Touchez un point pour placer le repère. Vous pouvez zoomer et déplacer la carte.
                </Text>
                <MapConfirmButton onPress={onClose} disabled={!selectedLocation || isLookingUpAddress}>
                    <Text variant="bold" color="white" fontSize={14}>Valider cette position</Text>
                </MapConfirmButton>
            </FullscreenMapFooter>
        </FullscreenMapContainer>
    </Modal>
);

export default FullscreenMapModal;

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
  elevation: 3;
`;

const MapHeaderTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`
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
