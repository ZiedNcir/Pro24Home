import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import type { Intervention } from '@entities/intervention/model';
import type { LocalIntervention } from '@entities/intervention/model/local-interventions';
import { formatInterventionPrice } from '@entities/intervention/model/intervention-presentation';
import Button from '@shared/ui/button/Button';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { ClientInterventionDetails } from './InterventionDetailSections';

interface Props {
    saved: LocalIntervention;
    intervention: Intervention;
    onPay: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

const UnavailableInterventionDetails = ({ saved, intervention, onPay, onDelete, isDeleting }: Props) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const photos = [saved.payload.image_1, saved.payload.image_2, saved.payload.image_3]
        .map(photo => (photo as unknown as { uri?: string } | undefined)?.uri)
        .filter((uri): uri is string => Boolean(uri));
    const price = formatInterventionPrice(saved.payload.price);
    const addressDetails = Array.from(new Set(
        [saved.snapshot.address?.location_name, saved.snapshot.address?.details, saved.snapshot.address?.phone]
            .filter((value): value is string => Boolean(value?.trim()))
            .map(value => value.trim()),
    )).filter(value => value.toLocaleLowerCase() !== saved.snapshot.address?.address?.trim().toLocaleLowerCase());

    return <>
        <StatusPanel accessibilityRole="summary">
            <StatusIcon><SvgIcon name="fa-user-clock" size={30} color={colors.warning} /></StatusIcon>
            <Heading>{t('intervention.detail.statusNoProfessional')}</Heading>
            <Explanation>{t('intervention.local.unavailableDescription')}</Explanation>
            <SavedBadge>
                <SvgIcon name="fa-shield-alt" size={13} color={colors.success} />
                <Text variant="bold" color={colors.textPrimary} fontSize={12}>{t('intervention.local.savedTitle')}</Text>
            </SavedBadge>
        </StatusPanel>

        <ServiceCard>
            <ServiceIcon><SvgIcon name="fa-wrench" size={23} color={colors.primary} /></ServiceIcon>
            <ServiceContent>
                <Text variant="regularSmall" color={colors.textSecondary}>{saved.snapshot.serviceName}</Text>
                <ServiceTitle>{saved.payload.title}</ServiceTitle>
            </ServiceContent>
        </ServiceCard>

        <ClientInterventionDetails intervention={intervention} addressDetails={addressDetails} />

        {photos.length > 0 ? <Card>
            <SectionHeading>
                <SvgIcon name="image" size={17} color={colors.primary} />
                <SectionTitle>{t('intervention.detail.photos')}</SectionTitle>
                <PhotoCount><Text variant="bold" color={colors.textSecondary} fontSize={11}>{photos.length}</Text></PhotoCount>
            </SectionHeading>
            <Photos>
                {photos.map((uri, index) => <Photo key={index} source={{ uri }} resizeMode="cover" accessibilityLabel={t('intervention.local.photoNumber', { number: index + 1 })} />)}
            </Photos>
        </Card> : null}

        <PaymentCard>
            <SectionHeading><SvgIcon name="fa-credit-card" size={18} color={colors.primary} /><SectionTitle>{t('intervention.local.nextStep')}</SectionTitle></SectionHeading>
            {price ? <PriceRow><PriceLabel>{t('payment.estimate.average')}</PriceLabel><Text variant="bold" color={colors.textPrimary}>{price}</Text></PriceRow> : null}
            {saved.checkPriceWithProfessional ? <DetailText>{t('payment.travel.proReview')}</DetailText> : null}
            <FeeRow><PriceLabel>{t('payment.travel.fee')}</PriceLabel><Text variant="bold" color={colors.textPrimary} fontSize={22}>{formatInterventionPrice(20)}</Text></FeeRow>
            <Button title={t('intervention.local.pay')} onPress={onPay} disabled={isDeleting} fullWidth size="large" rightIcon="fa-chevron-right" />
            <RetryNote>{t('intervention.local.retryHint')}</RetryNote>
            <Button
                title={t('intervention.local.delete')}
                onPress={onDelete}
                variant="outline"
                borderColor={colors.danger}
                textColor={colors.danger}
                leftIcon="fa-trash"
                loading={isDeleting}
                disabled={isDeleting}
                fullWidth
                size="large"
            />
        </PaymentCard>
    </>;
};

