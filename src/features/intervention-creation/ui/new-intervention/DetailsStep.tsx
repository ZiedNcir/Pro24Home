import React, { useState } from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { colors } from '@theme/index';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import SelectableCard from '@screens/Intervention/components/SelectableCard';
import PhotoPickerRow from '@screens/Intervention/components/PhotoPickerRow';
import BottomActions from '@screens/Intervention/components/BottomActions';
import ScheduleDateModal from './ScheduleDateModal';
import type { DetailsStepProps } from './types';

const DetailsStep: React.FC<DetailsStepProps> = ({
  description,
  photos,
  selectedTiming,
  selectedDate,
  onChangeDescription,
  onAddPhoto,
  onRemovePhoto,
  onSelectTiming,
  onSelectDate,
  onNext,
  onPrevious,
}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const chooseScheduledTiming = () => {
    onSelectTiming('schedule');
    setIsDatePickerVisible(true);
  };

  return (
    <>
      <SectionTitle>Décrivez votre problème</SectionTitle>
      <InputBox
        multiline
        value={description}
        onChangeText={onChangeDescription}
        placeholder="Décrivez votre panne..."
        placeholderTextColor={colors.gray500}
        textAlignVertical="top"
      />

      <SectionTitle>Ajoutez des photos (optionnel)</SectionTitle>
      <PhotoPickerRow
        photos={photos}
        onAddPhoto={onAddPhoto}
        onRemovePhoto={onRemovePhoto}
      />

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
        onPress={chooseScheduledTiming}
      />

      <BottomActions
        primaryTitle="Continuer"
        onPrimaryPress={onNext}
        onSecondaryPress={onPrevious}
        primaryDisabled={selectedTiming === 'schedule' && !selectedDate}
      />

      <ScheduleDateModal
        visible={isDatePickerVisible}
        selectedDate={selectedDate}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={onSelectDate}
      />
    </>
  );
};

export default DetailsStep;

const SectionTitle = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const InputBox = styled.TextInput`
  height: ${verticalScale(110)}px;
  border-width: 1px;
  border-color: ${colors.borderLight};
  border-radius: 12px;
  padding: ${horizontalScale(14)}px;
  text-align-vertical: top;
  background-color: ${colors.white};
`;
