import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppLoader, Button, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useGetAddressesQuery } from '../../../../store/api';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { ClientRequestLayout, RequestProgress, SelectableCard } from '../components';
import {
  selectClientRequestDraft,
  setRequestAddress,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

export const C33ClientCreateRequestAddress: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);
  const { data, isLoading } = useGetAddressesQuery();

  const addresses = Array.isArray(data) ? data : [];
  const fallback = [
    {
      id: 1,
      location_name: 'Maison',
      address: 'Adresse principale',
      phone: '',
      latitude: 0,
      longitude: 0,
      zone_id: 1,
      type: 'maison',
      is_default: true,
    },
  ] as any[];

  const list = addresses.length ? addresses : fallback;

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Adresse d’intervention"
      subtitle="Choisissez où le professionnel doit intervenir."
      step="Étape 4 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={4} total={7} />
          <Button
            title="Continuer"
            rightIcon="arrowRight"
            disabled={!draft.addressId}
            onPress={() => navigation.navigate(ClientRoutes.CreateRequestAvailability as never)}
          />
        </View>
      }
    >
      {isLoading ? (
        <AppLoader label="Chargement des adresses..." />
      ) : (
        list.map((address) => (
          <SelectableCard
            key={address.id}
            title={address.location_name || 'Adresse'}
            subtitle={address.address}
            icon="location"
            selected={draft.addressId === address.id}
            onPress={() =>
              dispatch(
                setRequestAddress({
                  addressId: address.id,
                  addressLabel: address.location_name || address.address,
                }),
              )
            }
          />
        ))
      )}
    </ClientRequestLayout>
  );
};
