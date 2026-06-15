// src/screens/intervention/AddAddressScreen.tsx

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Switch } from 'react-native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';

import InterventionHeader from '../components/InterventionHeader';
import { colors } from '@theme/index';

export const AddAddressScreen = () => {
    const [frequent, setFrequent] = useState(true);

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
                    <SvgIcon name="fa-map-marker-alt" size={36} color={colors.primary} />
                </MapPreview>

                <SwitchRow>
                    <View>
                        <Text variant="bold" color="black" fontSize={13}>
                            Enregistrer comme adresse fréquente
                        </Text>
                        <Text variant="regularSmall" color="gray600" style={{ marginTop: 3 }}>
                            Facilitez vos prochaines demandes.
                        </Text>
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
  background-color: #e9e5df;
  margin-top: ${verticalScale(18)}px;
  justify-content: center;
  align-items: center;
`;

const SwitchRow = styled.View`
  margin-top: ${verticalScale(18)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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