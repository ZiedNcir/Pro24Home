import type { IconName } from '../design-system';
import type { Service } from '../store/api/api.types';

export interface CategoryCardViewModel {
  title: string;
  subtitle?: string;
  icon: IconName;
}

const serviceIconMap: Record<string, IconName> = {
  plomberie: 'plumbing',
  plumbing: 'plumbing',
  serrurerie: 'locksmith',
  locksmith: 'locksmith',
  electricite: 'electricity',
  électricité: 'electricity',
  electricity: 'electricity',
  climatisation: 'airConditioning',
  air: 'airConditioning',
};

export const serviceToCategoryCard = (service: Service): CategoryCardViewModel => {
  const key = service.name.toLowerCase();

  const icon =
    serviceIconMap[key] ??
    Object.entries(serviceIconMap).find(([name]) => key.includes(name))?.[1] ??
    'tools';

  return {
    title: service.name,
    subtitle: service.description,
    icon,
  };
};
