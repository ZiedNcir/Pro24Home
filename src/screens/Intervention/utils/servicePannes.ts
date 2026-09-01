import { Service } from '@store/api/api.types';

export type PanneChoice = {
    id: number;
    title: string;
    description: string;
};

export const getServicePannes = (service?: Service | null): PanneChoice[] =>
    (service?.children || []).map(child => ({
        id: child.id,
        title: child.name,
        description: child.price_range || '',
    }));
