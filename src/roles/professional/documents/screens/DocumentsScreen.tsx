import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { Toast } from '@core/notifications/toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useGetProfileQuery } from '@entities/user/api/user.api';
import { useUploadDocumentMutation } from '@roles/professional/documents/api/documents.api';
import { selectUser } from '@store/slices/authSlice';
import type { Document, DocumentType } from '@entities/user/model';
import { colors } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import type { AppStackType } from '../../../../navigation/constant/core';
import {
    getDocumentForType,
    getDocumentProgress,
    PROFESSIONAL_DOCUMENTS,
} from '@roles/professional/documents/model/professional-documents';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const HomeProfessional = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackType>>();
    const user = useSelector(selectUser);
    const { data, isFetching, refetch } = useGetProfileQuery();
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
    const documents = useMemo<Document[]>(() => data?.data?.documents ?? user?.documents ?? [], [data?.data?.documents, user?.documents]);
    const progress = getDocumentProgress(documents);
    const firstMissing = PROFESSIONAL_DOCUMENTS.find(item => getDocumentForType(documents, item.name)?.status !== 'approved')?.name ?? 'identity_front';
    const [activeType, setActiveType] = useState<DocumentType>(firstMissing);

    const activeDocument = getDocumentForType(documents, activeType);
    const remainingDocuments = PROFESSIONAL_DOCUMENTS.filter(item => item.name !== activeType && getDocumentForType(documents, item.name)?.status !== 'approved');
    const activeMeta = PROFESSIONAL_DOCUMENTS.find(item => item.name === activeType) ?? PROFESSIONAL_DOCUMENTS[0];

    const handleUpload = async (file: { uri: string; type?: string | null; name?: string | null; size?: number | null }) => {
        if (!file.uri) return;
        if (file.size && file.size > MAX_FILE_SIZE) {
            Alert.alert(t('professional.documents.fileTooLarge'), t('professional.documents.fileTooLargeDescription'));
            return;
        }

        try {
            await uploadDocument({
                file: {
                    uri: file.uri,
                    type: file.type || 'image/jpeg',
                    name: file.name || `document-${activeType}.${file.type === 'application/pdf' ? 'pdf' : 'jpg'}`,
                },
                type: file.type === 'application/pdf' ? 'pdf' : 'img',
                name: activeType,
            }).unwrap();
            await refetch();
            Toast.show(t('professional.documents.uploadSuccess'), { type: 'success', placement: 'bottom' });
        } catch (error: any) {
            Toast.show(error?.data?.message || t('professional.documents.uploadFailed'), { type: 'danger', placement: 'bottom' });
        }
    };

    const chooseFile = async () => {
        try {
            const file = await DocumentPicker.pickSingle({ type: [types.images, types.pdf], copyTo: 'cachesDirectory' });
            await handleUpload(file);
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                Toast.show(t('professional.documents.openFailed'), { type: 'danger', placement: 'bottom' });
            }
        }
    };

    const takePhoto = async () => {
        const result = await launchCamera({ mediaType: 'photo', cameraType: 'back', saveToPhotos: false, quality: 0.8 });
        if (result.didCancel) return;
        if (result.errorCode) {
            Toast.show(result.errorMessage || t('professional.documents.cameraUnavailable'), { type: 'danger', placement: 'bottom' });
            return;
        }
        const asset = result.assets?.[0];
        if (asset?.uri) {
            await handleUpload({ uri: asset.uri, type: asset.type, name: asset.fileName, size: asset.fileSize });
        }
    };

    const continueToNext = () => {
        const next = remainingDocuments[0];
        if (next) setActiveType(next.name);
    };

    if (!activeMeta) return null;

    return (
        <ScreenContainer scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)} backgroundColor={colors.white}>
            <Header>
                <BackButton accessibilityRole="button" accessibilityLabel={t('professional.documents.back')} onPress={() => navigation.canGoBack() && navigation.goBack()}>
                    <SvgIcon name="fa-chevron-left" size={22} color={colors.gray900} />
                </BackButton>
                <LogoMediumPro24Icon width={moderateScale(104)} height={moderateScale(34)} />
                <HelpButton accessibilityRole="button" accessibilityLabel={t('professional.documents.help')} onPress={() => Alert.alert(t('professional.documents.verificationTitle'), t('professional.documents.verificationDescription'))}>
                    <SvgIcon name="fa-question" size={16} color={colors.white} />
                </HelpButton>
            </Header>

            <ProgressTrack>
                <ProgressStep done={progress.completed > 0}><StepCircle done={progress.completed > 0}><Text variant="bold" color={progress.completed > 0 ? colors.success : colors.gray900}>{progress.completed > 0 ? '✓' : '1'}</Text></StepCircle><Text variant="regularSmall" color={colors.gray800}>{t('professional.documents.stepInfo')}</Text></ProgressStep>
                <ProgressLine />
                <ProgressStep active><StepCircle active><Text variant="bold" color={colors.white}>{progress.completed < progress.total ? '2' : '✓'}</Text></StepCircle><Text variant="regularSmall" color={colors.gray800}>{t('professional.documents.stepDocuments')}</Text></ProgressStep>
                <ProgressLine />
                <ProgressStep><StepCircle><Text variant="bold" color={colors.gray900}>3</Text></StepCircle><Text variant="regularSmall" color={colors.gray800}>{t('professional.documents.stepValidation')}</Text></ProgressStep>
            </ProgressTrack>

            <Text variant="title" color={colors.gray900} style={styles.heading}>{t('professional.documents.step')}</Text>
            <Text variant="regular" color={colors.gray700} style={styles.subtitle}>{t('professional.documents.subtitle')}</Text>

            <CurrentCard>
                <CurrentIntro>
                    <DocumentIcon><SvgIcon name={activeMeta.icon} size={30} color={colors.primary} /></DocumentIcon>
                    <View style={styles.currentText}>
                        <Badge>{activeDocument?.status === 'rejected' ? t('professional.documents.fix') : activeDocument ? t('professional.documents.pending') : t('professional.documents.inProgress')}</Badge>
                        <Text variant="bold" color={colors.gray900} style={styles.cardTitle}>{t(activeMeta.titleKey)}</Text>
                        <Text variant="regular" color={colors.gray700}>{t(activeMeta.descriptionKey)}</Text>
                    </View>
                </CurrentIntro>
                <UploadArea>
                    {isUploading ? <ActivityIndicator color={colors.primary} size="large" /> : <SvgIcon name="fa-file-upload" size={34} color={colors.primary} />}
                    <Text variant="bold" color={colors.gray900} style={styles.uploadTitle}>{isUploading ? t('professional.documents.uploading') : t('professional.documents.addFile')}</Text>
                    {!isUploading && <Text variant="regular" color={colors.gray600}>{t('professional.documents.chooseOption')}</Text>}
                    <ActionRow>
                        <UploadAction disabled={isUploading} onPress={chooseFile} accessibilityRole="button">
                            <SvgIcon name="fa-file-alt" size={18} color={colors.primary} /><Text variant="bold" color={colors.gray900} style={styles.actionLabel}>{t('professional.documents.chooseFile')}</Text>
                        </UploadAction>
                        <UploadAction disabled={isUploading} onPress={takePhoto} accessibilityRole="button">
                            <SvgIcon name="fa-camera" size={18} color={colors.primary} /><Text variant="bold" color={colors.gray900} style={styles.actionLabel}>{t('professional.documents.takePhoto')}</Text>
                        </UploadAction>
                    </ActionRow>
                    <Text variant="regularSmall" color={colors.gray600}>{t('professional.documents.fileFormats')}</Text>
                </UploadArea>
            </CurrentCard>

            {remainingDocuments.length > 0 && <Text variant="bold" color={colors.gray900} style={styles.sectionTitle}>{t('professional.documents.remaining')}</Text>}
            <QueueCard>
                {remainingDocuments.slice(0, 3).map((item, index) => (
                    <QueueItem key={item.name} isLast={index === Math.min(remainingDocuments.length, 3) - 1} onPress={() => setActiveType(item.name)} accessibilityRole="button">
                        <SmallDocumentIcon><SvgIcon name={item.icon} size={18} color={colors.primary} /></SmallDocumentIcon>
                        <View style={styles.queueText}><Text variant="bold" color={colors.gray900}>{t(item.titleKey)}</Text><Text variant="regularSmall" color={colors.gray600}>{t(item.descriptionKey)}</Text></View>
                        <QueueCircle active={item.name === activeType}>{item.name === activeType ? '•' : ''}</QueueCircle>
                    </QueueItem>
                ))}
            </QueueCard>

            <SecurityNotice><SvgIcon name="fa-shield-alt" size={28} color={colors.primary} /><View style={styles.securityText}><Text variant="bold" color={colors.gray900}>{t('professional.documents.secureTitle')}</Text><Text variant="regularSmall" color={colors.gray700}>{t('professional.documents.secureDescription')}</Text></View><SvgIcon name="fa-info" size={16} color={colors.gray700} /></SecurityNotice>

            <ContinueButton disabled={isUploading || activeDocument?.status !== 'approved'} onPress={continueToNext} accessibilityRole="button">
                <Text variant="bold" color={colors.white}>{t('professional.documents.continue')}</Text><SvgIcon name="fa-chevron-right" size={18} color={colors.white} />
            </ContinueButton>
            <Text variant="regularSmall" color={colors.gray600} style={styles.counter}>{progress.completed}/{progress.total} {t('professional.documents.validated')}</Text>
            {isFetching && <ActivityIndicator color={colors.primary} style={styles.refreshIndicator} />}
        </ScreenContainer>
    );
};

