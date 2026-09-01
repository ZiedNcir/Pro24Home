import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import SelectableCard from '../SelectableCard';
import PhotoPickerRow from '../PhotoPickerRow';
import BottomActions from '../BottomActions';
import type { DetailsStepProps } from './types';

const DetailsStep: React.FC<DetailsStepProps> = ({ selectedTiming, onSelectTiming, onNext, onPrevious }) => (
    <>
        <SectionTitle>Décrivez votre problème</SectionTitle>
        <InputBox multiline placeholder="La prise du salon ne fonctionne plus depuis hier..." placeholderTextColor="#8A8A8A" />

        <SectionTitle>Ajoutez des photos (optionnel)</SectionTitle>
        <PhotoPickerRow />

        <SectionTitle>Quand souhaitez-vous l’intervention ?</SectionTitle>
        <SelectableCard
            title="Dès que possible"
            description="Dans les prochaines 24h"
            icon="fa-clock"
            selected={selectedTiming === 'asap'}
            onPress={() => onSelectTiming('asap')}
        />
        <SelectableCard
            title="Choisir une date et heure"
            description="Sélectionnez un créneau"
            icon="fa-calendar"
            selected={selectedTiming === 'schedule'}
            onPress={() => onSelectTiming('schedule')}
        />

        <BottomActions primaryTitle="Continuer" onPrimaryPress={onNext} onSecondaryPress={onPrevious} />
    </>
);

export default DetailsStep;

const SectionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const InputBox = styled.TextInput`
  height: ${verticalScale(110)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  border-radius: 12px;
  padding: ${horizontalScale(14)}px;
  text-align-vertical: top;
  background-color: ${Colors.white};
`;
