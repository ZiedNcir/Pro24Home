import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppLoader, Button, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { ClientRequestLayout, RequestProgress, SelectableCard } from '../components';
import { getServiceIcon, useRequestServices } from '../hooks';
import {
  selectClientRequestDraft,
  setRequestService,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

export const C30ClientCreateRequestCategory: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);
  const { services, isLoading } = useRequestServices();
  const preselectedServiceId = (route.params as any)?.serviceId;

  React.useEffect(() => {
    if (preselectedServiceId && services.length) {
      const service = services.find((item) => item.id === preselectedServiceId);
      if (service) {
        dispatch(setRequestService({ serviceId: service.id, serviceName: service.name }));
      }
    }
  }, [dispatch, preselectedServiceId, services]);

  const fallback = [
    { id: 1, name: 'Plomberie' },
    { id: 2, name: 'Électricité' },
    { id: 3, name: 'Peinture' },
    { id: 4, name: 'Serrurerie' },
  ] as any[];

  const data = services.length ? services : fallback;

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Nouvelle demande"
      subtitle="Choisissez le service dont vous avez besoin."
      step="Étape 1 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={1} total={7} />
          <Button
            title="Continuer"
            rightIcon="arrowRight"
            disabled={!draft.serviceId}
            onPress={() => navigation.navigate(ClientRoutes.CreateRequestDescription as never)}
          />
        </View>
      }
    >
      {isLoading ? (
        <AppLoader label="Chargement des services..." />
      ) : (
        data.map((service) => (
          <SelectableCard
            key={service.id}
            title={service.name}
            subtitle="Intervention par un professionnel qualifié"
            icon={getServiceIcon(service)}
            selected={draft.serviceId === service.id}
            onPress={() =>
              dispatch(setRequestService({ serviceId: service.id, serviceName: service.name }))
            }
          />
        ))
      )}
    </ClientRequestLayout>
  );
};
