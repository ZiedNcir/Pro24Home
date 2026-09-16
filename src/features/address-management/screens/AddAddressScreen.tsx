
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Platform, Switch } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';

import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import FullscreenMapModal from '@features/intervention-creation/ui/new-intervention/FullscreenMapModal';
import type { SelectedAddressLocation } from '@features/intervention-creation/model/google-place-address';
import { colors } from '@theme';

export const AddAddressScreen = () => {
    const [frequent, setFrequent] = useState(true);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<SelectedAddressLocation>({
        address: 'Adresse sélectionnée sur la carte',
        latitude: 36.8065,
        longitude: 10.1815,
    });

    const mapRegion = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
    };

    return (
        <ScreenContainer
            mode="light"
            scrollable
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
            contentContainerStyle={{ paddingBottom: verticalScale(24) }}
        >
            <InterventionHeader title="Ajouter une adresse" showHelp={false} />

            <Form>
                <Label>Nom de l’emplacement (optionnel)</Label>
                <Input placeholder="Maison secondaire" placeholderTextColor="#9A9A9A" />

                <Label>Adresse</Label>
                <InputRow>
                    <InputInner
                        placeholder="10 Allée des Acacias, 92130 Issy-les-Moulineaux"
                        placeholderTextColor="#9A9A9A"
                    />
                    <SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} />
                </InputRow>

                <Label>Complément d’adresse (optionnel)</Label>
                <Input
                    placeholder="Maison, Rez-de-chaussée, Code portail 2587"
                    placeholderTextColor="#9A9A9A"
                />

                <MapPreview>
                    <AddressMap initialRegion={mapRegion} region={mapRegion} scrollEnabled={false} zoomEnabled={false}>
                        <Marker coordinate={selectedLocation} pinColor={colors.primary} />
                    </AddressMap>
                    <MapHint accessibilityRole="button" accessibilityLabel="Ouvrir la carte en plein écran" onPress={() => setIsMapFullscreen(true)}><SvgIcon name="fa-map-marked-alt" size={14} color={colors.primary} /><Text variant="bold" color="black" fontSize={11}>Ouvrir la carte</Text></MapHint>
                </MapPreview>

                <SwitchRow>
                    <View>
                        <Text variant="bold" color="black" fontSize={13}>
                            Enregistrer comme adresse fréquente
                        </Text>
                        <SwitchDescription>
                            Facilitez vos prochaines demandes.
                        </SwitchDescription>
                    </View>

                    <Switch
                        value={frequent}
                        onValueChange={setFrequent}
                        trackColor={{ true: colors.success, false: '#E5E5E5' }}
                        thumbColor={colors.white}
                    />
                </SwitchRow>
            </Form>

            <Spacer />

            <SaveButton onPress={() => { /* Handle save action */ }}>
                <Text variant="bold" color="white" fontSize={14}>
                    Enregistrer
                </Text>
            </SaveButton>
            <FullscreenMapModal
                visible={isMapFullscreen}
                region={mapRegion}
                selectedLocation={selectedLocation}
                isLookingUpAddress={false}
                onClose={() => setIsMapFullscreen(false)}
                onSelectCoordinate={(latitude, longitude) => setSelectedLocation({ address: 'Adresse sélectionnée sur la carte', latitude, longitude })}
            />
        </ScreenContainer>
    );
};


const View = styled.View``;

const Form = styled.View`
  margin-top: ${verticalScale(20)}px;
`;

const Label = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 12,
})`
  margin-bottom: ${verticalScale(8)}px;
  margin-top: ${verticalScale(14)}px;
`;

const Input = styled.TextInput`
  min-height: ${verticalScale(48)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  background-color: ${colors.white};
  padding-horizontal: ${horizontalScale(14)}px;
  color: ${colors.black};
`;

const InputRow = styled.View`
  min-height: ${verticalScale(48)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  background-color: ${colors.white};
  padding-horizontal: ${horizontalScale(14)}px;
  flex-direction: row;
  align-items: center;
`;

const InputInner = styled.TextInput`
  flex: 1;
  color: ${colors.black};
`;

const MapPreview = styled.View`
  height: ${verticalScale(140)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 2px;
  border-color: ${colors.danger};
  overflow: hidden;
  margin-top: ${verticalScale(18)}px;
`;

const AddressMap = styled(MapView).attrs({ provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined })`
  flex: 1;
`;

const MapHint = styled.TouchableOpacity`
  position: absolute;
  left: ${horizontalScale(12)}px;
  bottom: ${verticalScale(10)}px;
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  padding: ${verticalScale(8)}px ${horizontalScale(10)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: ${colors.white};
`;

const SwitchRow = styled.View`
  margin-top: ${verticalScale(18)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SwitchDescription = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`
  margin-top: 3px;
`;

const Spacer = styled.View`
  flex: 1;
`;

const SaveButton = styled.TouchableOpacity`
  height: ${verticalScale(52)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(24)}px;
`;
