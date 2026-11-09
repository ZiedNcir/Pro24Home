import { requestCameraPermission } from '@utils/permissions';
import ProfessionalDocumentsView from '../ui/ProfessionalDocumentsView';
import { readProfessionalUploadState, recordProfessionalDocumentUpload, markProfessionalUploadFinished } from '@core/session/professional-upload-state';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { Toast } from '@core/notifications/toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import { useGetProfileQuery } from '@entities/user/api/user.api';
import { useUploadDocumentMutation } from '@roles/professional/documents/api/documents.api';
import { selectUser } from '@store/slices/authSlice';
import type { Document, DocumentType } from '@entities/user/model';
import type { AppStackType } from '../../../../navigation/constant/core';
import {
    getDocumentForType,
    getDocumentSubmissionProgress,
    PROFESSIONAL_DOCUMENTS,
} from '@roles/professional/documents/model/professional-documents';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const HomeProfessional = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackType>>();
    const user = useSelector(selectUser);
    const { data, isFetching, isError, refetch } = useGetProfileQuery(undefined, { skip: !user, refetchOnMountOrArgChange: true });
    const uploadBusy = useRef(false);
    useEffect(() => {
        if (!user) navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
    }, [navigation, user]);
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
    const [localUploads, setLocalUploads] = useState<{ userId: number; names: string[] } | null>(null);
    const progressRevision = useRef(0);
    const currentUserId = useRef(user?.id);
    currentUserId.current = user?.id;
    useEffect(() => {
        let active = true;
        const owner = user?.id ? { id: user.id, email: user.email } : null;
        const revision = progressRevision.current;
        currentUserId.current = owner?.id;
        if (owner) {
            readProfessionalUploadState(owner).then(state => {
                if (active && progressRevision.current === revision) setLocalUploads({ userId: owner.id, names: state.uploaded });
            }).catch(() => {
                if (active) Toast.show(t('auth.onboarding.uploadStateFailed'), { type: 'warning', placement: 'bottom' });
            });
        }
        return () => { active = false; if (currentUserId.current === owner?.id) currentUserId.current = undefined; };
    }, [user?.id, user?.email, t]);
    const documents = useMemo<Document[]>(() => {
        const server = (data?.data?.id === user?.id ? data?.data?.documents : undefined) ?? user?.documents ?? [];
        const names = localUploads?.userId === user?.id ? localUploads?.names || [] : [];
        // These are confirmed uploads, used only when the server omits document metadata.
        const confirmed: Document[] = names.filter(name => !server.some(document => document.name === name))
            .filter(name => PROFESSIONAL_DOCUMENTS.some(required => required.name === name))
            .map(name => ({ id: 0, name: name as DocumentType, type: 'img', url: '', uploaded_at: '', status: 'pending' }));
        return [...server, ...confirmed];
    }, [data?.data, user, localUploads]);
    const submission = getDocumentSubmissionProgress(documents);
    const firstMissing = submission.nextMissing ?? 'identity_front';
    const [activeType, setActiveType] = useState<DocumentType>(firstMissing);

    const activeDocument = getDocumentForType(documents, activeType);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        if (!uploadBusy.current && submission.nextMissing && ['pending', 'approved'].includes(activeDocument?.status || '')) setActiveType(submission.nextMissing);
    }, [submission.nextMissing, activeDocument?.status, isUploading]);

    const handleUpload = async (file: { uri: string; type?: string | null; name?: string | null; size?: number | null }) => {
        if (!file.uri || uploadBusy.current) return;
        if (file.size && file.size > MAX_FILE_SIZE) {
            Alert.alert(t('professional.documents.fileTooLarge'), t('professional.documents.fileTooLargeDescription'));
            return;
        }

        uploadBusy.current = true;
        setIsProcessing(true);
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
            if (!user) return;
            const required = PROFESSIONAL_DOCUMENTS.map(item => item.name);
            const known = required.filter(name => ['approved', 'pending'].includes(getDocumentForType(documents, name)?.status || ''));
            const rejected = required.filter(name => getDocumentForType(documents, name)?.status === 'rejected');
            const confirmed = Array.from(new Set([...known, activeType]));
            progressRevision.current++;
            if (currentUserId.current === user.id) setLocalUploads({ userId: user.id, names: confirmed });
            try {
                const state = await recordProfessionalDocumentUpload(user, activeType, required, known, rejected);
                if (currentUserId.current !== user.id) return;
                setLocalUploads({ userId: user.id, names: state.uploaded });
                if (state.finished) {
                    navigation.reset({ index: 0, routes: [{ name: 'ProfessionalVerificationPending' }] });
                    return;
                }
                const next = required.find(name => !state.uploaded.includes(name));
                if (next) setActiveType(next);
            } catch {
                Toast.show(t('auth.onboarding.uploadStateFailed'), { type: 'warning', placement: 'bottom' });
                return;
            }
            try {
                const refreshed = await refetch().unwrap();
                if (refreshed.success === false || !refreshed.data || refreshed.data.id !== user?.id) throw new Error('Profile refresh rejected');
                const next = PROFESSIONAL_DOCUMENTS.find(item => !confirmed.includes(item.name) && !['approved', 'pending'].includes(getDocumentForType(refreshed.data?.documents || [], item.name)?.status || ''))?.name;
                if (next) setActiveType(next);
            } catch {
                Toast.show(t('auth.onboarding.uploadRefreshFailed'), { type: 'warning', placement: 'bottom' });
                return;
            }
            Toast.show(t('professional.documents.uploadSuccess'), { type: 'success', placement: 'bottom' });
        } catch (error: any) {
            Toast.show(error?.data?.message || t('professional.documents.uploadFailed'), { type: 'danger', placement: 'bottom' });
        } finally {
            uploadBusy.current = false;
            if (currentUserId.current === user?.id) setIsProcessing(false);
        }
    };

    const chooseFile = async () => {
        try {
            const file = await DocumentPicker.pickSingle({ type: [types.images, types.pdf], copyTo: 'cachesDirectory' });
            await handleUpload({ ...file, uri: file.fileCopyUri || file.uri });
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                Toast.show(t('professional.documents.openFailed'), { type: 'danger', placement: 'bottom' });
            }
        }
    };

    const takePhoto = async () => {
        try {
            if (!await requestCameraPermission()) throw new Error('Camera access denied');
            const result = await launchCamera({ mediaType: 'photo', cameraType: 'back', saveToPhotos: false, quality: 0.8 });
            if (result.didCancel) return;
            if (result.errorCode) throw new Error(result.errorMessage || t('professional.documents.cameraUnavailable'));
            const asset = result.assets?.[0];
            if (asset?.uri) await handleUpload({ uri: asset.uri, type: asset.type, name: asset.fileName, size: asset.fileSize });
        } catch {
            Toast.show(t('professional.documents.cameraUnavailable'), { type: 'danger', placement: 'bottom' });
        }
    };

    const continueToNext = async () => {
        if (uploadBusy.current || !user) return;
        if (submission.canContinue) {
            uploadBusy.current = true;
            setIsProcessing(true);
            try {
                await markProfessionalUploadFinished(user, PROFESSIONAL_DOCUMENTS.map(item => item.name));
                if (currentUserId.current === user.id) navigation.reset({ index: 0, routes: [{ name: 'ProfessionalVerificationPending' }] });
            } catch {
                Toast.show(t('auth.onboarding.uploadStateFailed'), { type: 'danger', placement: 'bottom' });
            } finally { uploadBusy.current = false; if (currentUserId.current === user.id) setIsProcessing(false); }
        } else if (submission.nextMissing) {
            setActiveType(submission.nextMissing);
        }
    };

    const refreshDocuments = () => { refetch().unwrap().catch(() => undefined); };

    return (
        <ScreenContainer scrollable withBottomSafeArea paddingHorizontal={0} paddingVertical={0}>
            <ProfessionalDocumentsView
                documents={documents}
                activeType={activeType}
                isUploading={isUploading || isProcessing}
                isFetching={isFetching}
                profileError={isError}
                onChooseFile={chooseFile}
                onTakePhoto={takePhoto}
                onSelectType={setActiveType}
                onContinue={continueToNext}
                onRefresh={refreshDocuments}
                onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] })}
                onHelp={() => Alert.alert(t('professional.documents.verificationTitle'), t('professional.documents.verificationDescription'), [
                    { text: t('common.actions.cancel'), style: 'cancel' },
                    { text: t('auth.onboarding.checkDossier'), onPress: refreshDocuments },
                ])}
            />
        </ScreenContainer>
    );
};

export default HomeProfessional;
