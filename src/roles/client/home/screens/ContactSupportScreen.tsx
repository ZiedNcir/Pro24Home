import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import Field from '@components/Field';
import { SvgIcon } from '@components/Icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import InterventionHeader from '@screens/Intervention/components/InterventionHeader';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { isSupportFormValid, SUPPORT_TOPICS } from '@screens/Home/client/utils/contactSupport';

type SupportFormValues = { message: string };

const ContactSupportScreen = () => {
    const navigation = useNavigation<any>();
    const { control, handleSubmit } = useForm<SupportFormValues>({ defaultValues: { message: '' } });
    const [topic, setTopic] = useState(SUPPORT_TOPICS[0]!);
    const [attachment, setAttachment] = useState(false);
    const [topicModalVisible, setTopicModalVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const submitRequest = handleSubmit(({ message: submittedMessage }) => {
        if (!isSupportFormValid(topic.key, submittedMessage)) {
            Alert.alert('Message incomplet', 'Sélectionnez un sujet et décrivez votre demande.');
            return;
        }
        setSubmitted(true);
    });

    if (submitted) {
        return (
            <ScreenContainer paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(14)} backgroundColor={colors.white}>
                <BrandRow><LogoMediumPro24Icon width={moderateScale(126)} height={moderateScale(40)} /></BrandRow>
                <InterventionHeader title="Contacter le support" showHelp={false} onClose={() => navigation.goBack()} />
                <SuccessState>
                    <SuccessIcon><SvgIcon name="fa-check" size={28} color={colors.white} /></SuccessIcon>
                    <Text variant="title" color={colors.gray900} style={styles.center}>Votre demande a été envoyée</Text>
                    <Text variant="regular" color={colors.gray700} style={[styles.center, styles.successDescription]}>Notre équipe vous répondra dans les meilleurs délais.</Text>
                    <BackButton onPress={() => navigation.goBack()} accessibilityRole="button"><Text variant="bold" color={colors.primary}>Retour aux paramètres</Text></BackButton>
                </SuccessState>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(14)} backgroundColor={colors.white} contentContainerStyle={{ paddingBottom: verticalScale(24) }}>
            <BrandRow><LogoMediumPro24Icon width={moderateScale(126)} height={moderateScale(40)} /></BrandRow>
            <InterventionHeader title="Contacter le support" showHelp={false} onClose={() => navigation.goBack()} />

            <Text variant="title" color={colors.gray900} style={styles.heading}>Comment pouvons-nous vous aider ?</Text>
            <Text variant="regular" color={colors.gray700} style={styles.subtitle}>Décrivez votre demande et notre équipe vous répondra rapidement.</Text>

            <Label>Sujet de votre demande <Required>*</Required></Label>
            <TopicButton onPress={() => setTopicModalVisible(true)} accessibilityRole="button">
                <TopicIcon><SvgIcon name={topic.icon} size={19} color={colors.white} /></TopicIcon>
                <Text variant="regular" color={colors.gray900} style={styles.flex}>{topic.label}</Text>
                <SvgIcon name="fa-chevron-down" size={15} color={colors.gray700} />
            </TopicButton>

            <Field<SupportFormValues>
                name="message"
                control={control}
                label="Décrivez votre demande"
                required
                multiline
                maxCharacters={1000}
                showCharacterCount
                placeholder="Décrivez votre demande en détail. Incluez les informations utiles…"
                rules={{ minLength: { value: 1, message: 'Décrivez votre demande.' } }}
                containerStyle={styles.field}
            />

            <Label>Pièces jointes <Optional>(facultatif)</Optional></Label>
            <AttachmentButton onPress={() => setAttachment(value => !value)} accessibilityRole="button">
                <AttachmentIcon><SvgIcon name="fa-file-upload" size={21} color={colors.primary} /></AttachmentIcon>
                <View style={styles.flex}><Text variant="bold" color={colors.gray900}>{attachment ? 'Fichier sélectionné' : 'Joindre un fichier'}</Text><Text variant="regularSmall" color="gray600">PDF, JPG ou PNG · 10 Mo maximum</Text></View>
                <SvgIcon name="fa-chevron-right" size={15} color={colors.gray700} />
            </AttachmentButton>

            <SubmitButton onPress={submitRequest} accessibilityRole="button"><Text variant="bold" color={colors.white}>Envoyer la demande</Text></SubmitButton>
            <PrivacyNote><SvgIcon name="fa-shield-alt" size={20} color={colors.primary} /><View style={styles.flex}><Text variant="bold" color={colors.gray900}>Vos données sont en sécurité</Text><Text variant="regularSmall" color="gray600" style={styles.noteText}>Votre demande reste confidentielle et notre équipe répond généralement sous 24 à 48 h ouvrées.</Text></View></PrivacyNote>

            <Modal visible={topicModalVisible} transparent animationType="slide" onRequestClose={() => setTopicModalVisible(false)}>
                <ModalBackdrop><TopicSheet><ModalHandle /><Text variant="bold" color={colors.gray900} fontSize={18}>Choisissez un sujet</Text>{SUPPORT_TOPICS.map(item => <TopicOption key={item.key} onPress={() => { setTopic(item); setTopicModalVisible(false); }}><TopicIcon><SvgIcon name={item.icon} size={18} color={colors.white} /></TopicIcon><Text variant="regular" color={colors.gray900} style={styles.flex}>{item.label}</Text>{topic.key === item.key && <SvgIcon name="fa-check" size={17} color={colors.primary} />}</TopicOption>)}</TopicSheet></ModalBackdrop>
            </Modal>
        </ScreenContainer>
    );
};

