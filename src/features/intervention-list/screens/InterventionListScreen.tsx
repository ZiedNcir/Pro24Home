import { useGetLocalInterventionsQuery } from '@entities/intervention/api/local-interventions.api';
import { localInterventionToDisplay } from '@entities/intervention/model/local-interventions';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon, type IconName } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useTheme } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionsQuery } from '@entities/intervention/api/intervention.api';
import type { Intervention } from '@entities/intervention/model';
import { selectIsProfessional, selectUser } from '@store/slices/authSlice';
import {
    filterInterventions,
    getInterventionListCopy,
    getProfessionalEmptyStateCopy,
    getInterventionStatusColor,
    getInterventionStatusTextColor,
    getInterventionStatusLabel,
    type InterventionFilter,
} from '@entities/intervention/model/intervention-presentation';

const FILTERS: Array<{ key: InterventionFilter; labelKey: string }> = [
    { key: 'all', labelKey: 'intervention.list.all' },
    { key: 'active', labelKey: 'intervention.list.active' },
    { key: 'completed', labelKey: 'intervention.list.completed' },
];

const serviceIcon = (intervention: Intervention): IconName => {
    const name = `${intervention.service?.name || ''} ${intervention.title}`.toLowerCase();
    if (name.includes('plomb')) return 'fa-map-marker-alt';
    if (name.includes('peint')) return 'fa-file-alt';
    if (name.includes('serrur')) return 'fa-lock';
    return 'fa-building';
};

const formatDate = (value: string | undefined, locale: string, fallback: string) => {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
};

