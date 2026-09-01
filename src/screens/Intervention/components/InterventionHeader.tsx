// src/screens/intervention/components/InterventionHeader.tsx

import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';

interface Props {
    title?: string;
    showHelp?: boolean;
    onClose?: () => void;
}

const InterventionHeader: React.FC<Props> = ({
    title = 'Nouvelle intervention',
    showHelp = true,
    onClose,
}) => {
    const navigation = useNavigation();

    return (
        <Header>
            <IconButton
                onPress={onClose || (() => navigation.goBack())}
                accessibilityRole="button"
                accessibilityLabel="Retour"
            >
                <SvgIcon name="fa-chevron-left" size={18} color={Colors.black} />
            </IconButton>

            <Text variant="bold" color="black" fontSize={16}>
                {title}
            </Text>

            <IconButton>
                {showHelp ? (
                    <SvgIcon name="fa-question-circle" size={18} color={Colors.black} />
                ) : null}
            </IconButton>
        </Header>
    );
};

export default InterventionHeader;

const Header = styled.View`
  min-height: ${verticalScale(52)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: ${Colors.white};
  border-width: 1px;
  border-color: #eeeeee;
  padding-horizontal: ${horizontalScale(6)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${verticalScale(4)}px;
`;

const IconButton = styled.TouchableOpacity`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  justify-content: center;
  align-items: center;
`;
