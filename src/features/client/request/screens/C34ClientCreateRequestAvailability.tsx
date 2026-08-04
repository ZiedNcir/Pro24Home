import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { ClientRequestLayout, RequestProgress, SelectableCard } from '../components';
import {
  selectClientRequestDraft,
  setRequestAvailability,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

const options = [
  {
    key: 'now',
    title: 'Le plus vite possible',
    subtitle: 'Recherche immédiate d’un professionnel disponible',
  },
  {
    key: 'today',
    title: 'Aujourd’hui',
    subtitle: 'Intervention dans la journée',
  },
  {
    key: 'tomorrow',
    title: 'Demain',
    subtitle: 'Planifier pour demain',
  },
  {
    key: 'custom',
    title: 'Choisir un créneau',
    subtitle: 'Sélectionner une disponibilité plus tard',
  },
] as const;

export const C34ClientCreateRequestAvailability: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Disponibilité"
      subtitle="Quand souhaitez-vous être dépanné ?"
      step="Étape 5 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={5} total={7} />
          <Button
            title="Voir le résumé"
            rightIcon="arrowRight"
            onPress={() => navigation.navigate(ClientRoutes.CreateRequestSummary as never)}
          />
        </View>
      }
    >
      {options.map((option) => (
        <SelectableCard
          key={option.key}
          title={option.title}
          subtitle={option.subtitle}
          icon="clock"
          selected={draft.availability === option.key}
          onPress={() => dispatch(setRequestAvailability(option.key))}
        />
      ))}
    </ClientRequestLayout>
  );
};
