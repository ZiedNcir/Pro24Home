import { useMemo } from 'react';

import {
  Intervention,
  InterventionStatus,
  Service,
  useGetInterventionsQuery,
  useGetServicesQuery,
} from '../../../../store/api';
import { useAppSelector } from '../../../../store/hooks';
import { selectEffectiveProfile } from '../../../../store/selectors';
import type { IconName } from '../../../../design-system';

export interface ClientHomeCategory {
  id: number;
  label: string;
  icon: IconName;
}

export interface ClientHomeRequest {
  id: number;
  title: string;
  reference: string;
  date: string;
  status: string;
}

const DEFAULT_CATEGORIES: ClientHomeCategory[] = [
  { id: 1, label: 'Plomberie', icon: 'plumbing' },
  { id: 2, label: 'Électricité', icon: 'electricity' },
  { id: 3, label: 'Peinture', icon: 'tools' },
  { id: 0, label: 'Autres', icon: 'plus' },
];

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (Array.isArray((value as any)?.data)) return (value as any).data as T[];
  return [];
};

const normalize = (value?: string) =>
  (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const getIcon = (service: Service): IconName => {
  const name = normalize(service.name);
  if (name.includes('plomb')) return 'plumbing';
  if (name.includes('elect')) return 'electricity';
  if (name.includes('serr')) return 'locksmith';
  if (name.includes('clim')) return 'airConditioning';
  return 'tools';
};

const statusLabel = (status: string) => {
  switch (status) {
    case InterventionStatus.COMPLETED:
      return 'Terminée';
    case InterventionStatus.IN_PROGRESS:
      return 'En cours';
    case InterventionStatus.ACCEPTED:
      return 'Acceptée';
    case InterventionStatus.PENDING:
      return 'En attente';
    default:
      return status;
  }
};

const activeStatuses = [
  InterventionStatus.ACCEPTED,
  InterventionStatus.IN_PROGRESS,
  InterventionStatus.PENDING,
];

export const useClientHomeData = () => {
  const user = useAppSelector(selectEffectiveProfile);
  const servicesQuery = useGetServicesQuery({ lang: 'fr' });
  const interventionsQuery = useGetInterventionsQuery({
    page: 1,
    per_page: 10,
    type: 'client',
  });

  const services = asArray<Service>(servicesQuery.data);
  const interventions = asArray<Intervention>(interventionsQuery.data);

  const categories = useMemo(() => {
    if (!services.length) return DEFAULT_CATEGORIES;

    const mapped = services.slice(0, 4).map((service) => ({
      id: service.id,
      label: service.name,
      icon: getIcon(service),
    }));

    return mapped.length < 4
      ? [...mapped, ...DEFAULT_CATEGORIES.slice(mapped.length, 4)]
      : mapped;
  }, [services]);

  const activeIntervention =
    interventions.find((item) => activeStatuses.includes(item.status)) ?? null;

  const recentRequests = interventions.map((item) => ({
    id: item.id,
    title: item.title,
    reference: `#REQ-${String(item.id).padStart(6, '0')}`,
    date: item.created_at,
    status: statusLabel(item.status),
  }));

  const firstName =
    (user as any)?.client?.first_name ||
    (user as any)?.first_name ||
    (user as any)?.name?.split(' ')?.[0] ||
    'Fatima';

  return {
    firstName,
    categories,
    interventions,
    activeIntervention,
    recentRequests,
    isEmpty: !interventions.length,
    isLoading: servicesQuery.isLoading || interventionsQuery.isLoading,
    isFetching: servicesQuery.isFetching || interventionsQuery.isFetching,
    refetch: () => {
      servicesQuery.refetch();
      interventionsQuery.refetch();
    },
  };
};
