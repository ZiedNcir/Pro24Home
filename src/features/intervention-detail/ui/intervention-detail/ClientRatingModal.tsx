import React, { useEffect, useState } from 'react';
import { Modal, Pressable, TextInput } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { colors } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';

interface ClientRatingModalProps {
    visible: boolean;
    professionalName?: string | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const ClientRatingModal = ({ visible, professionalName, isSubmitting = false, onClose, onSubmit }: ClientRatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (visible) {
            setRating(0);
            setComment('');
        }
    }, [visible]);

    return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Backdrop>
            <Sheet>
                <Handle />
                <SheetTitle>Comment s’est passée votre intervention ?</SheetTitle>
                <SheetDescription>Votre avis nous aide à améliorer nos services et à valoriser nos professionnels.</SheetDescription>
                <ProfessionalRow>
                    <ProfessionalAvatar><SvgIcon name="fa-user" size={20} color={colors.primary} /></ProfessionalAvatar>
                    <Text variant="bold" color="black" fontSize={16}>{professionalName || 'Votre professionnel'}</Text>
                </ProfessionalRow>
                <Stars accessibilityRole="radiogroup" accessibilityLabel="Notez votre intervention de 1 à 5 étoiles">
                    {[1, 2, 3, 4, 5].map(value => <StarButton key={value} accessibilityRole="radio" accessibilityState={{ selected: rating === value }} accessibilityLabel={`${value} étoile${value > 1 ? 's' : ''}`} onPress={() => setRating(value)}>
                        <SvgIcon name="fa-star" size={32} color={value <= rating ? colors.primary : colors.gray300} />
                    </StarButton>)}
                </Stars>
                <RatingHint>{rating ? `${rating}/5` : 'Touchez une étoile pour noter'}</RatingHint>
                <CommentInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Un petit mot ? (optionnel)"
                    placeholderTextColor={colors.gray500}
                    multiline
                    maxLength={500}
                    textAlignVertical="top"
                    accessibilityLabel="Commentaire facultatif"
                />
                <SubmitButton disabled={!rating || isSubmitting} onPress={() => onSubmit(rating, comment.trim())} accessibilityRole="button" accessibilityLabel="Envoyer mon avis">
                    <Text variant="bold" color={colors.white}>{isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}</Text>
                </SubmitButton>
                <LaterButton disabled={isSubmitting} onPress={onClose} accessibilityRole="button" accessibilityLabel="Noter plus tard">
                    <Text variant="bold" color="gray600">Plus tard</Text>
                </LaterButton>
            </Sheet>
        </Backdrop>
    </Modal>;
};

export default ClientRatingModal;

const Backdrop = styled.View`flex: 1; justify-content: flex-end; background-color: ${colors.backdrop};`;
const Sheet = styled.View`background-color: ${colors.white}; border-top-left-radius: ${moderateScale(24)}px; border-top-right-radius: ${moderateScale(24)}px; padding: ${verticalScale(14)}px ${horizontalScale(20)}px ${verticalScale(24)}px;`;
const Handle = styled.View`width: ${horizontalScale(42)}px; height: ${verticalScale(4)}px; border-radius: ${verticalScale(2)}px; background-color: ${colors.gray300}; align-self: center; margin-bottom: ${verticalScale(18)}px;`;
const SheetTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 22 })`text-align: center;`;
const SheetDescription = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`text-align: center; margin: ${verticalScale(10)}px ${horizontalScale(8)}px ${verticalScale(18)}px;`;
const ProfessionalRow = styled.View`flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(10)}px; margin-bottom: ${verticalScale(18)}px;`;
const ProfessionalAvatar = styled.View`width: ${horizontalScale(46)}px; height: ${horizontalScale(46)}px; border-radius: ${horizontalScale(23)}px; background-color: ${colors.primaryLighter}; align-items: center; justify-content: center;`;
const Stars = styled.View`flex-direction: row; justify-content: center; gap: ${horizontalScale(10)}px;`;
const StarButton = styled(Pressable)`width: ${horizontalScale(40)}px; height: ${horizontalScale(40)}px; align-items: center; justify-content: center;`;
const RatingHint = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`text-align: center; margin: ${verticalScale(8)}px 0 ${verticalScale(14)}px;`;
const CommentInput = styled(TextInput)`min-height: ${verticalScale(78)}px; border-width: 1px; border-color: ${colors.gray300}; border-radius: ${moderateScale(12)}px; padding: ${verticalScale(12)}px ${horizontalScale(14)}px; color: ${colors.black}; font-family: Inter-Regular; font-size: 14px;`;
const SubmitButton = styled(Pressable)`height: ${verticalScale(50)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; align-items: center; justify-content: center; margin-top: ${verticalScale(16)}px;`;
const LaterButton = styled(Pressable)`height: ${verticalScale(42)}px; align-items: center; justify-content: center; margin-top: ${verticalScale(4)}px;`;
