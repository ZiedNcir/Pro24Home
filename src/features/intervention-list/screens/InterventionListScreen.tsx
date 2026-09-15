import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon, type IconName } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionsQuery } from '@entities/intervention/api/intervention.api';
import type { Intervention } from '@entities/intervention/model';
import { selectIsProfessional } from '@store/slices/authSlice';
import {
    filterInterventions,
    getInterventionListCopy,
    getProfessionalEmptyStateCopy,
    getInterventionStatusColor,
    getInterventionStatusLabel,
    type InterventionFilter,
} from '@entities/intervention/model/intervention-presentation';

const FILTERS: Array<{ key: InterventionFilter; label: string }> = [
    { key: 'all', label: 'Toutes' },
    { key: 'active', label: 'En cours' },
    { key: 'completed', label: 'Terminées' },
];

const serviceIcon = (intervention: Intervention): IconName => {
    const name = `${intervention.service?.name || ''} ${intervention.title}`.toLowerCase();
    if (name.includes('plomb')) return 'fa-map-marker-alt';
    if (name.includes('peint')) return 'fa-file-alt';
    if (name.includes('serrur')) return 'fa-lock';
    return 'fa-building';
};

const formatDate = (value?: string) => {
    if (!value) return 'Date à confirmer';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date à confirmer';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ProfessionalEmpty = ({ onRefresh, copy }: { onRefresh: () => unknown; copy: ReturnType<typeof getProfessionalEmptyStateCopy> }) => (
    <ProfessionalEmptyState>
        <EmptyIllustration source={require('@assets/images/professional-empty-interventions.png')} resizeMode="contain" accessibilityLabel="Professionnel prêt à recevoir des demandes" />
        <EmptyTitle>{copy.heading}</EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
        <RefreshButton onPress={onRefresh} accessibilityRole="button" accessibilityLabel="Actualiser les demandes">
            <SvgIcon name="fa-sync-alt" size={18} color={colors.primary} />
            <Text variant="bold" color={colors.primary}>Actualiser</Text>
        </RefreshButton>
        <ReassuranceCard>
            <ReassuranceIcon><SvgIcon name="fa-shield-alt" size={22} color={colors.primary} /></ReassuranceIcon>
            <View style={styles.reassuranceCopy}>
                <Text variant="bold" color={colors.gray900}>{copy.reassuranceTitle}</Text>
                <Text variant="regularSmall" color={colors.gray700} style={styles.reassuranceDescription}>{copy.reassuranceDescription}</Text>
            </View>
        </ReassuranceCard>
    </ProfessionalEmptyState>
);