const BrandRow = styled.View`align-items: center; margin-bottom: ${verticalScale(8)}px;`;
const Label = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`margin-top: ${verticalScale(22)}px; margin-bottom: ${verticalScale(8)}px;`;
const Required = styled.Text`color: ${colors.primary};`;
const Optional = styled.Text`font-family: Inter-Regular; font-weight: 400; color: ${colors.gray600};`;
const TopicButton = styled(Pressable)`min-height: ${verticalScale(56)}px; border-width: 1px; border-color: ${colors.gray300}; border-radius: ${moderateScale(12)}px; padding: ${verticalScale(8)}px ${horizontalScale(12)}px; flex-direction: row; align-items: center; gap: ${horizontalScale(12)}px;`;
const TopicIcon = styled.View`width: ${moderateScale(38)}px; height: ${moderateScale(38)}px; border-radius: ${moderateScale(20)}px; background-color: ${colors.primary}; justify-content: center; align-items: center;`;
const AttachmentButton = styled(Pressable)`min-height: ${verticalScale(68)}px; border-width: 1px; border-style: dashed; border-color: ${colors.gray300}; border-radius: ${moderateScale(12)}px; padding: ${verticalScale(10)}px ${horizontalScale(12)}px; flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px;`;
const AttachmentIcon = styled.View`width: ${moderateScale(38)}px; height: ${moderateScale(38)}px; border-radius: ${moderateScale(19)}px; background-color: #fff5ef; justify-content: center; align-items: center;`;
const SubmitButton = styled(Pressable)`height: ${verticalScale(56)}px; margin-top: ${verticalScale(22)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; justify-content: center; align-items: center;`;
const PrivacyNote = styled.View`margin-top: ${verticalScale(18)}px; padding: ${verticalScale(14)}px; border-radius: ${moderateScale(14)}px; background-color: #fff8f3; flex-direction: row; gap: ${horizontalScale(12)}px;`;
const ModalBackdrop = styled.View`flex: 1; justify-content: flex-end; background-color: rgba(0, 0, 0, 0.42);`;
const TopicSheet = styled.View`padding: ${verticalScale(14)}px ${horizontalScale(18)}px ${verticalScale(26)}px; border-top-left-radius: ${moderateScale(24)}px; border-top-right-radius: ${moderateScale(24)}px; background-color: ${colors.white};`;
const ModalHandle = styled.View`width: ${horizontalScale(42)}px; height: ${verticalScale(4)}px; border-radius: 2px; background-color: ${colors.gray300}; align-self: center; margin-bottom: ${verticalScale(18)}px;`;
const TopicOption = styled(Pressable)`min-height: ${verticalScale(58)}px; flex-direction: row; align-items: center; gap: ${horizontalScale(12)}px; border-bottom-width: 1px; border-bottom-color: ${colors.gray200};`;
const SuccessState = styled.View`flex: 1; align-items: center; justify-content: center; padding: ${verticalScale(24)}px;`;
const SuccessIcon = styled.View`width: ${moderateScale(64)}px; height: ${moderateScale(64)}px; border-radius: ${moderateScale(32)}px; background-color: ${colors.success}; align-items: center; justify-content: center; margin-bottom: ${verticalScale(18)}px;`;
const BackButton = styled(Pressable)`margin-top: ${verticalScale(28)}px; padding: ${verticalScale(12)}px;`;

const styles = StyleSheet.create({
    center: { textAlign: 'center' },
    successDescription: { marginTop: verticalScale(10) },
    heading: { marginTop: verticalScale(20), fontSize: 25 },
    subtitle: { marginTop: verticalScale(8), lineHeight: 22 },
    flex: { flex: 1 },
    noteText: { marginTop: verticalScale(4) },
    field: { marginTop: verticalScale(18) },
});

export default ContactSupportScreen;
