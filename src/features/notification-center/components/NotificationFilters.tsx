import React from 'react';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon, IconName } from '@shared/ui/icon';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
import { useTheme } from '@theme';

export interface FilterItem {
    key: string;
    label: string;
    icon: IconName;
    count?: number;
}

export interface NotificationFiltersProps {
    filters: FilterItem[];
    activeFilter: string;
    onFilterChange: (filterKey: string) => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
    filters,
    activeFilter,
    onFilterChange,
}) => {
    const { theme } = useTheme();

    return (
        <Scroll horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(item => {
                const isActive = activeFilter === item.key;

                return (
                    <FilterButton
                        key={item.key}
                        activeOpacity={0.85}
                        isActive={isActive}
                        onPress={() => onFilterChange(item.key)}
                    >
                        <SvgIcon
                            name={item.icon}
                            size={18}
                            color={isActive ? theme.colors.primary : theme.colors.gray600}
                        />

                        <Text
                            variant="medium"
                            color={isActive ? 'primary' : 'black'}
                            fontSize={14}
                        >
                            {item.label}
                        </Text>

                        {item.count ? (
                            <Badge isActive={isActive}>
                                <Text variant="notification" color="white" fontWeight="700">
                                    {item.count}
                                </Text>
                            </Badge>
                        ) : null}
                    </FilterButton>
                );
            })}
        </Scroll>
    );
};

export default NotificationFilters;

const Scroll = styled.ScrollView`
  margin-horizontal: ${-horizontalScale(18)}px;
  padding-left: ${horizontalScale(18)}px;
`;

const FilterButton = styled.TouchableOpacity<{ isActive: boolean }>`
  height: ${verticalScale(48)}px;
  padding-horizontal: ${horizontalScale(18)}px;
  border-radius: ${moderateScale(24)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.borderLight)};
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
  margin-right: ${horizontalScale(12)}px;
  elevation: 2;
`;

const Badge = styled.View<{ isActive: boolean }>`
  width: ${horizontalScale(24)}px;
  height: ${horizontalScale(24)}px;
  border-radius: ${horizontalScale(12)}px;
  background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors.primary : theme.colors.gray500};
  justify-content: center;
  align-items: center;
`;
