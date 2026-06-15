// src/screens/intervention/InterventionSuccessScreen.tsx

import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';

export const InterventionSuccessScreen = () => {
    return (
        <ScreenContainer
            mode="light"
            centered
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(18)}
        >
            <SuccessCircle>
                <SvgIcon name="fa-check" size={44} color={colors.white} />
            </SuccessCircle>

            <Text
                variant="bold"
                color="black"
                fontSize={22}
                style={{ textAlign: 'center', marginTop: verticalScale(24) }}
            >
                Demande confirmée !
            </Text>

            <Text
                variant="regular"
                color="gray600"
                style={{ textAlign: 'center', marginTop: verticalScale(12) }}
            >
                Votre demande a été envoyée avec succès. Vous recevrez une confirmation dès qu’un professionnel l’acceptera.
            </Text>

            <DetailsCard>
                <DetailRow icon="fa-tools" title="Électricien – Dépannage électrique" />
                <DetailRow icon="fa-map-marker-alt" title="Maison secondaire" subtitle="10 Allée des Acacias, 92130 Issy-les-Moulineaux" />
                <DetailRow icon="fa-clock" title="Dès que possible" subtitle="dans les 24h" />
            </DetailsCard>

            <SecondaryButton onPress={() => { }//appNavigate('InterventionDetail')

            }>
                <Text variant="bold" color="black" fontSize={14}>
                    Voir mes demandes
                </Text>
            </SecondaryButton>

            <PrimaryButton onPress={() => { }//appNavigate('HomeGate')

            }>
                <Text variant="bold" color="white" fontSize={14}>
                    Retour à l’accueil
                </Text>
            </PrimaryButton>
        </ScreenContainer>
    );
};


const SuccessCircle = styled.View`
  width: ${horizontalScale(86)}px;
  height: ${horizontalScale(86)}px;
  border-radius: ${horizontalScale(43)}px;
  background-color: ${colors.success};
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const DetailsCard = styled.View`
  width: 100%;
  background-color: ${colors.white};
  border-radius: 16px;
  border-width: 1px;
  border-color: #eeeeee;
  padding: ${horizontalScale(16)}px;
  margin-top: ${verticalScale(30)}px;
`;

const DetailRow = ({
    icon,
    title,
    subtitle,
}: {
    icon: string;
    title: string;
    subtitle?: string;
}) => (
    <DetailWrapper>
        <DetailIcon>
            <SvgIcon name={icon as any} size={18} color={colors.primary} />
        </DetailIcon>
        <DetailContent>
            <Text variant="bold" color="black" fontSize={13}>
                {title}
            </Text>
            {subtitle ? (
                <Text variant="regularSmall" color="gray600" style={{ marginTop: 4 }}>
                    {subtitle}
                </Text>
            ) : null}
        </DetailContent>
    </DetailWrapper>
);

const DetailWrapper = styled.View`
  flex-direction: row;
  margin-bottom: ${verticalScale(14)}px;
`;

const DetailIcon = styled.View`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: 10px;
  background-color: #fff1e8;
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(12)}px;
`;

const DetailContent = styled.View`
  flex: 1;
`;

const SecondaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${verticalScale(50)}px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(20)}px;
`;

const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${verticalScale(50)}px;
  border-radius: 12px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(12)}px;
`;