export default UnavailableInterventionDetails;

const StatusPanel = styled.View`align-items: center; background-color: ${({ theme }) => theme.colors.warningLight}; border-radius: ${moderateScale(22)}px; padding: ${moderateScale(22)}px ${horizontalScale(18)}px; margin-top: ${verticalScale(20)}px;`;
const StatusIcon = styled.View`width: ${moderateScale(68)}px; height: ${moderateScale(68)}px; border-radius: ${moderateScale(22)}px; background-color: ${({ theme }) => theme.colors.surface}; align-items: center; justify-content: center; margin-bottom: ${verticalScale(16)}px;`;
const Heading = styled(Text).attrs(({ theme }) => ({ variant: 'bold', fontSize: 22, color: theme.colors.textPrimary }))`text-align: center; line-height: 29px;`;
const Explanation = styled(Text).attrs(({ theme }) => ({ variant: 'regularSmall', color: theme.colors.textSecondary }))`text-align: center; line-height: 21px; margin-top: ${verticalScale(10)}px;`;
const SavedBadge = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(6)}px; background-color: ${({ theme }) => theme.colors.successLight}; padding: ${verticalScale(8)}px ${horizontalScale(12)}px; border-radius: ${moderateScale(20)}px; margin-top: ${verticalScale(16)}px;`;
const Card = styled.View`padding: ${moderateScale(16)}px; margin-top: ${verticalScale(16)}px; border-radius: ${moderateScale(16)}px; background-color: ${({ theme }) => theme.colors.surface}; border-width: 1px; border-color: ${({ theme }) => theme.colors.border};`;
const ServiceCard = styled(Card)`flex-direction: row; align-items: center; gap: ${horizontalScale(12)}px;`;
const ServiceIcon = styled.View`width: ${moderateScale(48)}px; height: ${moderateScale(48)}px; border-radius: ${moderateScale(14)}px; background-color: ${({ theme }) => theme.colors.primaryLighter}; align-items: center; justify-content: center;`;
const ServiceContent = styled.View`flex: 1; gap: ${verticalScale(4)}px;`;
const ServiceTitle = styled(Text).attrs(({ theme }) => ({ variant: 'bold', fontSize: 17, color: theme.colors.textPrimary }))`line-height: 24px;`;
const SectionHeading = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(8)}px; margin-bottom: ${verticalScale(12)}px;`;
const SectionTitle = styled(Text).attrs(({ theme }) => ({ variant: 'bold', fontSize: 14, color: theme.colors.textPrimary }))`flex: 1;`;
const DetailText = styled(Text).attrs(({ theme }) => ({ variant: 'regularSmall', color: theme.colors.textSecondary }))`line-height: 21px; margin-top: ${verticalScale(4)}px;`;
const PhotoCount = styled.View`padding: ${verticalScale(3)}px ${horizontalScale(8)}px; border-radius: ${moderateScale(8)}px; background-color: ${({ theme }) => theme.colors.surfaceVariant};`;
const Photos = styled.View`flex-direction: row; gap: ${horizontalScale(8)}px;`;
const Photo = styled.Image`flex: 1; height: ${verticalScale(108)}px; border-radius: ${moderateScale(12)}px; background-color: ${({ theme }) => theme.colors.surfaceVariant};`;
const PaymentCard = styled(Card)`padding: ${moderateScale(18)}px; margin-bottom: ${verticalScale(12)}px;`;
const PriceRow = styled.View`flex-direction: row; align-items: center; justify-content: space-between; gap: ${horizontalScale(12)}px; margin-bottom: ${verticalScale(12)}px;`;
const PriceLabel = styled(Text).attrs(({ theme }) => ({ variant: 'regularSmall', color: theme.colors.textSecondary }))`flex: 1;`;
const FeeRow = styled(PriceRow)`border-top-width: 1px; border-top-color: ${({ theme }) => theme.colors.border}; padding-top: ${verticalScale(14)}px; margin-bottom: ${verticalScale(18)}px;`;
const RetryNote = styled(Text).attrs(({ theme }) => ({ variant: 'regularSmall', fontSize: 11, color: theme.colors.textSecondary }))`text-align: center; line-height: 17px; margin-top: ${verticalScale(12)}px;`;
