import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { AppText, BaseCard, Button } from '../../ui';

export interface QuoteCardProps {
  price: string;
  description?: string;
  onAccept?: () => void;
  onRefuse?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  price,
  description,
  onAccept,
  onRefuse,
}) => (
  <BaseCard elevated>
    <AppText variant="title">Devis estimatif</AppText>
    <AppText variant="h1" color={colors.primary[700]} style={styles.price}>{price}</AppText>
    {description ? <AppText variant="body" color={colors.textMuted}>{description}</AppText> : null}
    <View style={styles.actions}>
      <Button title="Accepter" size="md" onPress={onAccept} />
      <Button title="Refuser" size="md" variant="ghost" onPress={onRefuse} />
    </View>
  </BaseCard>
);

const styles = StyleSheet.create({
  price: { marginVertical: spacing[2] },
  actions: { gap: spacing[2], marginTop: spacing[4] },
});
