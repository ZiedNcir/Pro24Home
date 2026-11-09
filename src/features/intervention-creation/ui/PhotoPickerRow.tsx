
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import PhotoSourceModal from '@shared/ui/image/PhotoSourceModal';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import type { InterventionPhoto } from '@features/intervention-creation/ui/new-intervention/types';

interface PhotoPickerRowProps {
    photos: InterventionPhoto[];
    onAddPhoto: (source: 'camera' | 'gallery') => void;
    onRemovePhoto: (index: number) => void;
}

const PhotoPickerRow: React.FC<PhotoPickerRowProps> = ({ photos, onAddPhoto, onRemovePhoto }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const [previewPhoto, setPreviewPhoto] = React.useState<InterventionPhoto | null>(null);
    const [isSourceModalVisible, setIsSourceModalVisible] = React.useState(false);


    return (
        <>
            <Row>
                {[0, 1, 2].map(index => {
                    const photo = photos[index];
                    return photo ? (
                        <PhotoBox key={`${photo.uri}-${index}`}>
                            <PreviewButton accessibilityRole="button" accessibilityLabel={t('intervention.detail.openPhoto', { count: index + 1 })} onPress={() => setPreviewPhoto(photo)}>
                                <Photo source={{ uri: photo.uri }} resizeMode="cover" />
                            </PreviewButton>
                            <RemoveButton accessibilityRole="button" accessibilityLabel={t('intervention.detail.removePhoto', { count: index + 1 })} onPress={() => onRemovePhoto(index)}>
                                <SvgIcon name="fa-times" size={11} color={colors.textInverse} />
                            </RemoveButton>
                        </PhotoBox>
                    ) : (
                        <AddButton key={`empty-${index}`} accessibilityRole="button" accessibilityLabel={t('intervention.detail.addPhotoNumber', { count: index + 1 })} onPress={() => setIsSourceModalVisible(true)}>
                            <SvgIcon name="fa-camera" size={18} color={colors.textPrimary} />
                        <AddLabel variant="bold" color="black" fontSize={10}>
                            {t('intervention.creation.photoAdd')}
                        </AddLabel>
                        </AddButton>
                    );
                })}
            </Row>

            <Modal visible={previewPhoto !== null} transparent animationType="fade" onRequestClose={() => setPreviewPhoto(null)}>
                <PreviewBackdrop>
                    <PreviewCloseButton accessibilityRole="button" accessibilityLabel={t('intervention.creation.closePhotoPreview')} onPress={() => setPreviewPhoto(null)}>
                        <SvgIcon name="fa-times" size={18} color={colors.textInverse} />
                    </PreviewCloseButton>
                    {previewPhoto ? <PreviewImage source={{ uri: previewPhoto.uri }} resizeMode="contain" /> : null}
                </PreviewBackdrop>
            </Modal>

            <PhotoSourceModal
                visible={isSourceModalVisible}
                onClose={() => setIsSourceModalVisible(false)}
                onSelect={onAddPhoto}
            />
        </>
    );
};

export default PhotoPickerRow;

const Row = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
  margin-bottom: ${verticalScale(12)}px;
`;

const PhotoBox = styled.View`
  width: ${horizontalScale(88)}px;
  height: ${horizontalScale(88)}px;
  border-radius: ${moderateScale(14)}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const RemoveButton = styled(Pressable)`
  position: absolute;
  top: ${horizontalScale(5)}px;
  right: ${horizontalScale(5)}px;
  width: ${horizontalScale(22)}px;
  height: ${horizontalScale(22)}px;
  border-radius: ${horizontalScale(11)}px;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: center;
  align-items: center;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 100%;
`;

const PreviewButton = styled(Pressable)`
  width: 100%;
  height: 100%;
`;

const AddButton = styled.TouchableOpacity`
  width: ${horizontalScale(88)}px;
  height: ${horizontalScale(88)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
`;

const AddLabel = styled(Text)`
  margin-top: ${verticalScale(7)}px;
`;

const PreviewBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.94);
  justify-content: center;
  align-items: center;
`;

const PreviewImage = styled(Image)`
  width: 100%;
  height: 82%;
`;

const PreviewCloseButton = styled(Pressable)`
  position: absolute;
  top: ${verticalScale(52)}px;
  right: ${horizontalScale(20)}px;
  z-index: 1;
  width: ${horizontalScale(38)}px;
  height: ${horizontalScale(38)}px;
  border-radius: ${horizontalScale(19)}px;
  background-color: rgba(255, 255, 255, 0.18);
  justify-content: center;
  align-items: center;
`;
