import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';
import SelectableCard from '../SelectableCard';
import type { Service } from '../../../../store/api/api.types';

interface Props {
    visible: boolean;
    services: Service[];
    selectedServiceId?: number;
    onClose: () => void;
    onSelect: (serviceId: number) => void;
}

const ServiceSelectionModal: React.FC<Props> = ({
    visible,
    services,
    selectedServiceId,
    onClose,
    onSelect,
}) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Backdrop>
            <Sheet>
                <Handle />
                <Header>
                    <Text variant="bold" color="black" fontSize={17}>Modifier le service</Text>
                    <CloseButton onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer">
                        <Text variant="bold" color="gray600" fontSize={18}>×</Text>
                    </CloseButton>
                </Header>
                <Text variant="regularSmall" color="gray600" style={{ marginBottom: verticalScale(14) }}>
                    Sélectionnez une catégorie de services.
                </Text>
                <List showsVerticalScrollIndicator={false}>
                    {services.map(service => (
                        <SelectableCard
                            key={service.id}
                            title={service.name}
                            description={service.description || 'Choisissez ce service pour votre intervention.'}
                            icon="fa-tools"
                            selected={service.id === selectedServiceId}
                            onPress={() => onSelect(service.id)}
                        />
                    ))}
                </List>
            </Sheet>
        </Backdrop>
    </Modal>
);

export default ServiceSelectionModal;

const Backdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.42);
`;

const Sheet = styled.View`
  max-height: 82%;
  padding: ${verticalScale(14)}px ${horizontalScale(18)}px ${verticalScale(24)}px;
  border-top-left-radius: ${moderateScale(24)}px;
  border-top-right-radius: ${moderateScale(24)}px;
  background-color: ${colors.white};
`;

const Handle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  background-color: #d9d9d9;
  align-self: center;
  margin-bottom: ${verticalScale(14)}px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${verticalScale(8)}px;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  background-color: #f5f5f5;
  align-items: center;
  justify-content: center;
`;

const List = styled.ScrollView``;
