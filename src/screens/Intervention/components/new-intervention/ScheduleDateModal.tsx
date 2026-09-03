import React, { useEffect, useState } from 'react';
import { Modal, Platform } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme/ThemeProvider';
import type { ScheduleDateModalProps } from './types';

const DatePicker = require('react-native-date-picker').default;

const ScheduleDateModal: React.FC<ScheduleDateModalProps> = ({
    visible,
    selectedDate,
    onClose,
    onConfirm,
}) => {
    const { theme, themeMode } = useTheme();
    const [draftDate, setDraftDate] = useState(selectedDate || new Date());

    useEffect(() => {
        if (visible) setDraftDate(selectedDate || new Date());
    }, [selectedDate, visible]);

    const confirm = () => {
        onConfirm(draftDate);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Backdrop>
                <Sheet style={{ backgroundColor: theme.colors.surface }}>
                    <Handle style={{ backgroundColor: theme.colors.border }} />
                    <Header>
                        <Text variant="bold" color="black" fontSize={17}>Choisir une date</Text>
                        <CloseButton
                            onPress={onClose}
                            accessibilityRole="button"
                            accessibilityLabel="Fermer"
                            style={{ backgroundColor: theme.colors.surfaceVariant }}
                        >
                            <Text variant="bold" color="gray600" fontSize={18}>×</Text>
                        </CloseButton>
                    </Header>

                    <Text variant="regularSmall" color="gray600" style={{ marginBottom: verticalScale(8) }}>
                        Sélectionnez le jour et l’heure de votre intervention.
                    </Text>

                    <DatePicker
                        mode="datetime"
                        date={draftDate}
                        minimumDate={new Date()}
                        locale="fr"
                        onDateChange={setDraftDate}
                        theme={Platform.OS === 'ios' ? themeMode : undefined}
                        androidVariant="nativeAndroid"
                    />

                    <Actions>
                        <CancelButton onPress={onClose}>
                            <Text variant="bold" color="gray700" fontSize={13}>Annuler</Text>
                        </CancelButton>
                        <ConfirmButton onPress={confirm}>
                            <Text variant="bold" color="white" fontSize={13}>Confirmer</Text>
                        </ConfirmButton>
                    </Actions>
                </Sheet>
            </Backdrop>
        </Modal>
    );
};

export default ScheduleDateModal;

const Backdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.42);
`;

const Sheet = styled.View`
  align-items: center;
  padding: ${verticalScale(14)}px ${horizontalScale(18)}px ${verticalScale(24)}px;
  border-top-left-radius: ${moderateScale(24)}px;
  border-top-right-radius: ${moderateScale(24)}px;
`;

const Handle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  align-self: center;
  margin-bottom: ${verticalScale(14)}px;
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${verticalScale(8)}px;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  align-items: center;
  justify-content: center;
`;

const Actions = styled.View`
  width: 100%;
  flex-direction: row;
  gap: ${horizontalScale(12)}px;
  margin-top: ${verticalScale(8)}px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  height: ${verticalScale(50)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 2;
  height: ${verticalScale(50)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;
