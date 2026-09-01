import type { CreateInterventionRequest } from '@store/api/api.types';

export interface InterventionPayloadInput {
    serviceId: number;
    addressId: number;
    problemTitle: string;
    problemDescription: string;
    timing: 'asap' | 'schedule' | string;
}

export const buildInterventionPayload = ({
    serviceId,
    addressId,
    problemTitle,
    problemDescription,
    timing,
}: InterventionPayloadInput): CreateInterventionRequest => ({
    service_id: serviceId,
    address_id: addressId,
    title: problemTitle,
    description: `${problemDescription} Disponibilité : ${timing === 'schedule' ? 'date planifiée.' : 'dès que possible.'}`,
    price: 50,
});
