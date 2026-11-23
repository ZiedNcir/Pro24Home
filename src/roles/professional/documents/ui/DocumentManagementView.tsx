import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@utils/normalizedCss';
import { useTranslation } from 'react-i18next';
import type { Document, DocumentType } from '@entities/user/model';
import Text from '@shared/ui/typography/Text';
import { Button } from '@shared/ui/button/Button';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import {
  getDocumentForType,
  PROFESSIONAL_DOCUMENTS,
} from '../model/professional-documents';

interface Props {
  documents: Document[];
  busy?: DocumentType;
  onView: (document: Document) => void;
  onReplace: (name: DocumentType) => void;
}

export default function DocumentManagementView({
  documents,
  busy,
  onView,
  onReplace,
}: Props) {
  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();
  const stackActions = width < 360 || fontScale > 1.3;
  const {
    theme: { colors },
  } = useTheme();
  return (
    <>
      <Title
        variant="title"
        fontSize={26}
        lineHeight={32}
        accessibilityRole="header"
      >
        {t('professional.documentManagement.title')}
      </Title>
      <Description fontSize={15} lineHeight={22} color={colors.textSecondary}>
        {t('professional.documentManagement.description')}
      </Description>
      {PROFESSIONAL_DOCUMENTS.map(item => {
        const document = getDocumentForType(documents, item.name);
        const status = !document
          ? 'missing'
          : ['approved', 'pending', 'rejected'].includes(document.status)
          ? document.status
          : 'unknown';
        const tint =
          status === 'approved'
            ? colors.successLight
            : status === 'rejected'
            ? colors.dangerLight
            : status === 'pending'
            ? colors.warningLight
            : colors.surfaceVariant;
        const statusColor =
          status === 'approved'
            ? colors.success
            : status === 'rejected'
            ? colors.danger
            : status === 'pending'
            ? colors.warning
            : colors.textSecondary;
        return (
          <DocumentRow key={item.name} $stacked={stackActions}>
            <Summary>
              <SvgIcon
                name={item.icon}
                size={moderateScale(22)}
                color={colors.textSecondary}
              />
              <Copy>
                <Text variant="bold" fontSize={14} lineHeight={19}>
                  {t(`professional.documentManagement.names.${item.name}`)}
                </Text>
                <Badge $tint={tint}>
                  <SvgIcon
                    name={
                      status === 'approved'
                        ? 'fa-check-circle'
                        : status === 'rejected'
                        ? 'fa-times-circle'
                        : 'fa-clock'
                    }
                    size={moderateScale(13)}
                    color={statusColor}
                  />
                  <StatusText
                    variant="medium"
                    fontSize={12}
                    lineHeight={17}
                    color={colors.textPrimary}
                  >
                    {t(`professional.documentManagement.status.${status}`)}
                  </StatusText>
                </Badge>
              </Copy>
            </Summary>
            <Actions $stacked={stackActions}>
              {document ? (
                <ViewButton
                  title={t('professional.documentManagement.view')}
                  variant="ghost"
                  size="small"
                  width={horizontalScale(44)}
                  height={verticalScale(44)}
                  onPress={() => onView(document)}
                  disabled={!!busy}
                  accessibilityLabel={`${t(
                    'professional.documentManagement.view',
                  )} : ${t(item.titleKey)}`}
                />
              ) : null}
              <ReplaceButton
                title={t(
                  document
                    ? 'professional.documentManagement.replace'
                    : 'professional.documentManagement.add',
                )}
                variant="ghost"
                backgroundColor={colors.warningLight}
                textColor={colors.textPrimary}
                icon={document ? 'fa-sync-alt' : 'fa-plus'}
                iconColor={colors.primaryDark}
                size="small"
                width={horizontalScale(110)}
                height={verticalScale(44)}
                iconSize={moderateScale(12)}
                onPress={() => onReplace(item.name)}
                disabled={!!busy}
                loading={busy === item.name}
                hideContentWhenLoading
                accessibilityRole="button"
                accessibilityLabel={`${t(
                  document
                    ? 'professional.documentManagement.replace'
                    : 'professional.documentManagement.add',
                )} : ${t(item.titleKey)}`}
              />
            </Actions>
          </DocumentRow>
        );
      })}
      <Footer>
        <SvgIcon
          name="fa-info"
          size={moderateScale(15)}
          color={colors.textSecondary}
        />
        <FooterText variant="regularSmall" color={colors.textSecondary}>
          {t('professional.documentManagement.formats')}
        </FooterText>
      </Footer>
    </>
  );
}

const Title = styled(Text)`
  margin-top: ${verticalScale(24)}px;
  max-width: ${horizontalScale(300)}px;
`;
const Description = styled(Text)`
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(22)}px;
`;
const DocumentRow = styled.View<{ $stacked: boolean }>`
  flex-direction: ${({ $stacked }) => ($stacked ? 'column' : 'row')};
  align-items: ${({ $stacked }) => ($stacked ? 'stretch' : 'center')};
  gap: ${horizontalScale(10)}px;
  min-height: ${verticalScale(98)}px;
  padding-vertical: ${verticalScale(18)}px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${({ theme }) => theme.colors.borderLight};
`;
const Summary = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
`;
const Copy = styled.View`
  flex: 1;
`;
const Badge = styled.View<{ $tint: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(5)}px;
  align-self: flex-start;
  border-radius: ${moderateScale(8)}px;
  padding: ${verticalScale(4)}px ${horizontalScale(8)}px;
  margin-top: ${verticalScale(7)}px;
  max-width: 100%;
  background-color: ${({ $tint }) => $tint};
`;
const StatusText = styled(Text)`
  flex-shrink: 1;
`;
const Actions = styled.View<{ $stacked: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(4)}px;
  align-self: ${({ $stacked }) => ($stacked ? 'flex-end' : 'auto')};
  margin-top: ${({ $stacked }) => ($stacked ? verticalScale(4) : 0)}px;
`;
const ViewButton = styled(Button)`
  padding-horizontal: 0px;
`;
const ReplaceButton = styled(Button)`
  padding-horizontal: ${horizontalScale(8)}px;
  border-radius: ${moderateScale(10)}px;
`;
const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
  margin-top: ${verticalScale(24)}px;
  margin-bottom: ${verticalScale(16)}px;
`;
const FooterText = styled(Text)`
  flex: 1;
`;
