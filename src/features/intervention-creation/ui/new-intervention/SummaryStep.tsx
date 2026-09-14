import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { colors } from '@theme/index';
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
}) => (
  <>
    <SectionTitle>Récapitulatif de votre demande</SectionTitle>
    <SummaryBlock>
      <SummaryLine title="Service" value={serviceName} />
      <SummaryLine
        title="Détails"
        value={description.trim() || 'Aucune description renseignée'}
      />
      <SummaryLine title="Adresse" value={address} />
      <SummaryLine
        title="Date souhaitée"
        value={
          timing === 'schedule' && scheduledDate
            ? scheduledDate.toLocaleString('fr-FR')
            : timing === 'schedule'
            ? 'Date choisie'
            : 'Dès que possible'
        }
      />
    </SummaryBlock>

    {photos.length > 0 ? (
      <PhotosSummary>
        <PhotosSummaryHeader>
          <Text variant="bold" color="black" fontSize={12}>
            Photos ajoutées
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
        Estimation du prix
      </Text>
      <EstimationPrice>Prix à estimer</EstimationPrice>
      <EstimationDescription>
        Le montant sera calculé à l’étape suivante selon votre demande.
      </EstimationDescription>
    </EstimationBox>

    <BottomActions
      primaryTitle="Voir le prix moyen"
      onPrimaryPress={onNext}
      onSecondaryPress={onPrevious}
    />
  </>
);

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
