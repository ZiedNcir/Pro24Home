import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { colors } from '@theme/index';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import BottomActions from '../BottomActions';
import type { SummaryStepProps } from './types';

const SummaryStep: React.FC<SummaryStepProps> = ({ serviceName, address, timing, onNext, onPrevious }) => (
    <>
        <SectionTitle>Récapitulatif de votre demande</SectionTitle>
        <SummaryBlock>
            <SummaryLine title="Service" value={serviceName} />
            <SummaryLine title="Détails" value="La prise du salon ne fonctionne plus depuis hier." />
            <SummaryLine title="Adresse" value={address} />
            <SummaryLine title="Date souhaitée" value={timing === 'schedule' ? 'Date choisie' : 'Dès que possible'} />
        </SummaryBlock>

        <EstimationBox>
            <Text variant="bold" color="black" fontSize={14}>Estimation du prix</Text>
            <Text variant="bold" color="black" fontSize={18} style={{ marginTop: verticalScale(6) }}>À partir de 50 €</Text>
            <Text variant="regularSmall" color="gray600" style={{ marginTop: verticalScale(6) }}>
                Le prix final sera confirmé par le professionnel après diagnostic.
            </Text>
        </EstimationBox>

        <BottomActions primaryTitle="Voir le prix moyen" onPrimaryPress={onNext} onSecondaryPress={onPrevious} />
    </>
);

export default SummaryStep;

const SectionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const SummaryBlock = styled.View`
  background-color: ${colors.white};
  border-radius: 14px;
  border-width: 1px;
  border-color: #eeeeee;
  padding: ${horizontalScale(14)}px;
`;

const EstimationBox = styled.View`
  background-color: #fff1e8;
  border-radius: 14px;
  padding: ${horizontalScale(14)}px;
  margin-top: ${verticalScale(14)}px;
`;

const SummaryLine = ({ title, value }: { title: string; value: string }) => (
    <SummaryLineWrapper>
        <Text variant="bold" color="black" fontSize={12}>{title}</Text>
        <Text variant="regularSmall" color="gray600" style={{ marginTop: 4 }}>{value}</Text>
    </SummaryLineWrapper>
);

const SummaryLineWrapper = styled.View`
  margin-bottom: ${verticalScale(12)}px;
`;
