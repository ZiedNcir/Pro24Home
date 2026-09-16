
import React from 'react';
import { Image, Modal, Pressable } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { Colors } from '@utils/constant';
import { colors } from '@theme';
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
    const [previewPhoto, setPreviewPhoto] = React.useState<InterventionPhoto | null>(null);
    const [isSourceModalVisible, setIsSourceModalVisible] = React.useState(false);

    const chooseSource = (source: 'camera' | 'gallery') => {
        setIsSourceModalVisible(false);
        onAddPhoto(source);
    };

    return (
        <>
            <Row>
                {[0, 1, 2].map(index => {
                    const photo = photos[index];
                    return photo ? (
                        <PhotoBox key={`${photo.uri}-${index}`}>
                            <PreviewButton accessibilityRole="button" accessibilityLabel={`Ouvrir la photo ${index + 1}`} onPress={() => setPreviewPhoto(photo)}>
                                <Photo source={{ uri: photo.uri }} resizeMode="cover" />
                            </PreviewButton>
                            <RemoveButton accessibilityRole="button" accessibilityLabel={`Supprimer la photo ${index + 1}`} onPress={() => onRemovePhoto(index)}>
                                <SvgIcon name="fa-times" size={11} color={Colors.white} />
                            </RemoveButton>
                        </PhotoBox>
                    ) : (
                        <AddButton key={`empty-${index}`} accessibilityRole="button" accessibilityLabel={`Ajouter la photo ${index + 1}`} onPress={() => setIsSourceModalVisible(true)}>
                            <SvgIcon name="fa-camera" size={18} color={Colors.black} />
                        <AddLabel variant="bold" color="black" fontSize={10}>
                            Ajouter
                        </AddLabel>
                        </AddButton>
                    );
                })}
            </Row>

            <Modal visible={previewPhoto !== null} transparent animationType="fade" onRequestClose={() => setPreviewPhoto(null)}>
                <PreviewBackdrop>
                    <PreviewCloseButton accessibilityRole="button" accessibilityLabel="Fermer la prévisualisation" onPress={() => setPreviewPhoto(null)}>
                        <SvgIcon name="fa-times" size={18} color={Colors.white} />
                    </PreviewCloseButton>
                    {previewPhoto ? <PreviewImage source={{ uri: previewPhoto.uri }} resizeMode="contain" /> : null}
                </PreviewBackdrop>
            </Modal>

            <Modal visible={isSourceModalVisible} transparent animationType="slide" onRequestClose={() => setIsSourceModalVisible(false)}>
                <SourceModalBackdrop>
                    <SourceModalSheet>
                        <SourceModalHandle />
                        <SourceModalHeader>
                            <SourceModalTitle>Ajouter une photo</SourceModalTitle>
                            <SourceCloseButton accessibilityRole="button" accessibilityLabel="Fermer le choix de photo" onPress={() => setIsSourceModalVisible(false)}>
                                <SvgIcon name="fa-times" size={14} color={colors.gray600} />
                            </SourceCloseButton>
                        </SourceModalHeader>
                        <SourceModalDescription>Sélectionnez une source pour illustrer votre panne.</SourceModalDescription>
                        <SourceOption accessibilityRole="button" accessibilityLabel="Prendre une photo avec la caméra" onPress={() => chooseSource('camera')}>
                            <SourceIconContainer>
                                <SvgIcon name="fa-camera" size={20} color={colors.primary} />
                            </SourceIconContainer>
                            <SourceOptionText>
                                <SourceOptionTitle>Prendre une photo</SourceOptionTitle>
                                <SourceOptionDescription>Utiliser la caméra de votre téléphone</SourceOptionDescription>
                            </SourceOptionText>
                            <SvgIcon name="fa-chevron-right" size={14} color={colors.gray500} />
                        </SourceOption>
                        <SourceOption accessibilityRole="button" accessibilityLabel="Choisir une photo dans la galerie" onPress={() => chooseSource('gallery')}>
                            <SourceIconContainer>
                                <SvgIcon name="image" size={20} color={colors.primary} />
                            </SourceIconContainer>
                            <SourceOptionText>
                                <SourceOptionTitle>Choisir dans la galerie</SourceOptionTitle>
                                <SourceOptionDescription>Sélectionner une photo existante</SourceOptionDescription>
                            </SourceOptionText>
                            <SvgIcon name="fa-chevron-right" size={14} color={colors.gray500} />
                        </SourceOption>
                        <SourceCancelButton accessibilityRole="button" accessibilityLabel="Annuler" onPress={() => setIsSourceModalVisible(false)}>
                            <SourceCancelText>Annuler</SourceCancelText>
                        </SourceCancelButton>
                    </SourceModalSheet>
                </SourceModalBackdrop>
            </Modal>
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
  background-color: #eeeeee;
`;

const RemoveButton = styled(Pressable)`
  position: absolute;
  top: ${horizontalScale(5)}px;
  right: ${horizontalScale(5)}px;
  width: ${horizontalScale(22)}px;
  height: ${horizontalScale(22)}px;
  border-radius: ${horizontalScale(11)}px;
  background-color: rgba(0, 0, 0, 0.65);
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
  border-color: #cfcfcf;
  border-style: dashed;
  background-color: #fafafa;
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

const SourceModalBackdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.42);
`;

const SourceModalSheet = styled.View`
  padding: ${verticalScale(12)}px ${horizontalScale(18)}px ${verticalScale(22)}px;
  border-top-left-radius: ${moderateScale(22)}px;
  border-top-right-radius: ${moderateScale(22)}px;
  background-color: ${Colors.white};
`;

const SourceModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${moderateScale(2)}px;
  margin-bottom: ${verticalScale(12)}px;
  align-self: center;
  background-color: #d9d9d9;
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
  background-color: #f5f5f5;
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
  background-color: #fff6ef;
`;
const SourceIconContainer = styled.View`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  border-radius: ${horizontalScale(20)}px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.white};
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
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.white};
`;
const SourceCancelText = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })``;
