import React, { useState } from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { verticalScale } from '@utils/normalizedCss';
import SelectableCard from '../SelectableCard';
import ServiceSummaryCard from '../ServiceSummaryCard';
import ServiceSelectionModal from './ServiceSelectionModal';
import InfoNotice from '../InfoNotice';
import BottomActions from '../BottomActions';
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
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

    const handleSelectService = (serviceId: number) => {
        onSelectService(serviceId);
        setIsServiceModalVisible(false);
    };

    return (
        <>
        <ServiceSummaryCard
            title={service?.name || 'Type de service'}
            description={service?.description || 'Choisissez le service adapté à votre besoin'}
            image={require('@assets/images/electricien.png')}
            onEditPress={() => setIsServiceModalVisible(true)}
        />

        <SectionTitle>Type de service</SectionTitle>

        {servicesLoading ? (
            <Message>Chargement des pannes...</Message>
        ) : problemTypes.length === 0 ? (
            <Message>Les pannes de ce service ne sont pas encore disponibles.</Message>
        ) : (
            <>
                <Hint>Quelle panne rencontrez-vous ?</Hint>
                {problemTypes.map(item => (
                    <SelectableCard
                        key={item.id}
                        title={item.title}
                        description={item.description || 'Décrivez cette panne à notre expert.'}
                        icon="fa-building"
                        selected={selectedProblem === item.id}
                        onPress={() => onSelectProblem(item.id)}
                    />
                ))}
            </>
        )}

        <InfoNotice
            icon="fa-shield-alt"
            title="Professionnels qualifiés et vérifiés"
            description="Nos électriciens sont notés et évalués par nos clients."
        />

        <BottomActions
            primaryTitle="Continuer"
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