const InterventionListScreen = () => {
    const navigation = useNavigation();
    const isProfessional = useSelector(selectIsProfessional);
    const copy = getInterventionListCopy(isProfessional);
    const emptyStateCopy = getProfessionalEmptyStateCopy();
    const [filter, setFilter] = useState<InterventionFilter>('all');
    const { data, isLoading, isFetching, refetch } = useGetInterventionsQuery({ type: isProfessional ? 'professional' : 'client' });
    const interventions = useMemo(() => filterInterventions(data?.data || [], filter), [data?.data, filter]);

    const renderItem = ({ item }: { item: Intervention }) => (
        <InterventionCard
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir ${item.title}`}
            onPress={() => (navigation as any).navigate('InterventionDetail', { intervention_id: item.id })}
        >
            <ServiceIcon>
                <SvgIcon name={serviceIcon(item)} size={24} color={colors.primary} />
            </ServiceIcon>
            <CardContent>
                <CardTitle numberOfLines={1}>{item.title || item.service?.name || 'Intervention'}</CardTitle>
                <CardAddress numberOfLines={1}>{item.address?.address || (item as Intervention & { adress?: { address?: string } }).adress?.address || 'Adresse sélectionnée'}</CardAddress>
                <CardDate>{formatDate(item.scheduled_date || item.requested_date)}</CardDate>
            </CardContent>
            <CardAside>
                <StatusBadge background={getInterventionStatusColor(item.status)}>
                    <StatusText>{getInterventionStatusLabel(item.status)}</StatusText>
                </StatusBadge>
                <SvgIcon name="fa-chevron-right" size={14} color={colors.gray600} />
            </CardAside>
        </InterventionCard>
    );

    return (
        <ScreenContainer mode="light" paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)}>
            <ListHeader>
                <LogoMediumPro24Icon width={horizontalScale(112)} height={verticalScale(36)} />
                {!isProfessional && <NewButton onPress={() => (navigation as any).navigate('NewIntervention')}>
                    <SvgIcon name="fa-user-plus" size={14} color={colors.white} />
                    <Text variant="bold" color="white" fontSize={12}>Nouvelle intervention</Text>
                </NewButton>}
            </ListHeader>
            <Title>{copy.title}</Title>
            {!(isProfessional && !isLoading && interventions.length === 0) && <FilterRow>
                {FILTERS.map(item => (
                    <FilterButton key={item.key} active={filter === item.key} onPress={() => setFilter(item.key)}>
                        <FilterText active={filter === item.key}>{item.label}</FilterText>
                    </FilterButton>
                ))}
            </FilterRow>}
            {isLoading ? <Loading><ActivityIndicator color={colors.primary} /></Loading> : (
                <FlatList
                    data={interventions}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: verticalScale(110), gap: verticalScale(12) }}
                    refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={colors.primary} />}
                    ListEmptyComponent={isProfessional ? <ProfessionalEmpty onRefresh={refetch} copy={emptyStateCopy} /> : <Empty><Text variant="regularSmall" color="gray600">{copy.empty}</Text><NewButton onPress={() => (navigation as any).navigate('NewIntervention')}><Text variant="bold" color="white" fontSize={12}>Créer une intervention</Text></NewButton></Empty>}
                />
            )}
        </ScreenContainer>
    );
};

export default InterventionListScreen;

const ListHeader = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(20)}px;`;
const NewButton = styled.TouchableOpacity`height: ${verticalScale(42)}px; padding-horizontal: ${horizontalScale(13)}px; border-radius: ${moderateScale(12)}px; background-color: ${colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(7)}px;`;
const Title = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 23 })`margin-bottom: ${verticalScale(18)}px;`;
const FilterRow = styled.View`flex-direction: row; background-color: ${colors.white}; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: #eeeeee; padding: ${horizontalScale(4)}px; margin-bottom: ${verticalScale(16)}px;`;
const FilterButton = styled.TouchableOpacity<{ active: boolean }>`flex: 1; height: ${verticalScale(40)}px; align-items: center; justify-content: center; border-radius: ${moderateScale(10)}px; background-color: ${({ active }) => active ? colors.primary : 'transparent'};`;
const FilterText = styled(Text).attrs({ variant: 'bold', fontSize: 11 })<{ active: boolean }>`color: ${({ active }) => active ? colors.white : colors.gray600};`;
const InterventionCard = styled.TouchableOpacity`min-height: ${verticalScale(116)}px; border-radius: ${moderateScale(16)}px; background-color: ${colors.white}; padding: ${horizontalScale(14)}px; flex-direction: row; align-items: center; border-width: 1px; border-color: #eeeeee;`;
const ServiceIcon = styled.View`width: ${horizontalScale(56)}px; height: ${horizontalScale(56)}px; border-radius: ${moderateScale(14)}px; background-color: #fff1e8; align-items: center; justify-content: center;`;
const CardContent = styled.View`flex: 1; margin-left: ${horizontalScale(12)}px;`;
const CardTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 14 })``;
const CardAddress = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 11 })`margin-top: ${verticalScale(7)}px;`;
const CardDate = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 11 })`margin-top: ${verticalScale(5)}px;`;
const CardAside = styled.View`align-items: flex-end; justify-content: space-between; min-height: ${verticalScale(66)}px;`;
const StatusBadge = styled.View<{ background: string }>`padding: ${verticalScale(7)}px ${horizontalScale(8)}px; border-radius: ${moderateScale(9)}px; background-color: ${({ background }) => background};`;
const StatusText = styled(Text).attrs({ variant: 'bold', color: 'success', fontSize: 10 })``;
const Loading = styled.View`flex: 1; align-items: center; justify-content: center;`;
const Empty = styled.View`align-items: center; padding-top: ${verticalScale(44)}px; gap: ${verticalScale(16)}px;`;
const ProfessionalEmptyState = styled.View`align-items: center; padding: ${verticalScale(8)}px 0 ${verticalScale(28)}px;`;
const EmptyIllustration = styled(Image)`width: 100%; height: ${verticalScale(190)}px; margin-bottom: ${verticalScale(10)}px;`;
const EmptyTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 23 })`text-align: center;`;
const EmptyDescription = styled(Text).attrs({ variant: 'regular', color: 'gray700', fontSize: 15 })`text-align: center; line-height: 22px; margin: ${verticalScale(10)}px ${horizontalScale(18)}px ${verticalScale(18)}px;`;
const RefreshButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; padding: 0 ${horizontalScale(22)}px; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: ${colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(9)}px;`;
const ReassuranceCard = styled.View`width: 100%; margin-top: ${verticalScale(24)}px; padding: ${moderateScale(14)}px; border-radius: ${moderateScale(16)}px; background-color: #fff7f1; flex-direction: row; align-items: flex-start; gap: ${horizontalScale(12)}px;`;
const ReassuranceIcon = styled.View`width: ${moderateScale(42)}px; height: ${moderateScale(42)}px; border-radius: ${moderateScale(22)}px; background-color: #ffe9d9; align-items: center; justify-content: center;`;

const styles = StyleSheet.create({
    reassuranceCopy: { flex: 1 },
    reassuranceDescription: { marginTop: verticalScale(4), lineHeight: 19 },
});
