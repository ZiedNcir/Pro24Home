import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../foundations';
import { Icon } from '../../icons';
import { ProfessionalCard } from '../../business';
import { AppText, BaseCard, Button } from '../../ui';

export interface TrackingBlockProps {
  professionalName: string;
  professionalJob?: string;
  eta: string;
  distance?: string;
  rating?: number;
  addressLabel?: string;
  onMessagePress: () => void;
}

export const TrackingBlock: React.FC<TrackingBlockProps> = ({
  professionalName,
  professionalJob,
  eta,
  distance,
  rating,
  addressLabel,
  onMessagePress,
}) => (
  <View style={styles.container}>
    <BaseCard padded={false} elevated>
      <View style={styles.mapPlaceholder}>
        <Icon name="map" size={72} color={colors.primary[600]} />
        <AppText variant="title" color={colors.primary[700]}>Suivi GPS</AppText>
      </View>

      <View style={styles.mapContent}>
        <AppText variant="h2">Arrivée dans {eta}</AppText>
        {addressLabel ? <AppText variant="body" color={colors.textMuted}>{addressLabel}</AppText> : null}
      </View>
    </BaseCard>

    <ProfessionalCard
      name={professionalName}
      job={professionalJob}
      eta={eta}
      distance={distance}
      rating={rating}
      verified
    />

    <Button title="Message" leftIcon="message" onPress={onMessagePress} />
  </View>
);

const styles = StyleSheet.create({
  container: { gap: spacing[4] },
  mapPlaceholder: {
    height: 220,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  mapContent: {
    padding: spacing[4],
    gap: spacing[1],
  },
});
