import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../foundations';
import { ProfessionalCard, QuoteCard } from '../../business';
import { AppText } from '../../ui';

export interface QuoteBlockProps {
  professionalName: string;
  professionalJob?: string;
  eta?: string;
  distance?: string;
  rating?: number;
  price: string;
  description?: string;
  onAccept: () => void;
  onRefuse: () => void;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  professionalName,
  professionalJob,
  eta,
  distance,
  rating,
  price,
  description,
  onAccept,
  onRefuse,
}) => (
  <View style={styles.container}>
    <AppText variant="h2">Devis reçu</AppText>

    <ProfessionalCard
      name={professionalName}
      job={professionalJob}
      eta={eta}
      distance={distance}
      rating={rating}
      verified
    />

    <QuoteCard
      price={price}
      description={description}
      onAccept={onAccept}
      onRefuse={onRefuse}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { gap: spacing[4] },
});
