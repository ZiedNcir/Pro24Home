import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { IconName } from '../../icons';
import { CategoryCard, PhotoUploader } from '../../business';
import { AppText, BaseCard, Button } from '../../ui';

export interface RequestSummaryBlockProps {
  categoryTitle: string;
  categoryIcon: IconName;
  problemType: string;
  description?: string;
  addressLabel: string;
  photoCount: number;
  onConfirm: () => void;
  onEdit?: () => void;
}

export const RequestSummaryBlock: React.FC<RequestSummaryBlockProps> = ({
  categoryTitle,
  categoryIcon,
  problemType,
  description,
  addressLabel,
  photoCount,
  onConfirm,
  onEdit,
}) => (
  <View style={styles.container}>
    <AppText variant="h2">Résumé de votre demande</AppText>

    <CategoryCard title={categoryTitle} icon={categoryIcon} selected />

    <BaseCard>
      <View style={styles.row}>
        <AppText variant="label" color={colors.textMuted}>Type de panne</AppText>
        <AppText variant="bodyMedium">{problemType}</AppText>
      </View>

      {description ? (
        <View style={styles.row}>
          <AppText variant="label" color={colors.textMuted}>Description</AppText>
          <AppText variant="body">{description}</AppText>
        </View>
      ) : null}

      <View style={styles.row}>
        <AppText variant="label" color={colors.textMuted}>Adresse</AppText>
        <AppText variant="body">{addressLabel}</AppText>
      </View>
    </BaseCard>

    <PhotoUploader count={photoCount} onPress={() => {}} />

    <View style={styles.actions}>
      <Button title="Confirmer ma demande" onPress={onConfirm} />
      {onEdit ? <Button title="Modifier" variant="ghost" onPress={onEdit} /> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: spacing[4] },
  row: { gap: spacing[1], marginBottom: spacing[3] },
  actions: { gap: spacing[2] },
});
