import { useMemo } from 'react';

import { useGetServicesQuery } from '../store/api';
import { serviceToCategoryCard } from '../adapters';

export const useServicesCatalog = (lang = 'fr') => {
  const query = useGetServicesQuery({ lang });

  const categories = useMemo(
    () => (query.data?.data ?? []).map(serviceToCategoryCard),
    [query.data],
  );

  return {
    ...query,
    services: query.data?.data ?? [],
    categories,
  };
};
