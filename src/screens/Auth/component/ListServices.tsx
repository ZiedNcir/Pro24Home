// screens/auth/component/professional_form/ListeServices.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Pressable, Animated, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import type { Service } from '@store/api/api.types';
import { Text, SvgIcon } from '@components';
import { verticalScale, horizontalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme/ThemeProvider';

interface ListeServicesProps {
    services: Service[];
    selectedServices: number[];
    onSelect: (serviceIds: number[]) => void;

    /** show skeleton while fetching */
    loading?: boolean;

    /** optional skeleton rows count */
    skeletonRows?: number;
}


const ServiceItem = styled(Pressable) <{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(10)}px ${horizontalScale(10)}px;
  margin-bottom: ${verticalScale(8)}px;
  background-color: ${({ theme, selected }) =>
        selected ? theme.colors.primaryLighter : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  border-radius: 8px;
  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ selected }) => (selected ? 0.1 : 0.05)};
  shadow-radius: 3px;
  elevation: ${({ selected }) => (selected ? 3 : 1)};
`;

const ServiceContent = styled(View)`
  flex: 1;
  margin-left: ${horizontalScale(12)}px;
 
`;

const ServiceTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.sizes.title.small}px;
`;

const ServiceDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.sizes.headline.medium}px;
  margin-top: 2px;
`;

const CheckIcon = styled(View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const EmptyState = styled(View)`
  padding: ${verticalScale(40)}px;
  align-items: center;
  justify-content: center;
`;

/* -------------------------------------------------------------------------- */
/*                                  SKELETON                                  */
/* -------------------------------------------------------------------------- */

const SkeletonRowContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(12)}px ${horizontalScale(16)}px;
  margin-bottom: ${verticalScale(8)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const SkeletonCircle = styled(Animated.View)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const SkeletonLine = styled(Animated.View)`
  height: 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const ServicesSkeleton = ({ rows = 6 }: { rows?: number }) => {
    const shimmer = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();
        return () => loop.stop();
    }, [shimmer]);

    const opacity = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.85],
    });

    return (
        <View style={styles.list}>
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRowContainer key={i}>
                    <SkeletonCircle style={{ opacity }} />
                    <View style={{ flex: 1, marginLeft: horizontalScale(12) }}>
                        <SkeletonLine style={{ width: '60%', opacity }} />
                        <View style={{ height: verticalScale(6) }} />
                        <SkeletonLine style={{ width: '85%', height: 12, opacity }} />
                    </View>
                </SkeletonRowContainer>
            ))}
        </View>
    );
};

const ListeServices = ({
    services,
    selectedServices,
    onSelect,
    loading = false,
    skeletonRows = 6,
}: ListeServicesProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const screen_width = useWindowDimensions().width;

    const toggleService = (serviceId: number) => {
        const newSelection = [...selectedServices];
        const index = newSelection.indexOf(serviceId);

        if (index > -1) newSelection.splice(index, 1);
        else newSelection.push(serviceId);

        onSelect(newSelection);
    };

    // ✅ Skeleton while fetching
    if (loading) {
        return <ServicesSkeleton rows={skeletonRows} />;
    }

    // ✅ Empty state
    if (!services || services.length === 0) {
        return (
            <EmptyState>
                <SvgIcon name="fa-folder-open" size={48} color={theme.colors.textDisabled} />
                <Text variant="medium" color={theme.colors.textSecondary} style={styles.emptyText}>
                    {t('ui.form.services.empty')}
                </Text>
            </EmptyState>
        );
    }

    const renderServiceItem = ({ item }: { item: Service }) => {
        const isSelected = selectedServices.includes(item.id);


        return (
            <ServiceItem selected={isSelected} onPress={() => toggleService(item.id)} style={{ width: screen_width - horizontalScale(32) }}>
                {item.icon ? (
                    <SvgIcon
                        name={item.icon as any}
                        size={24}
                        color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                    />
                ) : null}

                <ServiceContent>
                    <ServiceTitle variant="medium">{item.name}</ServiceTitle>
                    {item.description ? (
                        <ServiceDescription variant="regular">
                            {item.description}
                        </ServiceDescription>
                    ) : null}
                </ServiceContent>

                {isSelected ? (
                    <CheckIcon>
                        <SvgIcon name="fa-check" size={14} color={theme.colors.textInverse} />
                    </CheckIcon>
                ) : null}
            </ServiceItem>
        );
    };

    return (
        <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            extraData={selectedServices}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingBottom: verticalScale(2),

    },
    emptyText: {
        marginTop: verticalScale(16),
        textAlign: 'center',
    },
});

export default ListeServices;
