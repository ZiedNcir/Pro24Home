import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Image } from 'react-native';
import styled from 'styled-components/native';
import { Toast } from '@core/notifications/toast';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { useTheme } from '@theme';
import { useAppSelector } from '@store/hooks';
import { selectUser } from '@store/slices/authSlice';
import { useUpdateClientProfileMutation } from '@entities/user/api/user.api';
import { colors } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';

const ProfileScreen = () => {
    const { t } = useTranslation();
    const { themeMode } = useTheme();
    const user = useAppSelector(selectUser);
    const [updateClientProfile, { isLoading }] = useUpdateClientProfileMutation();
    const [firstName, setFirstName] = useState(user?.client?.first_name || '');
    const [lastName, setLastName] = useState(user?.client?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone_number || '');
    const [address, setAddress] = useState(user?.address?.[0]?.address || '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const editButtonScale = useState(() => new Animated.Value(1))[0];
    const [savedValues, setSavedValues] = useState({
        firstName: user?.client?.first_name || '',
        lastName: user?.client?.last_name || '',
        address: user?.address?.[0]?.address || '',
    });

    useEffect(() => {
        setFirstName(user?.client?.first_name || '');
        setLastName(user?.client?.last_name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone_number || '');
        setAddress(user?.address?.[0]?.address || '');
        setSavedValues({
            firstName: user?.client?.first_name || '',
            lastName: user?.client?.last_name || '',
            address: user?.address?.[0]?.address || '',
        });
    }, [user]);

    const displayName = useMemo(
        () => `${firstName} ${lastName}`.trim() || user?.name || t('client.profile.defaultName'),
        [firstName, lastName, user?.name, t],
    );

    const saveProfile = async () => {
        const nextErrors: Record<string, string> = {};
        if (!firstName.trim()) nextErrors.firstName = t('client.profile.firstNameRequired');
        if (!lastName.trim()) nextErrors.lastName = t('client.profile.lastNameRequired');
        if (!address.trim()) nextErrors.address = t('client.profile.addressRequired');

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const normalizedValues = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            address: address.trim(),
        };
        const changedFields: {
            first_name?: string;
            last_name?: string;
            address?: string;
        } = {};

        if (normalizedValues.firstName !== savedValues.firstName.trim()) changedFields.first_name = normalizedValues.firstName;
        if (normalizedValues.lastName !== savedValues.lastName.trim()) changedFields.last_name = normalizedValues.lastName;
        if (normalizedValues.address !== savedValues.address.trim()) changedFields.address = normalizedValues.address;

        if (Object.keys(changedFields).length === 0) {
            setIsEditing(false);
            return;
        }

        try {
            await updateClientProfile(changedFields).unwrap();
            setSavedValues(normalizedValues);
            setIsEditing(false);
            Toast.show(t('client.profile.updateSuccess'), { type: 'success', placement: 'bottom' });
        } catch (error: any) {
            Toast.show(error?.data?.message || t('client.profile.updateFailed'), { type: 'danger', placement: 'bottom' });
        }
    };

    const cancelEditing = () => {
        setFirstName(user?.client?.first_name || '');
        setLastName(user?.client?.last_name || '');
        setEmail(user?.email || '');
        setPhone(user?.phone_number || '');
        setAddress(user?.address?.[0]?.address || '');
        setErrors({});
        setIsEditing(false);
    };

    return (
        <ScreenContainer mode={themeMode} scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)} contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
            <InterventionHeader title={t('client.profile.title')} showHelp={false} />
            <ProfileIntro>
                <AvatarWrap>
                    <Avatar source={require('@assets/images/worker_avatar.png')} resizeMode="cover" />
                    <CameraButton accessibilityRole="button" accessibilityLabel={t('client.profile.editPhoto')}>
                        <SvgIcon name="fa-camera" size={15} color={colors.white} />
                    </CameraButton>
                </AvatarWrap>
                <Text variant="title" color="black" style={{ marginTop: verticalScale(12) }}>{displayName}</Text>
                <RoleBadge><SvgIcon name="fa-user" size={13} color={colors.primary} /><Text variant="bold" color={colors.primary} fontSize={12}>{t('client.profile.role')}</Text></RoleBadge>
                <IntroText>{t('client.profile.intro')}</IntroText>
            </ProfileIntro>

            <SectionHeader>
                <SectionTitle>{t('client.profile.personalInfo')}</SectionTitle>
                {!isEditing ? (
                    <AnimatedEditButton style={{ transform: [{ scale: editButtonScale }] }}>
                        <EditButton
                            onPress={() => setIsEditing(true)}
                            onPressIn={() => Animated.spring(editButtonScale, { toValue: 0.92, useNativeDriver: true }).start()}
                            onPressOut={() => Animated.spring(editButtonScale, { toValue: 1, useNativeDriver: true }).start()}
                            accessibilityRole="button"
                            accessibilityLabel={t('client.profile.editInfo')}
                        >
                            <SvgIcon name="fa-pen" size={13} color={colors.primary} />
                            <Text variant="bold" color={colors.primary} fontSize={12}>{t('client.profile.edit')}</Text>
                        </EditButton>
                    </AnimatedEditButton>
                ) : <EditingBadge><SvgIcon name="fa-pen" size={11} color={colors.primary} /><Text variant="notification" color={colors.primary}>{t('client.profile.editing')}</Text></EditingBadge>}
            </SectionHeader>
            <FormCard>
                <FormGroupTitle>{t('client.profile.identity')}</FormGroupTitle>
                <ProfileField editable={isEditing} icon="fa-user" label={t('ui.form.firstName.label')} value={firstName} error={errors.firstName} onChangeText={value => { setFirstName(value); setErrors(previous => ({ ...previous, firstName: '' })); }} />
                <ProfileField editable={isEditing} icon="fa-user" label={t('ui.form.lastName.label')} value={lastName} error={errors.lastName} onChangeText={value => { setLastName(value); setErrors(previous => ({ ...previous, lastName: '' })); }} last />
            </FormCard>

            <FormCard>
                <FormGroupTitle>{t('client.profile.coordinates')}</FormGroupTitle>
                <ProfileField editable={false} icon="fa-envelope-open-text" label={t('client.profile.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <ProfileField editable={false} icon="fa-user-circle" label={t('client.profile.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" last />
            </FormCard>

            <FormCard>
                <FormGroupTitle>{t('client.profile.mainAddress')}</FormGroupTitle>
                <ProfileField editable={isEditing} icon="fa-map-marker-alt" label={t('ui.form.address.label')} value={address} error={errors.address} onChangeText={value => { setAddress(value); setErrors(previous => ({ ...previous, address: '' })); }} last />
            </FormCard>

            {isEditing ? (
                <Actions>
                    <CancelButton onPress={cancelEditing} disabled={isLoading}>
                        <Text variant="bold" color="gray700" fontSize={13}>{t('common.actions.cancel')}</Text>
                    </CancelButton>
                    <SaveButton onPress={saveProfile} disabled={isLoading} activeOpacity={0.85}>
                        {isLoading ? <ActivityIndicator color={colors.white} /> : <><SvgIcon name="fa-check" size={16} color={colors.white} /><Text variant="bold" color={colors.white} fontSize={14}>{t('common.actions.save')}</Text></>}
                    </SaveButton>
                </Actions>
            ) : null}
        </ScreenContainer>
    );
};

