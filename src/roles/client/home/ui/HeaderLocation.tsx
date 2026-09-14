// HeaderLocation.tsx
import React from 'react';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { selectAuthLoading, selectUser } from '@store/slices/authSlice';

const HeaderLocation = () => {
    const navigation = useNavigation();
    const user = useSelector(selectUser);
    const isLoading = useSelector(selectAuthLoading);

    // Extract name from nested client/professional data
    const displayName = user
        ? user.type === 'client' && user.client
            ? `${user.client.first_name} ${user.client.last_name}`.trim()
            : user.type === 'professional' && user.professional
            ? `${user.professional.first_name} ${user.professional.last_name}`.trim()
            : user.name || 'User'
        : 'User';
    return (
        <Container>
            <TopRow>
                <LocationRow>
                    <SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} />
                    <Text variant="medium" color="primary" fontSize={13}>
                        Ma position
                    </Text>
                    <SvgIcon name="fa-chevron-down" size={11} color={colors.primary} />
                </LocationRow>

                <Actions>

                    <IconButton onPress={() => navigation.navigate('Notifications' as never)}>
                        <SvgIcon name="fa-bell" size={20} color={colors.black} />
                        <Badge>
                            <Text variant="notification" color="white" fontWeight="700">
                                2
                            </Text>
                        </Badge>
                    </IconButton>
                </Actions>
            </TopRow>

            <Text variant="bold" color="black" fontSize={27} lineHeight={34}>
                Bienvenue,{' '}
                <Text variant="regular" color="black" fontSize={27} lineHeight={34}>
                    {isLoading ? 'Chargement...' : displayName}
                </Text>{' '}
                👋
            </Text>

            <Text
                variant="regular"
                color="gray600"
                fontSize={14}
                lineHeight={20}
                style={{ marginTop: verticalScale(4) }}
            >
                Comment pouvons-nous vous aider aujourd’hui ?
            </Text>

        </Container>
    );
};

export default HeaderLocation;

const Container = styled.View`
  margin-bottom: ${verticalScale(18)}px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const LocationRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
`;

const IconButton = styled.TouchableOpacity`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${horizontalScale(21)}px;
  background-color: rgba(255, 255, 255, 0.9);
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.06;
  shadow-radius: 10px;
  elevation: 3;
`;

const Badge = styled.View`
  position: absolute;
  top: -2px;
  right: -2px;
  width: ${horizontalScale(22)}px;
  height: ${horizontalScale(22)}px;
  border-radius: ${horizontalScale(11)}px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
`;