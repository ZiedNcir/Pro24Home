import React, { useState } from 'react';
import { ActivityIndicator, Modal, Switch } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon, type IconName } from '@shared/ui/icon';
import { useTheme } from '@theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, selectUser } from '@store/slices/authSlice';
import { useLogoutMutation } from '@features/auth/api/auth.api';
import { colors } from '@theme/index';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import { useNavigation } from '@react-navigation/native';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { PROFESSIONAL_SETTINGS_DOCUMENT } from '../../../../navigation/professionalNavigation';

type ModalType = 'payment' | 'faq' | 'terms' | null;

const ClientSettingsScreen = ({
  professional = false,
}: {
  professional?: boolean;
}) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // The API endpoint also clears the local session on failure.
      dispatch(logout());
    } finally {
      const rootNavigation = navigation.getParent?.() || navigation;
      (rootNavigation as any).reset({
        index: 0,
        routes: [
          {
            name: 'SignIn',
            params: { role: professional ? 'professional' : 'client' },
          },
        ],
      });
    }
  };

  return (
    <ScreenContainer
      mode={themeMode}
      scrollable
      paddingHorizontal={horizontalScale(18)}
      paddingVertical={verticalScale(14)}
      contentContainerStyle={{ paddingBottom: verticalScale(180) }}
    >
      <InterventionHeader
        title="Paramètres"
        showHelp={false}
        onClose={() => (navigation as any).navigate('Home')}
      />
      <Subtitle>Gérez votre compte et vos préférences.</Subtitle>

      <SectionLabel>COMPTE</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-user"
          title="Profil"
          description={
            user?.name
              ? `${user.name} · Informations personnelles`
              : 'Gérez vos informations personnelles'
          }
          onPress={() => (navigation as any).navigate('Profile')}
        />
        {professional ? (
          <SettingsRow
            {...PROFESSIONAL_SETTINGS_DOCUMENT}
            onPress={() =>
              (navigation.getParent?.() as any)?.navigate(
                PROFESSIONAL_SETTINGS_DOCUMENT.route,
              )
            }
          />
        ) : (
          <SettingsRow
            icon="fa-map-marker-alt"
            title="Adresses enregistrées"
            description="Consultez et gérez vos adresses"
            onPress={() => (navigation as any).navigate('SavedAddresses')}
          />
        )}
      </SectionCard>

      <SectionLabel>PRÉFÉRENCES</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-bell"
          title="Notifications"
          description="Recevez des alertes sur vos interventions"
          accessory={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
            />
          }
        />
        <SettingsRow
          icon="fa-info"
          title="Langue"
          description="Choisissez votre langue"
          value="Français"
          onPress={() => undefined}
        />
        <SettingsRow
          icon="fa-cog"
          title="Thème"
          description="Personnalisez l’apparence de l’application"
          value={themeMode === 'dark' ? 'Sombre' : 'Clair'}
          onPress={toggleTheme}
        />
      </SectionCard>

      <SectionLabel>PAIEMENT</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-credit-card"
          title="Modes de paiement"
          description="Gérez vos moyens de paiement"
          onPress={() => setActiveModal('payment')}
        />
        <SettingsRow
          icon="fa-file-invoice"
          title="Frais de déplacement"
          description="Consultez les informations de paiement"
          onPress={() => setActiveModal('payment')}
        />
      </SectionCard>

      <SectionLabel>ASSISTANCE</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-question-circle"
          title="FAQ"
          description="Trouvez rapidement une réponse"
          onPress={() => setActiveModal('faq')}
        />
        <SettingsRow
          icon="fa-file-alt"
          title="Conditions d’utilisation"
          description="Consultez les conditions du service"
          onPress={() => setActiveModal('terms')}
        />
        <SettingsRow
          icon="fa-headset"
          title="Contacter le support"
          description="Obtenez de l’aide pour votre compte"
          onPress={() => (navigation as any).navigate('ContactSupport')}
        />
      </SectionCard>

      <LogoutRow
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.75}
      >
        <RowIcon background="#fff0f0">
          <SvgIcon name="fa-sign-out-alt" size={18} color="#D92D20" />
        </RowIcon>
        <RowContent>
          <Text variant="bold" color="#D92D20" fontSize={14}>
            Déconnexion
          </Text>
          <Text variant="regularSmall" color="gray600">
            {isLoggingOut
              ? 'Déconnexion en cours...'
              : 'Se déconnecter de votre compte'}
          </Text>
        </RowContent>
        {isLoggingOut ? (
          <ActivityIndicator color="#D92D20" />
        ) : (
          <SvgIcon name="fa-chevron-right" size={14} color="#D92D20" />
        )}
      </LogoutRow>

      <Brand>
        Pro24
        <Text variant="bold" color={colors.primary}>
          Home
        </Text>
      </Brand>

      <SettingsModal type={activeModal} onClose={closeModal} />
    </ScreenContainer>
  );
};

