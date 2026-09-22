import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { useTheme } from '@theme';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import SelectableCard from '@shared/ui/selection/SelectableCard';
import PhotoPickerRow from '@features/intervention-creation/ui/PhotoPickerRow';
import BottomActions from '@shared/ui/action/BottomActions';
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
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const chooseScheduledTiming = () => {
    onSelectTiming('schedule');
    setIsDatePickerVisible(true);
  };

  return (
    <>
      <SectionTitle>{t('intervention.creation.describeProblem')}</SectionTitle>
      <InputBox
        multiline
        value={description}
        onChangeText={onChangeDescription}
        placeholder={t('intervention.creation.problemPlaceholder')}
        placeholderTextColor={theme.colors.gray500}
        textAlignVertical="top"
      />

      <SectionTitle>{t('intervention.creation.photosOptional')}</SectionTitle>
      <PhotoPickerRow
        photos={photos}
        onAddPhoto={onAddPhoto}
        onRemovePhoto={onRemovePhoto}
      />

      <SectionTitle>{t('intervention.creation.schedule')}</SectionTitle>
      <SelectableCard
        title={t('intervention.creation.asap')}
        description={t('intervention.creation.asapDescription')}
        icon="fa-clock"
        selected={selectedTiming === 'asap'}
        onPress={() => onSelectTiming('asap')}
      />
      <SelectableCard
        title={t('intervention.creation.chooseDate')}
        description={t('intervention.creation.slotDescription')}
        icon="fa-calendar"
        selected={selectedTiming === 'schedule'}
        onPress={chooseScheduledTiming}
      />

      <BottomActions
        primaryTitle={t('common.actions.continue')}
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
  border-color: ${({ theme }) => theme.colors.borderLight};
  border-radius: 12px;
  padding: ${horizontalScale(14)}px;
  text-align-vertical: top;
  background-color: ${({ theme }) => theme.colors.surface};
`;
