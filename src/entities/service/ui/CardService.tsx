import React from 'react';
import {
    Image,
    ImageSourcePropType,
    TouchableOpacityProps,
} from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { useTheme } from '@theme';

export interface ICardServiceProps extends TouchableOpacityProps {
    title: string;
    description?: string;
    image: ImageSourcePropType;
    onClick?: () => void;
    selected?: boolean;
    layout?: 'grid' | 'row';
}

const CardService: React.FC<ICardServiceProps> = ({
    title,
    description,
    image,
    onClick,
    selected = false,
    layout = 'grid',
    ...props
}) => {
    const { theme } = useTheme();
    if (layout === 'row') {
        return (
            <RowCard
                accessibilityRole="button"
                accessibilityLabel={[title, description].filter(Boolean).join(', ')}
                accessibilityState={{ selected, disabled: !!props.disabled }}
                selected={selected}
                activeOpacity={0.86}
                onPress={onClick}
                {...props}
            >
                <Thumbnail source={image} resizeMode="cover" />
                <RowCopy>
                    <Text variant="bold" fontSize={16} lineHeight={21}>{title}</Text>
                    {description ? (
                        <Text variant="regularSmall" color={theme.colors.textSecondary} fontSize={13} lineHeight={18}>
                            {description}
                        </Text>
                    ) : null}
                </RowCopy>
                <SvgIcon name="fa-chevron-right" size={14} color={theme.colors.primary} />
            </RowCard>
        );
    }
    return (
        <Container selected={selected} activeOpacity={0.86} onPress={onClick} {...props}>
            <ImageBox>
                <ServiceImage source={image} resizeMode="contain" />
            </ImageBox>

            <Text variant="bold" color="black" fontSize={17} lineHeight={22}>
                {title}
            </Text>

            {description ? (
                <Text
                    variant="regularSmall"
                    color={theme.colors.textSecondary}
                    fontSize={14}
                    style={{ marginTop: verticalScale(3) }}
                >
                    {description}
                </Text>
            ) : null}

            <ArrowRow>
                <ArrowButton>
                    <SvgIcon name="fa-chevron-right" size={14} color={theme.colors.primary} />
                </ArrowButton>
            </ArrowRow>
        </Container>
    );
};

export default CardService;

const Container = styled.TouchableOpacity<{ selected: boolean }>`
  width: 48%;
  min-height: ${verticalScale(178)}px;
  margin-bottom: ${verticalScale(14)}px;
  padding: ${horizontalScale(14)}px;
  border-radius: ${moderateScale(20)}px;
  border-width: 1px;
  border-color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.borderLight)};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primaryLighter : theme.colors.surface)};
  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-offset: 0px ${verticalScale(6)}px;
  shadow-opacity: 0.05;
  shadow-radius: ${moderateScale(14)}px;
  elevation: 3;
`;

const ImageBox = styled.View`
  width: 100%;
  height: ${verticalScale(88)}px;
  border-radius: ${moderateScale(16)}px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
  justify-content: center;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
  overflow: hidden;
`;

const ServiceImage = styled(Image)`
  width: 88%;
  height: 88%;
`;

const ArrowRow = styled.View`
  align-items: flex-end;
  margin-top: auto;
  padding-top: ${verticalScale(6)}px;
`;

const ArrowButton = styled.View`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  justify-content: center;
  align-items: center;
`;

const RowCard = styled.TouchableOpacity<{ selected: boolean }>`
  width: 100%;
  min-height: 86px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 11px;
  padding-right: 15px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ selected, theme }) => selected ? theme.colors.primaryLighter : theme.colors.surface};
`;

const Thumbnail = styled(Image)`
  width: 64px;
  height: 64px;
  border-radius: 8px;
`;

const RowCopy = styled.View`
  flex: 1;
  min-width: 0px;
  gap: 4px;
`;
