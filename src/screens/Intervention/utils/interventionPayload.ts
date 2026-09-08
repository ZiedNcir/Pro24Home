import type { CreateInterventionRequest } from '@store/api/api.types';
import type { InterventionPhoto } from '../components/new-intervention/types';

export interface InterventionPayloadInput {
    serviceId: number;
    addressId: number;
    problemTitle: string;
    problemDescription: string;
    description?: string;
    timing: 'asap' | 'schedule' | string;
    photos?: InterventionPhoto[];
}

export const buildInterventionPayload = ({
    serviceId,
    addressId,
    problemTitle,
    problemDescription,
    description,
    timing,
    photos = [],
}: InterventionPayloadInput): CreateInterventionRequest => {
    const interventionDescription = description?.trim() || problemDescription;
    const photoFields = photos.slice(0, 3).reduce<Record<string, unknown>>((fields, photo, index) => {
        fields[`image_${index + 1}`] = photo;
        return fields;
    }, {});

    return {
        service_id: serviceId,
        address_id: addressId,
        title: problemTitle,
        description: `${interventionDescription} Disponibilité : ${timing === 'schedule' ? 'date planifiée.' : 'dès que possible.'}`,
        price: 50,
        ...photoFields,
    } as CreateInterventionRequest;
};
