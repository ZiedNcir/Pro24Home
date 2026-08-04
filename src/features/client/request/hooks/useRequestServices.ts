import { useMemo } from 'react';

import { Service, useGetServicesQuery } from '../../../../store/api';
import type { IconName } from '../../../../design-system';

const serviceIconMap: Record<string, IconName> = {
  plomberie: 'plumbing',
  plombier: 'plumbing',
  electricite: 'electricity',
  électricité: 'electricity',
  electricien: 'electricity',
  peinture: 'tools',
  peintre: 'tools',
  serrurerie: 'locksmith',
  serrurier: 'locksmith',
  climatisation: 'airConditioning',
};

const normalize = (value?: string) =>
  (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const getServiceIcon = (service?: Pick<Service, 'name'>): IconName => {
  const name = normalize(service?.name);
  const key = Object.keys(serviceIconMap).find((item) =>
    name.includes(normalize(item)),
  );

  return key ? serviceIconMap[key] : 'tools';
};

export const useRequestServices = () => {
  const query = useGetServicesQuery({ lang: 'fr' });

  const services = useMemo(() => {
    const data = query.data as any;
    if (Array.isArray(data)) return data as Service[];
    if (Array.isArray(data?.data)) return data.data as Service[];
    return [];
  }, [query.data]);

  return {
    ...query,
    services,
  };
};
