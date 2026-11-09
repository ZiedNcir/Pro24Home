
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme';
import { useNavigation } from '@react-navigation/core';

export const InterventionSuccessScreen = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const navigation = useNavigation<any>();
    return (
        <ScreenContainer
            centered
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(18)}
        >
            <SuccessCircle>
                <SvgIcon name="fa-check" size={44} color={colors.textInverse} />
            </SuccessCircle>

            <Text
                variant="bold"
                color="black"
                fontSize={22}
                style={[styles.centeredText, { marginTop: verticalScale(24) }]}
            >
                {t('payment.success.title')}
            </Text>

            <Text
                variant="regular"
                color="gray600"
                style={[styles.centeredText, { marginTop: verticalScale(12) }]}
            >
                {t('payment.success.description')}
            </Text>

            <DetailsCard>
                <DetailRow icon="fa-tools" title={t('payment.success.service')} />
                <DetailRow icon="fa-map-marker-alt" title={t('payment.success.addressName')} subtitle={t('payment.success.address')} />
                <DetailRow icon="fa-clock" title={t('payment.success.asap')} subtitle={t('payment.success.within24Hours')} />
            </DetailsCard>

            <SecondaryButton onPress={() => {navigation.navigate('InterventionDetail')}}>
                <Text variant="bold" color="black" fontSize={14}>
                    {t('payment.success.viewRequests')}
                </Text>
            </SecondaryButton>

            <PrimaryButton onPress={() => {navigation.navigate('Tabs', { screen: 'Home' })}}>
                <Text variant="bold" color={colors.textInverse} fontSize={14}>
                    {t('payment.success.home')}
                </Text>
            </PrimaryButton>
        </ScreenContainer>
    );
};


const SuccessCircle = styled.View`
  width: ${horizontalScale(86)}px;
  height: ${horizontalScale(86)}px;
  border-radius: ${horizontalScale(43)}px;
  background-color: ${({ theme }) => theme.colors.success};
  justify-content: center;
  align-items: center;
  align-self: center;
`;

const DetailsCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
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
}) => {
    const { theme } = useTheme();
    const colors = theme.colors;
    return (
    <DetailWrapper>
        <DetailIcon>
            <SvgIcon name={icon as any} size={18} color={colors.primary} />
        </DetailIcon>
        <DetailContent>
            <Text variant="bold" color="black" fontSize={13}>
                {title}
            </Text>
            {subtitle ? (
                <Text variant="regularSmall" color="gray600" style={styles.subtitle}>
                    {subtitle}
                </Text>
            ) : null}
        </DetailContent>
    </DetailWrapper>
    );
};

const DetailWrapper = styled.View`
  flex-direction: row;
  margin-bottom: ${verticalScale(14)}px;
`;

const DetailIcon = styled.View`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
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
  border-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(20)}px;
`;

const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: ${verticalScale(50)}px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(12)}px;
`;

const styles = StyleSheet.create({ centeredText: { textAlign: 'center' }, subtitle: { marginTop: 4 } });