interface ProfileFieldProps {
    icon: 'fa-user' | 'fa-envelope-open-text' | 'fa-user-circle' | 'fa-map-marker-alt';
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    error?: string;
    editable?: boolean;
    last?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences';
}

const ProfileField = ({ icon, label, value, onChangeText, last, error, editable = false, ...inputProps }: ProfileFieldProps) => (
    <FieldRow last={last}>
        <FieldIcon><SvgIcon name={icon} size={17} color={colors.primary} /></FieldIcon>
        <FieldContent editable={editable}>
            <Text variant="notification" color="gray600">{label}</Text>
            <FieldInput editable={editable} hasError={!!error} value={value} onChangeText={onChangeText} placeholder={label} placeholderTextColor="#9E9E9E" {...inputProps} />
            {error ? <ErrorText>{error}</ErrorText> : null}
        </FieldContent>
    </FieldRow>
);

export default ProfileScreen;

const ProfileIntro = styled.View`align-items: center; padding-vertical: ${verticalScale(18)}px;`;
const AvatarWrap = styled.View`position: relative;`;
const Avatar = styled(Image)`width: ${horizontalScale(118)}px; height: ${horizontalScale(118)}px; border-radius: ${horizontalScale(59)}px; border-width: 4px; border-color: ${colors.white};`;
const CameraButton = styled.TouchableOpacity`position: absolute; right: 0; bottom: 2px; width: ${horizontalScale(34)}px; height: ${horizontalScale(34)}px; border-radius: ${horizontalScale(17)}px; background-color: ${colors.primary}; align-items: center; justify-content: center; border-width: 3px; border-color: ${colors.white};`;
const RoleBadge = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(6)}px; background-color: #fff1e8; border-radius: ${moderateScale(16)}px; padding: ${verticalScale(6)}px ${horizontalScale(12)}px; margin-top: ${verticalScale(8)}px;`;
const IntroText = styled(Text).attrs({ variant: 'regular', color: 'gray600' })`text-align: center; margin-top: ${verticalScale(12)}px; max-width: ${horizontalScale(300)}px;`;
const SectionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`margin-bottom: ${verticalScale(10)}px;`;
const SectionHeader = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(10)}px;`;
const AnimatedEditButton = styled(Animated.View)``;
const EditButton = styled.TouchableOpacity`flex-direction: row; align-items: center; gap: ${horizontalScale(5)}px; padding: ${verticalScale(7)}px ${horizontalScale(10)}px; border-width: 1px; border-color: ${colors.primary}; border-radius: ${moderateScale(10)}px;`;
const FormCard = styled.View`border-width: 1px; border-color: #eeeeee; border-radius: ${moderateScale(16)}px; background-color: ${({ theme }) => theme.colors.surface}; padding-horizontal: ${horizontalScale(12)}px;`;
const FormGroupTitle = styled(Text).attrs({ variant: 'bold', color: 'gray700', fontSize: 12 })`padding-top: ${verticalScale(12)}px; padding-bottom: ${verticalScale(2)}px;`;
const FieldRow = styled.View<{ last?: boolean }>`min-height: ${verticalScale(68)}px; flex-direction: row; align-items: center; border-bottom-width: ${({ last }) => (last ? 0 : 1)}px; border-bottom-color: #eeeeee;`;
const FieldIcon = styled.View`width: ${horizontalScale(36)}px; height: ${horizontalScale(36)}px; border-radius: ${moderateScale(11)}px; background-color: #fff5ef; align-items: center; justify-content: center; margin-right: ${horizontalScale(10)}px;`;
const FieldContent = styled.View<{ editable?: boolean }>`flex: 1; border-width: ${({ editable }) => (editable ? 1 : 0)}px; border-color: ${({ editable }) => (editable ? '#FFB27A' : 'transparent')}; border-radius: ${moderateScale(9)}px; background-color: ${({ editable }) => (editable ? '#FFF8F3' : 'transparent')}; padding: ${({ editable }) => (editable ? `${verticalScale(5)}px ${horizontalScale(8)}px` : '0px')};`;
const FieldInput = styled.TextInput<{ hasError?: boolean }>`height: ${verticalScale(27)}px; padding: 0; color: ${colors.black}; font-family: Inter-Regular; font-size: 14px; border-bottom-width: ${({ hasError }) => (hasError ? 1 : 0)}px; border-bottom-color: ${colors.danger};`;
const ErrorText = styled(Text).attrs({ variant: 'notification', color: 'danger' })`margin-top: ${verticalScale(2)}px;`;
const EditingBadge = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(4)}px; padding: ${verticalScale(6)}px ${horizontalScale(8)}px; border-radius: ${moderateScale(9)}px; background-color: #fff1e8;`;
const Actions = styled.View`flex-direction: row; gap: ${horizontalScale(10)}px; margin-top: ${verticalScale(18)}px;`;
const CancelButton = styled.TouchableOpacity`flex: 1; height: ${verticalScale(52)}px; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: #e5e5e5; background-color: ${({ theme }) => theme.colors.surface}; align-items: center; justify-content: center;`;
const SaveButton = styled.TouchableOpacity`flex: 1.7; height: ${verticalScale(52)}px; border-radius: ${moderateScale(13)}px; background-color: ${colors.primary}; flex-direction: row; gap: ${horizontalScale(8)}px; align-items: center; justify-content: center; opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};`;