interface SettingsRowProps {
  icon: IconName;
  title: string;
  description: string;
  value?: string;
  accessory?: React.ReactNode;
  onPress?: () => void;
}

const SettingsRow = ({
  icon,
  title,
  description,
  value,
  accessory,
  onPress,
}: SettingsRowProps) => (
  <Row onPress={onPress} disabled={!onPress} activeOpacity={0.75}>
    <RowIcon>
      <SvgIcon name={icon} size={18} color={colors.primary} />
    </RowIcon>
    <RowContent>
      <Text variant="bold" color="black" fontSize={14}>
        {title}
      </Text>
      <Text variant="regularSmall" color="gray600">
        {description}
      </Text>
    </RowContent>
    {accessory || (
      <>
        {value ? (
          <Text variant="regular" color="gray700">
            {value}
          </Text>
        ) : null}
        <SvgIcon name="fa-chevron-right" size={14} color={colors.gray700} />
      </>
    )}
  </Row>
);

const SettingsModal = ({
  type,
  onClose,
}: {
  type: ModalType;
  onClose: () => void;
}) => {
  const title =
    type === 'faq'
      ? 'FAQ'
      : type === 'terms'
      ? 'Conditions d’utilisation'
      : 'Paiement';
  return (
    <Modal
      visible={type !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalBackdrop>
        <ModalSheet>
          <ModalHandle />
          <ModalHeader>
            <Text variant="bold" color="black" fontSize={17}>
              {title}
            </Text>
            <CloseButton onPress={onClose}>
              <Text variant="bold" color="gray600" fontSize={18}>
                ×
              </Text>
            </CloseButton>
          </ModalHeader>
          {type === 'faq' ? (
            <ModalText>
              <Text variant="bold" color="black">
                Comment suivre mon intervention ?
              </Text>
              {'\n'}Retrouvez son statut dans l’onglet Interventions.{'\n\n'}
              <Text variant="bold" color="black">
                Quand le prix final est-il confirmé ?
              </Text>
              {'\n'}Après le diagnostic réalisé par le professionnel.
            </ModalText>
          ) : null}
          {type === 'terms' ? (
            <ModalText>
              En utilisant Pro24Home, vous acceptez nos conditions d’utilisation
              et notre politique de confidentialité. Les interventions et
              paiements sont soumis aux conditions affichées avant confirmation.
            </ModalText>
          ) : null}
          {type === 'payment' ? (
            <ModalText>
              Vos paiements sont sécurisés. Les frais de déplacement sont
              affichés avant confirmation et sont déduits du prix final si
              l’intervention est réalisée.
            </ModalText>
          ) : null}
        </ModalSheet>
      </ModalBackdrop>
    </Modal>
  );
};

export const ProfessionalSettingsScreen = () => (
  <ClientSettingsScreen professional />
);

export default ClientSettingsScreen;

const Subtitle = styled(Text).attrs({ variant: 'regular', color: 'gray600' })`
  margin-top: ${verticalScale(4)}px;
`;
const SectionLabel = styled(Text).attrs({
  variant: 'bold',
  color: 'gray700',
  fontSize: 12,
})`
  margin-top: ${verticalScale(24)}px;
  margin-bottom: ${verticalScale(8)}px;
  letter-spacing: 0.5px;
`;
const SectionCard = styled.View`
  border-width: 1px;
  border-color: #eeeeee;
  border-radius: ${moderateScale(16)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding-horizontal: ${horizontalScale(12)}px;
`;
const Row = styled.TouchableOpacity`
  min-height: ${verticalScale(76)}px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
`;
const RowIcon = styled.View<{ background?: string }>`
  width: ${horizontalScale(38)}px;
  height: ${horizontalScale(38)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${({ background }) => background || '#fff5ef'};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(12)}px;
`;
const RowContent = styled.View`
  flex: 1;
`;
const LogoutRow = styled.TouchableOpacity`
  min-height: ${verticalScale(76)}px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #ffd6d2;
  border-radius: ${moderateScale(16)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding-horizontal: ${horizontalScale(12)}px;
  margin-top: ${verticalScale(24)}px;
`;
const Brand = styled(Text).attrs({
  variant: 'bold',
  color: 'black',
  fontSize: 18,
})`
  align-self: center;
  margin-top: ${verticalScale(34)}px;
`;
const ModalBackdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.42);
`;
const ModalSheet = styled.View`
  padding: ${verticalScale(14)}px ${horizontalScale(18)}px
    ${verticalScale(26)}px;
  border-top-left-radius: ${moderateScale(24)}px;
  border-top-right-radius: ${moderateScale(24)}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;
const ModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: 2px;
  background-color: #d9d9d9;
  align-self: center;
  margin-bottom: ${verticalScale(14)}px;
`;
const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${verticalScale(18)}px;
`;
const CloseButton = styled.TouchableOpacity`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: 17px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;
const ModalText = styled(Text).attrs({ variant: 'regular', color: 'gray700' })`
  line-height: 22px;
  padding-bottom: ${verticalScale(12)}px;
`;
