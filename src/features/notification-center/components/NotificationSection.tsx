import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { verticalScale } from '@utils/normalizedCss';
import NotificationCard, { NotificationItem } from './NotificationCard';

interface Props {
    title: string;
    data: NotificationItem[];
    grouped?: boolean;
    onDelete?: (id: number) => void;
}

const NotificationSection: React.FC<Props> = ({ title, data, grouped, onDelete }) => {
    return (
        <Wrapper>
            <Text
                variant="bold"
                color="black"
                fontSize={16}
                style={{ marginBottom: verticalScale(12) }}
            >
                {title}
            </Text>

            {grouped ? (
                <GroupCard>
                    {data.map((item, index) => (
                        <NotificationCard
                            key={item.id}
                            item={item}
                            compact
                            isLast={index === data.length - 1}
                            onDelete={onDelete}
                        />
                    ))}
                </GroupCard>
            ) : (
                <List>
                    {data.map(item => (
                        <NotificationCard key={item.id} item={item} onDelete={onDelete} />
                    ))}
                </List>
            )}
        </Wrapper>
    );
};

export default NotificationSection;

const Wrapper = styled.View``;

const List = styled.View`
  gap: ${verticalScale(12)}px;
`;

const GroupCard = styled.View`
  background-color: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  overflow: hidden;
  elevation: 3;
`;