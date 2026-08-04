import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useToast } from 'react-native-toast-notifications';

import { AppText, Button, Icon, radius, shadows, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useAddInterventionMutation } from '../../../../store/api';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { ClientRequestLayout, RequestProgress } from '../components';
import {
  resetRequestDraft,
  selectClientRequestDraft,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

const availabilityLabel = {
  now: 'Le plus vite possible',
  today: 'Aujourd’hui',
  tomorrow: 'Demain',
  custom: 'Créneau personnalisé',
};

export const C35ClientCreateRequestSummary: React.FC<Props> = ({ navigation }) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);
  const [addIntervention, addState] = useAddInterventionMutation();
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  const submit = async () => {
    if (!draft.serviceId || !draft.addressId || !draft.title || !draft.description) {
      toast.show('Veuillez compléter les informations obligatoires.', {
        type: 'danger',
        placement: 'bottom',
      });
      return;
    }

    try {
      const response = await addIntervention({
        service_id: draft.serviceId,
        address_id: draft.addressId,
        title: draft.title,
        description: draft.description,
        image_1: draft.photos[0] as any,
        image_2: draft.photos[1] as any,
        image_3: draft.photos[2] as any,
      }).unwrap();

      const interventionId = response?.data?.id || response?.id || 0;

      dispatch(resetRequestDraft());
      navigation.replace(ClientRoutes.CreateRequestConfirmation as never, {
        interventionId,
      } as never);
    } catch (error) {
      toast.show('Impossible de créer la demande. Réessayez.', {
        type: 'danger',
        placement: 'bottom',
      });
    }
  };

  const rows = [
    { icon: 'tools', label: 'Service', value: draft.serviceName || 'Service sélectionné' },
    { icon: 'document', label: 'Problème', value: draft.title || '-' },
    { icon: 'image', label: 'Photos', value: `${draft.photos.length} photo(s)` },
    { icon: 'location', label: 'Adresse', value: draft.addressLabel || 'Adresse sélectionnée' },
    { icon: 'clock', label: 'Disponibilité', value: availabilityLabel[draft.availability] },
  ] as const;

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Résumé"
      subtitle="Vérifiez votre demande avant l’envoi."
      step="Étape 6 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={6} total={7} />
          <Button
            title="Envoyer la demande"
            rightIcon="arrowRight"
            loading={addState.isLoading}
            onPress={submit}
          />
        </View>
      }
    >
      <View style={styles.card}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <View style={styles.iconBox}>
              <Icon name={row.icon} size="sm" color={c.primary} />
            </View>

            <View style={styles.rowText}>
              <AppText variant="caption" color={c.textMuted}>{row.label}</AppText>
              <AppText variant="bodyMedium" color={c.text}>{row.value}</AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.descriptionCard}>
        <AppText variant="caption" color={c.textMuted}>Description</AppText>
        <AppText variant="body" color={c.text}>
          {draft.description || '-'}
        </AppText>
      </View>
    </ClientRequestLayout>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    gap: vSpacing[3],
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  descriptionCard: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    gap: vSpacing[2],
    ...shadows.sm,
  },
});
