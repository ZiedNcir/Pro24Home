import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { verticalScale } from '@utils/normalizedCss';
import SelectableCard from '@shared/ui/selection/SelectableCard';
import ServiceSummaryCard from '@entities/service/ui/ServiceSummaryCard';
import ServiceSelectionModal from './ServiceSelectionModal';
import InfoNotice from '@shared/ui/action/InfoNotice';
import BottomActions from '@shared/ui/action/BottomActions';
import type { ServiceStepProps } from './types';

const ServiceStep: React.FC<ServiceStepProps> = ({
    service,
    services,
    selectedServiceId,
    problemTypes,
    servicesLoading,
    selectedProblem,
    onSelectProblem,
    onSelectService,
    onNext,
}) => {
    const { t } = useTranslation();
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

    const handleSelectService = (serviceId: number) => {
        onSelectService(serviceId);
        setIsServiceModalVisible(false);
    };

    return (
        <>
        <ServiceSummaryCard
            title={service?.name || t('intervention.creation.serviceType')}
            description={service?.description || t('intervention.creation.serviceTypeDescription')}
            image={require('@assets/images/electricien.png')}
            onEditPress={() => setIsServiceModalVisible(true)}
        />

        <SectionTitle>{t('intervention.creation.serviceType')}</SectionTitle>

        {servicesLoading ? (
            <Message>{t('intervention.creation.loadingBreakdowns')}</Message>
        ) : problemTypes.length === 0 ? (
            <Message>{t('intervention.creation.noBreakdowns')}</Message>
        ) : (
            <>
                <Hint>{t('intervention.creation.chooseBreakdown')}</Hint>
                {problemTypes.map(item => (
                    <SelectableCard
                        key={item.id}
                        title={item.title}
                        description={item.description || t('intervention.creation.describeBreakdown')}
                        icon="fa-building"
                        selected={selectedProblem === item.id}
                        onPress={() => onSelectProblem(item.id)}
                    />
                ))}
            </>
        )}

        <InfoNotice
            icon="fa-shield-alt"
            title={t('intervention.creation.verifiedPros')}
            description={t('intervention.creation.ratedElectricians')}
        />

        <BottomActions
            primaryTitle={t('common.actions.continue')}
            onPrimaryPress={onNext}
            primaryDisabled={servicesLoading || selectedProblem === null}
        />

        <ServiceSelectionModal
            visible={isServiceModalVisible}
            services={services}
            selectedServiceId={selectedServiceId}
            onClose={() => setIsServiceModalVisible(false)}
            onSelect={handleSelectService}
        />
        </>
    );
};

export default ServiceStep;

const SectionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const Hint = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`
  margin-bottom: ${verticalScale(10)}px;
`;

const Message = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`
  padding: ${verticalScale(16)}px 0;
`;
