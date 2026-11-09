import type { CreateInterventionRequest } from '@entities/intervention/model';
import type { InterventionPhoto } from '../ui/new-intervention/types';
import i18n from '@utils/i18n';

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
        description: `${interventionDescription} ${i18n.t('intervention.creation.availabilityPrefix')} ${i18n.t(timing === 'schedule' ? 'intervention.creation.datePlanned' : 'intervention.creation.asSoonAsPossible')}`,
        price: 50,
        ...photoFields,
    } as CreateInterventionRequest;
};

// The picker cache can be deleted by the OS. Data URIs survive in the saved payload
// and are supported by React Native image rendering and native multipart uploads.
export const createPersistentInterventionPhoto = (asset: {
    base64?: string;
    type?: string;
    fileName?: string;
}): InterventionPhoto => {
    // Three attachments stay below Android AsyncStorage's per-row size limit.
    if (!asset.base64 || asset.base64.length > 500_000) throw new Error('Photo cannot be saved');
    const type = asset.type || 'image/jpeg';
    return { uri: `data:${type};base64,${asset.base64}`, type, name: asset.fileName || `intervention-photo-${Date.now()}.jpg` };
};
