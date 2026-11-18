import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PhotoSourceModal, { type PhotoSource } from '@shared/ui/image/PhotoSourceModal';
import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectUser, updateUserProfile } from '@store/slices/authSlice';
import { Toast } from '@core/notifications/toast';
import { requestCameraPermission } from '@utils/permissions';
import type { Document, DocumentType } from '@entities/user/model';
import { useLazyDownloadDocumentQuery, useUploadDocumentMutation } from '../api/documents.api';
import DocumentManagementView from '../ui/DocumentManagementView';
import { previewDocument } from '../model/document-preview';

type File = { uri: string; type?: string | null; name?: string | null; size?: number | null };

export default function DocumentManagementScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [upload] = useUploadDocumentMutation();
    const [download] = useLazyDownloadDocumentQuery();
    const [busy, setBusy] = useState<DocumentType>();
    const [sourceVisible, setSourceVisible] = useState(false);
    const selectedDocument = useRef<{ name: DocumentType; owner: number } | null>(null);
    const locked = useRef(false);
    const currentUser = useRef(user);
    currentUser.current = user;
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    useEffect(() => {
        if (!user) navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
    }, [user, navigation]);

    const replace = async (name: DocumentType, file: File, owner: number) => {
        if (locked.current || currentUser.current?.id !== owner || !mounted.current) return;
        if (!file.uri || !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type || '') || !file.size || file.size > 5 * 1024 * 1024) {
            Alert.alert(t('professional.documents.uploadFailed'), t('professional.documentManagement.formats'));
            return;
        }
        const confirmed = await new Promise<boolean>(resolve => Alert.alert(t('professional.documentManagement.confirm'), t('professional.documentManagement.confirmBody'), [
            { text: t('common.actions.cancel'), style: 'cancel', onPress: () => resolve(false) },
            { text: t('professional.documentManagement.send'), onPress: () => resolve(true) },
        ], { cancelable: true, onDismiss: () => resolve(false) }));
        if (!confirmed || locked.current || !mounted.current || currentUser.current?.id !== owner) return;
        locked.current = true;
        setBusy(name);
        try {
            const result = await upload({ file: { uri: file.uri, type: file.type, name: file.name || `${name}.${file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'}` }, name, type: file.type === 'application/pdf' ? 'pdf' : 'img' }).unwrap();
            if (!mounted.current || currentUser.current?.id !== owner) return;
            // Some server versions acknowledge the upload without returning document metadata.
            const response = result as Document & { data?: Document };
            const returned = response.data?.name === name ? response.data : response.name === name ? response : undefined;
            const document = returned || { id: 0, name, type: file.type === 'application/pdf' ? 'pdf' : 'img', url: '', uploaded_at: new Date().toISOString() };
            dispatch(updateUserProfile({ documents: [...(currentUser.current.documents || []).filter(item => item.name !== name), document as Document] }));
            Toast.show(t('professional.documentManagement.uploadSuccess'), { type: 'success' });
        } catch {
            if (mounted.current && currentUser.current?.id === owner) Toast.show(t('professional.documents.uploadFailed'), { type: 'danger' });
        } finally { locked.current = false; if (mounted.current) setBusy(undefined); }
    };

    const choose = (name: DocumentType) => {
        if (!user || locked.current) return;
        selectedDocument.current = { name, owner: user.id };
        setSourceVisible(true);
    };

    const pickReplacement = async (source: PhotoSource | 'file') => {
        const selected = selectedDocument.current;
        selectedDocument.current = null;
        if (!selected || !mounted.current || locked.current || currentUser.current?.id !== selected.owner) return;
        const { name, owner } = selected;
        try {
            if (source === 'file') {
                const file = await DocumentPicker.pickSingle({ type: [types.pdf, types.images], copyTo: 'cachesDirectory' });
                await replace(name, { ...file, uri: file.fileCopyUri || file.uri }, owner);
                return;
            }
            if (source === 'camera' && !await requestCameraPermission()) return;
            const picker = source === 'camera' ? launchCamera : launchImageLibrary;
            const result = await picker({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
            if (result.didCancel) return;
            if (result.errorCode) throw new Error('Image picker unavailable');
            const asset = result.assets?.[0];
            if (asset?.uri) await replace(name, { uri: asset.uri, type: asset.type, name: asset.fileName, size: asset.fileSize }, owner);
        } catch (error) {
            if (mounted.current && currentUser.current?.id === owner && !DocumentPicker.isCancel(error)) {
                Toast.show(t(source === 'camera' ? 'professional.documents.cameraUnavailable' : 'professional.documents.openFailed'), { type: 'danger' });
            }
        }
    };

    const view = async (document: Document) => {
        if (locked.current || !user) return;
        const owner = user.id;
        locked.current = true;
        setBusy(document.name);
        const request = download(document.name, false);
        try {
            const blob = await request.unwrap();
            await previewDocument(blob, document.name, () => mounted.current && currentUser.current?.id === owner);
        } catch {
            if (mounted.current && currentUser.current?.id === owner) Toast.show(t('professional.documentManagement.viewFailed'), { type: 'danger' });
        } finally {
            request.unsubscribe();
            locked.current = false;
            if (mounted.current) setBusy(undefined);
        }
    };

    return <ScreenContainer scrollable withBottomSafeArea>
        <InterventionHeader title={t('professional.documentDesign.title')} onHelp={() => Alert.alert(t('professional.documentDesign.title'), t('professional.documentManagement.help'))} />
        <DocumentManagementView documents={user?.documents || []} busy={busy} onView={view} onReplace={choose} />
        <PhotoSourceModal
            visible={sourceVisible}
            onClose={() => setSourceVisible(false)}
            onSelect={pickReplacement}
            onChooseFile={() => pickReplacement('file')}
            title={t('professional.documentManagement.sourceTitle')}
            description={`${selectedDocument.current ? t(`professional.documentManagement.names.${selectedDocument.current.name}`) + ' · ' : ''}${t('professional.documentManagement.formats')}`}
        />
    </ScreenContainer>;
}
