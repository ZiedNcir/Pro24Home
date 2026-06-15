import React from 'react';
import { ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon, IconName } from '@components/Icon';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';

export interface NotificationItem {
    id: number;
    icon: IconName;
    title: string;
    description: string;
    time: string;
    image?: ImageSourcePropType;
    unread?: boolean;
    color?: 'success' | 'purple' | 'blue';
}

interface Props {
    item: NotificationItem;
    compact?: boolean;
    isLast?: boolean;
    onDelete?: (id: number) => void;
}

const getAccentColor = (item: NotificationItem) => {
    if (item.color === 'success') return colors.success;
    if (item.color === 'purple') return '#9B6BFF';
    if (item.color === 'blue') return '#1DA1F2';
    return colors.primary;
};

const NotificationCard: React.FC<Props> = ({ item, compact, isLast, onDelete }) => {
    const accent = getAccentColor(item);


    return (

        <Card unread={item.unread} compact={compact} isLast={isLast}>
            {item.unread && <UnreadDot />}

            <IconCircle color={accent}>
                <SvgIcon name={item.icon} size={26} color={accent} />
            </IconCircle>

            <Content>
                <Text variant="bold" color="black" fontSize={15} lineHeight={20}>
                    {item.title}
                </Text>

                <Text
                    variant="regular"
                    color="black"
                    fontSize={13}
                    lineHeight={19}
                    style={{ marginTop: verticalScale(3) }}
                >
                    {item.description}
                </Text>

                <Text
                    variant="regularSmall"
                    color={item.unread ? 'primary' : 'gray600'}
                    fontSize={12}
                    style={{ marginTop: verticalScale(4) }}
                >
                    {item.time}
                </Text>
            </Content>

            <ActionsContainer>
                {onDelete && (
                    <DeleteIcon onPress={() => onDelete(item.id)}>
                        <SvgIcon name="fa-trash" size={16} color={colors.danger} />
                    </DeleteIcon>
                )}
                <SvgIcon name="fa-chevron-right" size={16} color={colors.primary} />

            </ActionsContainer>
        </Card>

    );
};

export default NotificationCard;

const Card = styled.TouchableOpacity<{
    unread?: boolean;
    compact?: boolean;
    isLast?: boolean;
}>`
  min-height: ${verticalScale(100)}px;
  background-color: ${({ compact }) =>
        compact ? 'transparent' : 'rgba(255,255,255,0.96)'};
  border-radius: ${({ compact }) => (compact ? 0 : moderateScale(22))}px;
  border-width: ${({ unread, compact }) => (unread && !compact ? 2 : 0)}px;
  border-color: ${colors.primary};
  padding: ${horizontalScale(13)}px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ compact, isLast }) =>
        compact || !isLast ? 1 : 0}px;

  elevation: ${({ compact }) => (compact ? 0 : 3)};
`;

const UnreadDot = styled.View`
  position: absolute;
  left: ${-horizontalScale(8)}px;
  width: ${horizontalScale(14)}px;
  height: ${horizontalScale(14)}px;
  border-radius: ${horizontalScale(7)}px;
  background-color: ${colors.primary};
`;

const IconCircle = styled.View<{ color: string }>`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  border-radius: ${horizontalScale(34)}px;
  background-color: ${({ color }) => `${color}16`};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(14)}px;
`;

const Content = styled.View`
  flex: 1;
  padding-right: ${horizontalScale(10)}px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(8)}px;
`;

const DeleteIcon = styled.TouchableOpacity`
  padding: ${horizontalScale(4)}px;
  border-radius: ${moderateScale(4)}px;
  background-color: ${colors.gray100 || '#f5f5f5'};
`;