const ProfessionalEmpty = ({ onRefresh, copy, t }: { onRefresh: () => unknown; copy: ReturnType<typeof getProfessionalEmptyStateCopy>; t: (key: any) => string }) => {
    const { theme } = useTheme();
    const colors = theme.colors;
    return (
    <ProfessionalEmptyState>
        <EmptyIllustration source={require('@assets/images/professional-empty-interventions.png')} resizeMode="contain" accessibilityLabel={t('intervention.list.ready')} />
        <EmptyTitle>{copy.heading}</EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
        <RefreshButton onPress={onRefresh} accessibilityRole="button" accessibilityLabel={t('intervention.list.refresh')}>
            <SvgIcon name="fa-sync-alt" size={18} color={colors.primary} />
            <Text variant="bold" color={colors.primary}>{t('intervention.list.refreshShort')}</Text>
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
};

const InterventionListScreen = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const navigation = useNavigation();
    const isProfessional = useSelector(selectIsProfessional);
    const user = useSelector(selectUser);
    const localQuery = useGetLocalInterventionsQuery(user?.id ?? 0, { skip: !user || isProfessional, refetchOnMountOrArgChange: true });
    const copy = getInterventionListCopy(isProfessional);
    const emptyStateCopy = getProfessionalEmptyStateCopy();
    const [filter, setFilter] = useState<InterventionFilter>('all');
    const { data, isLoading, isFetching, isError, refetch } = useGetInterventionsQuery({ type: isProfessional ? 'professional' : 'client' });
    const interventions = useMemo(() => filterInterventions([
        ...(!isProfessional && user ? (localQuery.currentData || []).map(record => localInterventionToDisplay(record, user.id)) : []),
        ...(data?.data || []),
    ], filter), [data?.data, filter, isProfessional, localQuery.currentData, user]);

    const renderItem = ({ item }: { item: Intervention }) => (
        <InterventionCard
            accessibilityRole="button"
            accessibilityLabel={t('intervention.list.openIntervention', { title: item.title })}
            onPress={() => (navigation as any).navigate('InterventionDetail', { intervention_id: item.id, localInterventionId: (item as Intervention & { localId?: string }).localId })}
        >
            <ServiceIcon>
                <SvgIcon name={serviceIcon(item)} size={24} color={colors.primary} />
            </ServiceIcon>
            <CardContent>
                <CardTitle numberOfLines={1}>{item.title || item.service?.name || t('intervention.list.fallbackTitle')}</CardTitle>
                <CardAddress numberOfLines={1}>{item.address?.address || (item as Intervention & { adress?: { address?: string } }).adress?.address || t('intervention.list.fallbackAddress')}</CardAddress>
                <CardDate>{formatDate(item.scheduled_date || item.requested_date, i18n.language, t('intervention.list.dateTbd'))}</CardDate>
            </CardContent>
            <CardAside>
                <StatusBadge background={getInterventionStatusColor(item.status, colors)}>
                    <StatusText color={getInterventionStatusTextColor(item.status, colors)}>{getInterventionStatusLabel(item.status)}</StatusText>
                </StatusBadge>
                <SvgIcon name="fa-chevron-right" size={14} color={colors.gray600} />
            </CardAside>
        </InterventionCard>
    );

    return (
        <ScreenContainer paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)}>
            <ListHeader>
                <LogoMediumPro24Icon width={horizontalScale(112)} height={verticalScale(36)} />
                {!isProfessional && <NewButton onPress={() => (navigation as any).navigate('NewIntervention')}>
                    <SvgIcon name="fa-user-plus" size={14} color={colors.white} />
                    <Text variant="bold" color="white" fontSize={12}>{t('intervention.list.new')}</Text>
                </NewButton>}
            </ListHeader>
            <Title>{copy.title}</Title>
            {localQuery.isError ? <Text color="danger" onPress={() => localQuery.refetch()}>{t('intervention.local.loadFailed')}</Text> : null}
            {!(isProfessional && !isLoading && interventions.length === 0) && <FilterRow>
                {FILTERS.map(item => (
                    <FilterButton key={item.key} active={filter === item.key} onPress={() => setFilter(item.key)}>
                        <FilterText active={filter === item.key}>{t(item.labelKey)}</FilterText>
                    </FilterButton>
                ))}
            </FilterRow>}
            {(isLoading || localQuery.isLoading) && interventions.length === 0 ? <Loading><ActivityIndicator color={colors.primary} /></Loading> : (
                <FlatList
                    data={interventions}
                    keyExtractor={item => (item as Intervention & { localId?: string }).localId || String(item.id)}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: verticalScale(110), gap: verticalScale(12) }}
                    refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={colors.primary} />}
                    ListEmptyComponent={isProfessional ? <ProfessionalEmpty onRefresh={refetch} copy={emptyStateCopy} t={t} /> : (filter === 'active' || filter === 'completed') && (isError || localQuery.isError) ? <Empty><Text color="danger" onPress={() => { if (isError) refetch(); if (localQuery.isError) localQuery.refetch(); }}>{t('intervention.detail.loadFailed')}</Text></Empty> : (filter === 'active' || filter === 'completed') ? <ClientActiveEmpty>
                        <ClientActiveIllustration source={require('@assets/images/client-in-progress-empty.png')} resizeMode="contain" accessible={false} />
                        <Text variant="bold" fontSize={23} lineHeight={30} color={colors.textPrimary} style={{ textAlign: 'center' }}>{t(filter === 'completed' ? 'intervention.list.emptyCompletedTitle' : 'intervention.list.emptyActiveTitle')}</Text>
                        <Text variant="regular" fontSize={15} lineHeight={22} color={colors.textSecondary} style={{ textAlign: 'center' }}>{t(filter === 'completed' ? 'intervention.list.emptyCompletedDescription' : 'intervention.list.emptyActiveDescription')}</Text>
                    </ClientActiveEmpty> : <Empty><Text variant="regularSmall" color="gray600">{copy.empty}</Text><NewButton onPress={() => (navigation as any).navigate('NewIntervention')}><Text variant="bold" color="white" fontSize={12}>{t('intervention.list.create')}</Text></NewButton></Empty>}
                />
            )}
        </ScreenContainer>
    );
};

export default InterventionListScreen;