const Header = styled.View`height: ${verticalScale(64)}px; border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(18)}px; flex-direction: row; align-items: center; justify-content: center; margin-bottom: ${verticalScale(22)}px;`;
const BackButton = styled(Pressable)`position: absolute; left: ${horizontalScale(12)}px; padding: ${moderateScale(9)}px;`;
const HelpButton = styled(Pressable)`position: absolute; right: ${horizontalScale(12)}px; width: ${moderateScale(32)}px; height: ${moderateScale(32)}px; border-radius: ${moderateScale(18)}px; background-color: ${colors.gray900}; align-items: center; justify-content: center;`;
const ProgressTrack = styled.View`flex-direction: row; align-items: flex-start; justify-content: center; margin-bottom: ${verticalScale(24)}px;`;
const ProgressStep = styled.View<{ active?: boolean; done?: boolean }>`align-items: center; width: ${horizontalScale(82)}px; gap: ${verticalScale(6)}px;`;
const StepCircle = styled.View<{ active?: boolean; done?: boolean }>`width: ${moderateScale(42)}px; height: ${moderateScale(42)}px; border-radius: ${moderateScale(24)}px; align-items: center; justify-content: center; background-color: ${({ active, done }) => active ? colors.primary : done ? colors.successLight : colors.gray100}; color: ${({ active, done }) => active || done ? colors.white : colors.gray900};`;
const ProgressLine = styled.View`height: 1px; background-color: ${colors.gray300}; width: ${horizontalScale(18)}px; margin-top: ${verticalScale(21)}px;`;
const CurrentCard = styled.View`background-color: #fff6f0; border-radius: ${moderateScale(18)}px; padding: ${moderateScale(16)}px; margin-bottom: ${verticalScale(22)}px;`;
const CurrentIntro = styled.View`flex-direction: row; align-items: center; margin-bottom: ${verticalScale(16)}px;`;
const DocumentIcon = styled.View`width: ${moderateScale(66)}px; height: ${moderateScale(66)}px; border-radius: ${moderateScale(16)}px; background-color: #ffeadb; align-items: center; justify-content: center; margin-right: ${horizontalScale(14)}px;`;
const Badge = styled(Text)`align-self: flex-start; background-color: #ffe0c9; color: ${colors.primaryDark}; padding: ${moderateScale(4)}px ${moderateScale(8)}px; border-radius: ${moderateScale(7)}px; font-size: 12px; margin-bottom: ${verticalScale(4)}px;`;
const UploadArea = styled.View`border-width: 1.5px; border-style: dashed; border-color: ${colors.primary}; border-radius: ${moderateScale(14)}px; background-color: ${colors.white}; align-items: center; padding: ${moderateScale(20)}px ${moderateScale(10)}px ${moderateScale(14)}px;`;
const ActionRow = styled.View`flex-direction: row; gap: ${horizontalScale(8)}px; width: 100%; margin: ${verticalScale(16)}px 0 ${verticalScale(14)}px;`;
const UploadAction = styled(Pressable)`height: ${verticalScale(50)}px; border-width: 1px; border-color: ${colors.gray300}; border-radius: ${moderateScale(12)}px; flex: 1; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(7)}px;`;
const QueueCard = styled.View`border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(16)}px; overflow: hidden; margin-bottom: ${verticalScale(18)}px;`;
const QueueItem = styled(Pressable)<{ isLast: boolean }>`min-height: ${verticalScale(70)}px; padding: ${moderateScale(10)}px; flex-direction: row; align-items: center; border-bottom-width: ${({ isLast }) => isLast ? 0 : 1}px; border-bottom-color: ${colors.gray200};`;
const SmallDocumentIcon = styled.View`width: ${moderateScale(40)}px; height: ${moderateScale(40)}px; border-radius: ${moderateScale(10)}px; background-color: #fff0e7; align-items: center; justify-content: center; margin-right: ${horizontalScale(10)}px;`;
const QueueCircle = styled.Text<{ active: boolean }>`width: ${moderateScale(24)}px; height: ${moderateScale(24)}px; border-radius: ${moderateScale(14)}px; border-width: 1.5px; border-color: ${({ active }) => active ? colors.primary : colors.gray300}; color: ${colors.primary}; text-align: center; line-height: ${moderateScale(20)}px;`;
const SecurityNotice = styled.View`background-color: #fff6f0; border-radius: ${moderateScale(16)}px; padding: ${moderateScale(14)}px; flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px; margin-bottom: ${verticalScale(18)}px;`;
const ContinueButton = styled(Pressable)<{ disabled?: boolean }>`height: ${verticalScale(56)}px; border-radius: ${moderateScale(15)}px; background-color: ${({ disabled }) => disabled ? '#ffd5bd' : colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(16)}px;`;

const styles = StyleSheet.create({
    heading: { marginBottom: verticalScale(4) },
    subtitle: { marginBottom: verticalScale(18) },
    currentText: { flex: 1 },
    cardTitle: { marginBottom: verticalScale(2) },
    uploadTitle: { marginTop: verticalScale(10) },
    actionLabel: { fontSize: 12 },
    sectionTitle: { marginBottom: verticalScale(10) },
    queueText: { flex: 1 },
    securityText: { flex: 1 },
    counter: { textAlign: 'center', marginTop: verticalScale(10), marginBottom: verticalScale(8) },
    refreshIndicator: { marginBottom: verticalScale(8) },
});

export default HomeProfessional;
