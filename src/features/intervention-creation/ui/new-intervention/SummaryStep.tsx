import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { colors } from '@theme';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import BottomActions from '@shared/ui/action/BottomActions';
import type { SummaryStepProps } from './types';

const SummaryStep: React.FC<SummaryStepProps> = ({
  serviceName,
  description,
  photos,
  address,
  timing,
  scheduledDate,
  onNext,
  onPrevious,
}) => {
  const { t, i18n } = useTranslation();
  return (
  <>
    <SectionTitle>{t('intervention.creation.summary')}</SectionTitle>
    <SummaryBlock>
      <SummaryLine title={t('intervention.creation.service')} value={serviceName} />
      <SummaryLine
        title={t('intervention.creation.details')}
        value={description.trim() || t('intervention.creation.noDescription')}
      />
      <SummaryLine title={t('intervention.creation.address')} value={address} />
      <SummaryLine
        title={t('intervention.creation.desiredDate')}
        value={
          timing === 'schedule' && scheduledDate
            ? scheduledDate.toLocaleString(i18n.language)
            : timing === 'schedule'
            ? t('intervention.creation.dateChosen')
            : t('intervention.creation.asap')
        }
      />
    </SummaryBlock>

    {photos.length > 0 ? (
      <PhotosSummary>
        <PhotosSummaryHeader>
          <Text variant="bold" color="black" fontSize={12}>
            {t('intervention.creation.photosAdded')}
          </Text>
          <Text variant="regularSmall" color="gray600">
            {photos.length}/3
          </Text>
        </PhotosSummaryHeader>
        <PhotosRow>
          {photos.map((photo, index) => (
            <SummaryPhoto
              key={`${photo.uri}-${index}`}
              source={{ uri: photo.uri }}
              resizeMode="cover"
            />
          ))}
        </PhotosRow>
      </PhotosSummary>
    ) : null}

    <EstimationBox>
      <Text variant="bold" color="black" fontSize={14}>
        {t('intervention.creation.priceEstimate')}
      </Text>
      <EstimationPrice>{t('intervention.creation.priceToEstimate')}</EstimationPrice>
      <EstimationDescription>
        {t('intervention.creation.priceNextStep')}
      </EstimationDescription>
    </EstimationBox>

    <BottomActions
      primaryTitle={t('intervention.creation.seeAveragePrice')}
      onPrimaryPress={onNext}
      onSecondaryPress={onPrevious}
    />
  </>
  );
};

export default SummaryStep;

const SectionTitle = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const SummaryBlock = styled.View`
  background-color: ${colors.white};
  border-radius: 14px;
  border-width: 1px;
  border-color: ${colors.borderLight};
  padding: ${horizontalScale(14)}px;
`;

const EstimationBox = styled.View`
  background-color: ${colors.primaryLighter};
  border-radius: 14px;
  padding: ${horizontalScale(14)}px;
  margin-top: ${verticalScale(14)}px;
`;

const EstimationPrice = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 18,
})`
  margin-top: ${verticalScale(6)}px;
`;

const EstimationDescription = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
})`
  margin-top: ${verticalScale(6)}px;
`;

const PhotosSummary = styled.View`
  margin-top: ${verticalScale(14)}px;
  padding: ${horizontalScale(14)}px;
  border-radius: 14px;
  background-color: ${colors.white};
  border-width: 1px;
  border-color: ${colors.borderLight};
`;

const PhotosSummaryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PhotosRow = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
  margin-top: ${verticalScale(10)}px;
`;

const SummaryPhoto = styled(Image)`
  width: ${horizontalScale(72)}px;
  height: ${horizontalScale(72)}px;
  border-radius: 12px;
  background-color: ${colors.gray200};
`;

const SummaryLine = ({ title, value }: { title: string; value: string }) => (
  <SummaryLineWrapper>
    <Text variant="bold" color="black" fontSize={12}>
      {title}
    </Text>
    <SummaryValue>{value}</SummaryValue>
  </SummaryLineWrapper>
);

const SummaryLineWrapper = styled.View`
  margin-bottom: ${verticalScale(12)}px;
`;

const SummaryValue = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
})`
  margin-top: ${verticalScale(4)}px;
`;
