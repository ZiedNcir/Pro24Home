import React from 'react';
import {
    Image,
    ImageSourcePropType,
    TouchableOpacityProps,
} from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme/index';

export interface ICardServiceProps extends TouchableOpacityProps {
    title: string;
    description?: string;
    image: ImageSourcePropType;
    onClick?: () => void;
}

const CardService: React.FC<ICardServiceProps> = ({
    title,
    description,
    image,
    onClick,
    ...props
}) => {
    return (
        <Container activeOpacity={0.86} onPress={onClick} {...props}>
            <ImageBox>
                <ServiceImage source={image} resizeMode="contain" />
            </ImageBox>

            <Text variant="bold" color="black" fontSize={17} lineHeight={22}>
                {title}
            </Text>

            {description ? (
                <Text
                    variant="regularSmall"
                    color={colors.gray600}
                    fontSize={14}
                    style={{ marginTop: verticalScale(3) }}
                >
                    {description}
                </Text>
            ) : null}

            <ArrowButton>
                <SvgIcon name="fa-chevron-right" size={14} color={colors.primary} />
            </ArrowButton>
        </Container>
    );
};

export default CardService;

const Container = styled.TouchableOpacity`
  width: 48%;
  min-height: ${verticalScale(178)}px;
  margin-bottom: ${verticalScale(14)}px;
  padding: ${horizontalScale(14)}px;
  background-color: ${colors.white};
  border-radius: ${moderateScale(20)}px;
  border-width: 1px;
  border-color: #eeeeee;
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(6)}px;
  shadow-opacity: 0.05;
  shadow-radius: ${moderateScale(14)}px;
  elevation: 3;
`;

const ImageBox = styled.View`
  width: 100%;
  height: ${verticalScale(88)}px;
  border-radius: ${moderateScale(16)}px;
  background-color: #fbf4ef;
  justify-content: center;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
  overflow: hidden;
`;

const ServiceImage = styled(Image)`
  width: 88%;
  height: 88%;
`;

const ArrowButton = styled.View`
  position: absolute;
  right:0px;
  bottom: ${verticalScale(10)}px;
  right: ${horizontalScale(14)}px;
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  background-color: #fff1e8;
  justify-content: center;
  align-items: center;
`;