const ListHeader = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(20)}px;`;
const NewButton = styled.TouchableOpacity`height: ${verticalScale(42)}px; padding-horizontal: ${horizontalScale(13)}px; border-radius: ${moderateScale(12)}px; background-color: ${({ theme }) => theme.colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(7)}px;`;
const Title = styled(Text).attrs(({ theme }) => ({ variant: 'bold', color: theme.colors.textPrimary, fontSize: 23 }))`margin-bottom: ${verticalScale(18)}px;`;
const FilterRow = styled.View`flex-direction: row; background-color: ${({ theme }) => theme.colors.surface}; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: ${({ theme }) => theme.colors.border}; padding: ${horizontalScale(4)}px; margin-bottom: ${verticalScale(16)}px;`;
const FilterButton = styled.TouchableOpacity<{ active: boolean }>`flex: 1; height: ${verticalScale(40)}px; align-items: center; justify-content: center; border-radius: ${moderateScale(10)}px; background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};`;
const FilterText = styled(Text).attrs(({ theme }) => ({ variant: 'bold', fontSize: 11, color: theme.colors.textPrimary }))<{ active: boolean }>`color: ${({ active, theme }) => active ? theme.colors.textInverse : theme.colors.textPrimary};`;
const InterventionCard = styled.TouchableOpacity`min-height: ${verticalScale(116)}px; border-radius: ${moderateScale(16)}px; background-color: ${({ theme }) => theme.colors.surface}; padding: ${horizontalScale(14)}px; flex-direction: row; align-items: center; border-width: 1px; border-color: ${({ theme }) => theme.colors.border};`;
const ServiceIcon = styled.View`width: ${horizontalScale(56)}px; height: ${horizontalScale(56)}px; border-radius: ${moderateScale(14)}px; background-color: ${({ theme }) => theme.colors.primaryLighter}; align-items: center; justify-content: center;`;
const CardContent = styled.View`flex: 1; margin-left: ${horizontalScale(12)}px;`;
const CardTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 14 })``;
const CardAddress = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 11 })`margin-top: ${verticalScale(7)}px;`;
const CardDate = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 11 })`margin-top: ${verticalScale(5)}px;`;
const CardAside = styled.View`align-items: flex-end; justify-content: space-between; min-height: ${verticalScale(66)}px;`;
const StatusBadge = styled.View<{ background: string }>`padding: ${verticalScale(7)}px ${horizontalScale(8)}px; border-radius: ${moderateScale(9)}px; background-color: ${({ background }) => background};`;
const StatusText = styled(Text).attrs({ variant: 'bold', fontSize: 10 })``;
const Loading = styled.View`flex: 1; align-items: center; justify-content: center;`;
const Empty = styled.View`align-items: center; padding-top: ${verticalScale(44)}px; gap: ${verticalScale(16)}px;`;
const ProfessionalEmptyState = styled.View`align-items: center; padding: ${verticalScale(8)}px 0 ${verticalScale(28)}px;`;
const EmptyIllustration = styled(Image)`width: 100%; height: ${verticalScale(190)}px; margin-bottom: ${verticalScale(10)}px;`;
const EmptyTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 23 })`text-align: center;`;
const EmptyDescription = styled(Text).attrs({ variant: 'regular', color: 'gray700', fontSize: 15 })`text-align: center; line-height: 22px; margin: ${verticalScale(10)}px ${horizontalScale(18)}px ${verticalScale(18)}px;`;
const RefreshButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; padding: 0 ${horizontalScale(22)}px; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: ${({ theme }) => theme.colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(9)}px;`;
const ReassuranceCard = styled.View`width: 100%; margin-top: ${verticalScale(24)}px; padding: ${moderateScale(14)}px; border-radius: ${moderateScale(16)}px; background-color: ${({ theme }) => theme.colors.surfaceVariant}; flex-direction: row; align-items: flex-start; gap: ${horizontalScale(12)}px;`;
const ReassuranceIcon = styled.View`width: ${moderateScale(42)}px; height: ${moderateScale(42)}px; border-radius: ${moderateScale(22)}px; background-color: ${({ theme }) => theme.colors.primaryLighter}; align-items: center; justify-content: center;`;

const styles = StyleSheet.create({
    reassuranceCopy: { flex: 1 },
    reassuranceDescription: { marginTop: verticalScale(4), lineHeight: 19 },
});

const ClientActiveEmpty = styled.View`
  align-items: center;
  padding-top: ${verticalScale(56)}px;
  padding-horizontal: ${horizontalScale(12)}px;
  gap: ${verticalScale(12)}px;
`;
const ClientActiveIllustration = styled(Image)`
  width: 210px;
  height: 210px;
`;
