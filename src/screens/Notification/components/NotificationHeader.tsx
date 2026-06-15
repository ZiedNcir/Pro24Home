import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@theme/index';

const NotificationHeader = () => {
    const navigation = useNavigation();
    const appGoBack = () => {
        navigation.goBack();
    }

    return (
        <Header>
            <BackButton onPress={appGoBack}>
                <SvgIcon name="fa-chevron-left" size={22} color={colors.primary} />
            </BackButton>

            <TitleBlock>
                <Text variant="bold" color="black" fontSize={28} lineHeight={34}>
                    Notifications
                </Text>
                <Text variant="regular" color="gray600" fontSize={14}>
                    Restez informé de tout ce qui compte.
                </Text>
            </TitleBlock>


        </Header>
    );
};

export default NotificationHeader;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(22)}px;
`;

const BackButton = styled.TouchableOpacity`
  width: ${horizontalScale(52)}px;
  height: ${horizontalScale(52)}px;
  border-radius: ${horizontalScale(18)}px;
  background-color: rgba(255, 255, 255, 0.95);
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(14)}px;
  elevation: 3;
`;

const TitleBlock = styled.View`
  flex: 1;
`;

