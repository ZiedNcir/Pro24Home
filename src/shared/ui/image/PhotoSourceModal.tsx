import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';

export type PhotoSource = 'camera' | 'gallery';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (source: PhotoSource) => void;
    title?: string;
    description?: string;
}

const PhotoSourceModal = ({ visible, onClose, onSelect, title, description }: Props) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const pendingSource = useRef<PhotoSource | null>(null);
    const chooseSource = (source: PhotoSource) => {
        pendingSource.current = source;
        onClose();
        // iOS cannot present its picker until the source sheet has dismissed.
        if (Platform.OS !== 'ios') {
            pendingSource.current = null;
            onSelect(source);
        }
    };
    const handleDismiss = () => {
        const source = pendingSource.current;
        pendingSource.current = null;
        if (source) onSelect(source);
    };

    return (
            <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} onDismiss={handleDismiss}>
                <SourceModalBackdrop>
                    <SourceModalSheet>
                        <SourceModalHandle />
                        <SourceModalHeader>
                            <SourceModalTitle>{title || t('intervention.creation.photoAdd')}</SourceModalTitle>
                            <SourceCloseButton accessibilityRole="button" accessibilityLabel={t('intervention.creation.closePhotoPicker')} onPress={onClose}>
                                <SvgIcon name="fa-times" size={14} color={colors.gray600} />
                            </SourceCloseButton>
                        </SourceModalHeader>
                        <SourceModalDescription>{description || t('intervention.creation.photoSourceHint')}</SourceModalDescription>
                        <SourceOption accessibilityRole="button" accessibilityLabel={t('intervention.creation.cameraAccessibility')} onPress={() => chooseSource('camera')}>
                            <SourceIconContainer>
                                <SvgIcon name="fa-camera" size={20} color={colors.primary} />
                            </SourceIconContainer>
                            <SourceOptionText>
                                <SourceOptionTitle>{t('intervention.creation.camera')}</SourceOptionTitle>
                                <SourceOptionDescription>{t('intervention.creation.cameraHint')}</SourceOptionDescription>
                            </SourceOptionText>
                            <SvgIcon name="fa-chevron-right" size={14} color={colors.gray500} />
                        </SourceOption>
                        <SourceOption accessibilityRole="button" accessibilityLabel={t('intervention.creation.galleryAccessibility')} onPress={() => chooseSource('gallery')}>
                            <SourceIconContainer>
                                <SvgIcon name="image" size={20} color={colors.primary} />
                            </SourceIconContainer>
                            <SourceOptionText>
                                <SourceOptionTitle>{t('intervention.creation.gallery')}</SourceOptionTitle>
                                <SourceOptionDescription>{t('intervention.creation.galleryHint')}</SourceOptionDescription>
                            </SourceOptionText>
                            <SvgIcon name="fa-chevron-right" size={14} color={colors.gray500} />
                        </SourceOption>
                        <SourceCancelButton accessibilityRole="button" accessibilityLabel={t('common.actions.cancel')} onPress={onClose}>
                            <SourceCancelText>{t('common.actions.cancel')}</SourceCancelText>
                        </SourceCancelButton>
                    </SourceModalSheet>
                </SourceModalBackdrop>
            </Modal>
    );
};

export default PhotoSourceModal;

const SourceModalBackdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.42);
`;

const SourceModalSheet = styled.View`
  padding: ${verticalScale(12)}px ${horizontalScale(18)}px ${verticalScale(22)}px;
  border-top-left-radius: ${moderateScale(22)}px;
  border-top-right-radius: ${moderateScale(22)}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const SourceModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  margin-bottom: ${verticalScale(12)}px;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.gray300};
`;

const SourceModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SourceModalTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 17 })``;
const SourceCloseButton = styled(Pressable)`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${horizontalScale(17)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;
const SourceModalDescription = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`
  margin-top: ${verticalScale(4)}px;
  margin-bottom: ${verticalScale(14)}px;
`;
const SourceOption = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  min-height: ${verticalScale(66)}px;
  padding: ${verticalScale(10)}px ${horizontalScale(12)}px;
  margin-bottom: ${verticalScale(10)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
`;
const SourceIconContainer = styled.View`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  border-radius: ${horizontalScale(20)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
`;
const SourceOptionText = styled.View`
  flex: 1;
  margin-left: ${horizontalScale(12)}px;
`;
const SourceOptionTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })``;
const SourceOptionDescription = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })``;
const SourceCancelButton = styled(Pressable)`
  height: ${verticalScale(46)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
`;
const SourceCancelText = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })``;
