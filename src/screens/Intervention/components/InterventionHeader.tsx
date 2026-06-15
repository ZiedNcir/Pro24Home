// src/screens/intervention/components/InterventionHeader.tsx

import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';

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
    return (
        <Header>
            <IconButton onPress={onClose}>
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
  height: ${verticalScale(44)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const IconButton = styled.TouchableOpacity`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  justify-content: center;
  align-items: center;
`;