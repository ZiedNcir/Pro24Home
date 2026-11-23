import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@utils/normalizedCss';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Document, DocumentType } from '@entities/user/model';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import {
  getDocumentForType,
  getDocumentSubmissionProgress,
  PROFESSIONAL_DOCUMENTS,
} from '../model/professional-documents';

export interface ProfessionalDocumentsViewProps {
  documents: Document[];
  activeType: DocumentType;
  isUploading: boolean;
  onChooseFile: () => void | Promise<void>;
  onTakePhoto: () => void | Promise<void>;
  onSelectType: (type: DocumentType) => void;
  onContinue: () => void | Promise<void>;
  onBack: () => void;
  onHelp: () => void;
}

const ProfessionalDocumentsView = ({
  documents,
  activeType,
  isUploading,
  onChooseFile,
  onTakePhoto,
  onSelectType,
  onContinue,
  onBack,
  onHelp,
}: ProfessionalDocumentsViewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const colors = theme.colors;
  const progress = getDocumentSubmissionProgress(documents);
  const activeDocument = getDocumentForType(documents, activeType);
  const activeMeta =
    PROFESSIONAL_DOCUMENTS.find(item => item.name === activeType) ||
    PROFESSIONAL_DOCUMENTS[0]!;
  const isSent = (name: DocumentType) =>
    ['pending', 'approved'].includes(
      getDocumentForType(documents, name)?.status || '',
    );
  const nextDocuments = PROFESSIONAL_DOCUMENTS.filter(
    item => item.name !== activeType && !isSent(item.name),
  );
  const identitySent =
    isSent('identity_front') &&
    isSent('identity_back') &&
    progress.submitted === 2;
  const rejected = activeDocument?.status === 'rejected';
  const complete = progress.canContinue;
  const percent = Math.round((progress.submitted / progress.total) * 100);
  const disabled = isUploading;
  const title = complete
    ? t('professional.documentDesign.completeTitle')
    : t(`professional.documentDesign.titles.${activeMeta.name}`);
  const description = complete
    ? t('professional.documentDesign.completeDescription')
    : t(`professional.documentDesign.descriptions.${activeMeta.name}`);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderColor: colors.borderLight },
        ]}
      >
        <Pressable
          style={styles.headerButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('professional.documents.back')}
        >
          <SvgIcon
            name="fa-chevron-left"
            size={19}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text variant="bold" fontSize={18} color={colors.textPrimary}>
          {t('professional.documentDesign.title')}
        </Text>
        <Pressable
          style={styles.headerButton}
          onPress={onHelp}
          accessibilityRole="button"
          accessibilityLabel={t('professional.documents.help')}
        >
          <SvgIcon
            name="fa-question-circle"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.progressHeader}>
        <Text
          variant="medium"
          fontSize={14}
          lineHeight={18}
          color={colors.textPrimary}
        >
          {t('professional.documentDesign.progress', {
            sent: progress.submitted,
            total: progress.total,
          })}
        </Text>
        <Text
          variant="regularSmall"
          fontSize={14}
          lineHeight={18}
          color={colors.textSecondary}
        >
          {percent} %
        </Text>
      </View>
      <View
        style={[styles.progressTrack, { backgroundColor: colors.border }]}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: progress.total,
          now: progress.submitted,
          text: `${percent} %`,
        }}
      >
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.primary, width: `${percent}%` },
          ]}
        />
      </View>

      {progress.submitted > 0 ? (
        <View
          style={[styles.sentNotice, { backgroundColor: colors.successLight }]}
        >
          <SvgIcon name="fa-check-circle" size={19} color={colors.success} />
          <Text
            variant="bold"
            fontSize={14}
            color={colors.textPrimary}
            style={styles.flex}
          >
            {identitySent
              ? t('professional.documentDesign.identitySent')
              : t('professional.documentDesign.sentCount', {
                  count: progress.submitted,
                })}
          </Text>
        </View>
      ) : null}

      <Text
        variant="bold"
        fontSize={25}
        lineHeight={28}
        color={colors.textPrimary}
        style={styles.title}
      >
        {title}
      </Text>
      <Text
        variant="regular"
        fontSize={14}
        lineHeight={20}
        color={colors.textSecondary}
        style={styles.description}
      >
        {description}
      </Text>
      {rejected ? (
        <View
          style={[styles.rejection, { backgroundColor: colors.dangerLight }]}
        >
          <SvgIcon
            name="fa-exclamation-circle"
            size={17}
            color={colors.danger}
          />
          <Text
            variant="regularSmall"
            color={colors.textPrimary}
            style={styles.flex}
          >
            {t('professional.documentDesign.replaceRejected')}
          </Text>
        </View>
      ) : null}

      {complete ? (
        <View
          style={[
            styles.completeNotice,
            { backgroundColor: colors.successLight },
          ]}
        >
          <SvgIcon name="fa-check-circle" size={48} color={colors.success} />
          <Text
            variant="bold"
            color={colors.textPrimary}
            style={styles.completeText}
          >
            {t('professional.documentDesign.allSent')}
          </Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={onChooseFile}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t('professional.documentDesign.selectDocument')}
            style={[
              styles.uploadArea,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
          >
            {isUploading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <SvgIcon
                name="fa-file-upload"
                size={54}
                color={colors.textSecondary}
              />
            )}
            <Text
              variant="bold"
              fontSize={16}
              color={colors.textPrimary}
              style={styles.uploadTitle}
              accessibilityLiveRegion="polite"
            >
              {isUploading
                ? t('professional.documents.uploading')
                : t('professional.documentDesign.selectDocument')}
            </Text>
            <Text
              variant="regularSmall"
              fontSize={13}
              color={colors.textSecondary}
              style={styles.center}
            >
              {t('professional.documents.fileFormats')}
            </Text>
          </Pressable>
          <Pressable
            onPress={onChooseFile}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t('professional.documents.chooseFile')}
            accessibilityState={{ disabled, busy: isUploading }}
            style={[
              styles.primaryButton,
              { backgroundColor: colors.primary },
              disabled ? styles.disabled : styles.enabled,
            ]}
          >
            <SvgIcon
              name="fa-folder-open"
              size={22}
              color={colors.textInverse}
            />
            <Text variant="bold" fontSize={17} color={colors.textInverse}>
              {t('professional.documents.chooseFile')}
            </Text>
          </Pressable>
          <Pressable
            onPress={onTakePhoto}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t('professional.documents.takePhoto')}
            accessibilityState={{ disabled }}
            style={[
              styles.secondaryButton,
              { borderColor: colors.primary },
              disabled ? styles.disabled : styles.enabled,
            ]}
          >
            <SvgIcon name="fa-camera" size={22} color={colors.primary} />
            <Text variant="bold" fontSize={17} color={colors.primary}>
              {t('professional.documents.takePhoto')}
            </Text>
          </Pressable>
        </>
      )}

      {complete ? (
        <Pressable
          onPress={onContinue}
          disabled={isUploading}
          accessibilityRole="button"
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        >
          <Text variant="bold" fontSize={16} color={colors.textInverse}>
            {t('professional.documentDesign.followDossier')}
          </Text>
          <SvgIcon
            name="fa-chevron-right"
            size={15}
            color={colors.textInverse}
          />
        </Pressable>
      ) : null}

      {nextDocuments.length > 0 ? (
        <View style={styles.nextSection}>
          <Text
            variant="bold"
            fontSize={18}
            color={colors.textPrimary}
            style={styles.nextTitle}
          >
            {t('professional.documentDesign.next')}
          </Text>
          {nextDocuments.map(item => (
            <Pressable
              key={item.name}
              onPress={() => onSelectType(item.name)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={t(item.titleKey)}
              accessibilityState={{ disabled }}
              style={[styles.documentRow, { borderBottomColor: colors.border }]}
            >
              <SvgIcon
                name={item.name === 'kbis' ? 'fa-file-alt' : item.icon}
                size={22}
                color={colors.textSecondary}
              />
              <Text
                variant="regular"
                fontSize={15}
                color={colors.textPrimary}
                style={styles.flex}
              >
                {item.name === 'rib' || item.name === 'kbis'
                  ? t(`professional.documentDesign.names.${item.name}`)
                  : t(item.titleKey)}
              </Text>
              {getDocumentForType(documents, item.name)?.status ===
              'rejected' ? (
                <SvgIcon
                  name="fa-exclamation-circle"
                  size={12}
                  color={colors.danger}
                />
              ) : (
                <View
                  style={[
                    styles.pendingDot,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}
              <SvgIcon
                name="fa-chevron-right"
                size={12}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      ) : null}
      <Text
        variant="regularSmall"
        fontSize={11}
        lineHeight={16}
        color={colors.textSecondary}
        style={styles.reviewHint}
      >
        {t('professional.documentDesign.reviewHint')}
      </Text>
      <View style={styles.savedFooter}>
        <SvgIcon name="fa-info" size={14} color={colors.textSecondary} />
        <Text
          variant="regularSmall"
          fontSize={12}
          lineHeight={18}
          color={colors.textSecondary}
          style={styles.flex}
        >
          {t('professional.documentDesign.savedHint')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(18),
    paddingTop: verticalScale(23),
    paddingBottom: verticalScale(24),
  },
  header: {
    minHeight: verticalScale(52),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(4),
  },
  headerButton: {
    width: horizontalScale(40),
    height: verticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: moderateScale(12),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
  },
  progressTrack: {
    height: verticalScale(10),
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: moderateScale(6) },
  sentNotice: {
    marginTop: verticalScale(22),
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(7),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(9),
  },
  title: { marginTop: verticalScale(18) },
  description: { marginTop: verticalScale(6) },
  uploadArea: {
    marginTop: verticalScale(15),
    minHeight: verticalScale(160),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
    gap: moderateScale(9),
  },
  uploadTitle: { marginTop: verticalScale(2), textAlign: 'center' },
  primaryButton: {
    minHeight: verticalScale(48),
    marginTop: verticalScale(20),
    borderRadius: moderateScale(13),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(10),
    padding: moderateScale(12),
  },
  secondaryButton: {
    minHeight: verticalScale(48),
    marginTop: verticalScale(12),
    borderRadius: moderateScale(13),
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(10),
    padding: moderateScale(12),
  },
  nextSection: { marginTop: verticalScale(20) },
  nextTitle: { marginBottom: verticalScale(7) },
  documentRow: {
    minHeight: verticalScale(48),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(2),
  },
  pendingDot: {
    height: verticalScale(9),
    width: horizontalScale(9),
    borderRadius: moderateScale(5),
  },
  flex: { flex: 1 },
  disabled: { opacity: 0.65 },
  enabled: { opacity: 1 },
  center: { textAlign: 'center' },
  reviewHint: { marginTop: verticalScale(14) },
  savedFooter: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  rejection: {
    marginTop: verticalScale(14),
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    gap: moderateScale(8),
    alignItems: 'center',
  },
  completeNotice: {
    marginTop: verticalScale(24),
    padding: moderateScale(24),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    gap: moderateScale(16),
  },
  completeText: { textAlign: 'center' },
});

export default ProfessionalDocumentsView;
