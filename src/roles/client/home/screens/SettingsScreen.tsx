import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Switch } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon, type IconName } from '@shared/ui/icon';
import { useTheme } from '@theme';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, selectUser } from '@store/slices/authSlice';
import { useLogoutMutation } from '@features/auth/api/auth.api';
import { colors } from '@theme';
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
  const { t, i18n } = useTranslation();
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
        title={t('client.settings.title')}
        showHelp={false}
        onClose={() => (navigation as any).navigate('Home')}
      />
      <Subtitle>{t('client.settings.description')}</Subtitle>

      <SectionLabel>{t('client.settings.account')}</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-user"
          title={t('client.settings.profile')}
          description={
            user?.name
              ? t('client.settings.profileWithName', { name: user.name })
              : t('client.settings.personalInfo')
          }
          onPress={() => (navigation as any).navigate('Profile')}
        />
        {professional ? (
          <SettingsRow
            icon={PROFESSIONAL_SETTINGS_DOCUMENT.icon}
            title={t('client.settings.professionalDocuments')}
            description={t('client.settings.manageDocuments')}
            onPress={() =>
              (navigation.getParent?.() as any)?.navigate(
                PROFESSIONAL_SETTINGS_DOCUMENT.route,
              )
            }
          />
        ) : (
          <SettingsRow
            icon="fa-map-marker-alt"
            title={t('client.settings.savedAddresses')}
            description={t('client.settings.manageAddresses')}
            onPress={() => (navigation as any).navigate('SavedAddresses')}
          />
        )}
      </SectionCard>

      <SectionLabel>{t('client.settings.preferences')}</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-bell"
          title={t('client.settings.notifications')}
          description={t('client.settings.notificationDescription')}
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
          title={t('client.settings.language')}
          description={t('client.settings.languageDescription')}
          value={i18n.language === 'en' ? t('client.settings.languageEnglish') : t('client.settings.languageFrench')}
          onPress={() => undefined}
        />
        <SettingsRow
          icon="fa-cog"
          title={t('client.settings.theme')}
          description={t('client.settings.themeDescription')}
          value={themeMode === 'dark' ? t('client.settings.themeDark') : t('client.settings.themeLight')}
          onPress={toggleTheme}
        />
      </SectionCard>

      <SectionLabel>{t('client.settings.paymentSection')}</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-credit-card"
          title={t('client.settings.paymentMethods')}
          description={t('client.settings.paymentMethodsDescription')}
          onPress={() => setActiveModal('payment')}
        />
        <SettingsRow
          icon="fa-file-invoice"
          title={t('client.settings.travelFees')}
          description={t('client.settings.travelFeesDescription')}
          onPress={() => setActiveModal('payment')}
        />
      </SectionCard>

      <SectionLabel>{t('client.settings.assistance')}</SectionLabel>
      <SectionCard>
        <SettingsRow
          icon="fa-question-circle"
          title={t('client.settings.faqTitle')}
          description={t('client.settings.helpDescription')}
          onPress={() => setActiveModal('faq')}
        />
        <SettingsRow
          icon="fa-file-alt"
          title={t('client.settings.terms')}
          description={t('client.settings.termsDescription')}
          onPress={() => setActiveModal('terms')}
        />
        <SettingsRow
          icon="fa-headset"
          title={t('client.settings.support')}
          description={t('client.settings.supportDescription')}
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
            {t('client.settings.logout')}
          </Text>
          <Text variant="regularSmall" color="gray600">
            {isLoggingOut
              ? t('client.settings.logoutPending')
              : t('client.settings.logoutDescription')}
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
  const { t } = useTranslation();
  const title =
    type === 'faq'
      ? t('client.settings.help')
      : type === 'terms'
      ? t('client.settings.terms')
      : t('client.settings.paymentTitle');
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
                {t('client.settings.faqTracking')}
              </Text>
              {'\n'}{t('client.settings.faqTrackingAnswer')}{'\n\n'}
              <Text variant="bold" color="black">
                {t('client.settings.faqPrice')}
              </Text>
              {'\n'}{t('client.settings.faqPriceAnswer')}
            </ModalText>
          ) : null}
          {type === 'terms' ? (
            <ModalText>
              {t('client.settings.termsCopy')}
            </ModalText>
          ) : null}
          {type === 'payment' ? (
            <ModalText>
              {t('client.settings.paymentCopy')}
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
