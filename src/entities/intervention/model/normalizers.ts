import type { Address } from '../../address/model/types';
import type { Intervention } from './types';

type BackendIntervention = Partial<Intervention> & {
    adresse_id?: number;
    adress?: Partial<Address> & { latitude?: number | string; longitude?: number | string };
    price?: number | string | null;
};

export const normalizeInterventionResponse = (response: unknown): Intervention => {
    const payload = response && typeof response === 'object' ? response as { intervention?: BackendIntervention; data?: BackendIntervention | { intervention?: BackendIntervention } } : {};
    const data = payload.intervention || (payload.data && 'intervention' in payload.data ? payload.data.intervention : payload.data) || response;
    const raw = (data || {}) as BackendIntervention;
    const rawAddress = raw.address || raw.adress;
    const toNumber = (value?: number | string) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : undefined;
    };
    const address = rawAddress ? {
        ...rawAddress,
        latitude: toNumber(rawAddress.latitude),
        longitude: toNumber(rawAddress.longitude),
    } as Address : undefined;

    return {
        ...raw,
        address_id: raw.address_id ?? raw.adresse_id ?? 0,
        price: raw.price === null || raw.price === undefined ? raw.price : Number(raw.price),
        address,
        images: raw.images || [],
    } as Intervention;
};
