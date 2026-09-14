import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme/index';

interface Props {
    title: string;
    description: string;
    image: ImageSourcePropType;
    onEditPress?: () => void;
}

const ServiceSummaryCard: React.FC<Props> = ({
    title,
    description,
    image,
    onEditPress,
}) => {
    return (
        <Card>
            <ServiceImage source={image} resizeMode="contain" />

            <Content>
                <Text variant="bold" color="black" fontSize={13}>
                    {title}
                </Text>

                <Text
                    variant="regularSmall"
                    color="gray600"
                    numberOfLines={1}
                    style={{ marginTop: verticalScale(3) }}
                >
                    {description}
                </Text>
            </Content>

            <EditButton onPress={onEditPress}>
                <Text variant="notification" color="primary" fontWeight="700">
                    Modifier
                </Text>
                <SvgIcon name="fa-chevron-right" size={10} color={colors.primary} />
            </EditButton>
        </Card>
    );
};

export default ServiceSummaryCard;

const Card = styled.View`
  min-height: ${verticalScale(62)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: ${Colors.white};
  border-width: 1px;
  border-color: #eeeeee;
  flex-direction: row;
  align-items: center;
  padding: ${horizontalScale(10)}px;
`;

const ServiceImage = styled(Image)`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${moderateScale(10)}px;
  margin-right: ${horizontalScale(10)}px;
`;

const Content = styled.View`
  flex: 1;
`;

const EditButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(4)}px;
`;