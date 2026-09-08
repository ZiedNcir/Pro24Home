import { InterventionStatus, type Intervention } from '@store/api/api.types';

type InterventionAddressLike = Partial<NonNullable<Intervention['address']>> & {
    latitude?: number | string;
    longitude?: number | string;
};

type InterventionWithApiAliases = {
    address?: InterventionAddressLike;
    adress?: InterventionAddressLike;
    images?: Array<{ url?: string | null } | string | null>;
    image_1?: string | null;
    image_2?: string | null;
    image_3?: string | null;
};

type InterventionClientLike = {
    name?: string;
    first_name?: string;
    last_name?: string;
    client?: {
        first_name?: string;
        last_name?: string;
    };
};

export type InterventionFilter = 'all' | 'active' | 'completed';

export const getInterventionListCopy = (isProfessional: boolean) => isProfessional
    ? { title: 'Demandes d’intervention', empty: 'Aucune demande d’intervention pour le moment.' }
    : { title: 'Mes interventions', empty: 'Vous n’avez pas encore d’intervention.' };

export const getInterventionDetailCopy = (isProfessional: boolean) => isProfessional
    ? { title: 'Demande d’intervention', section: 'Détails de la demande' }
    : { title: 'Détail de l’intervention', section: 'Votre demande' };

export const getProfessionalEmptyStateCopy = () => ({
    heading: 'Aucune demande pour le moment',
    description: 'Les nouvelles demandes apparaîtront ici dès qu’un client fera appel à vous.',
    reassuranceTitle: 'Restez disponible pour recevoir des demandes',
    reassuranceDescription: 'Activez vos disponibilités et vos zones d’intervention pour ne manquer aucune opportunité.',
});

export const getInterventionAddress = (intervention: InterventionWithApiAliases) => (
    intervention.address || intervention.adress
);

export const formatInterventionPrice = (price?: number | string | null) => {
    if (price === null || price === undefined || price === '') return null;

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) return null;

    return `${numericPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
};

export const getInterventionClientName = (client?: InterventionClientLike | null) => {
    const directName = client?.name?.trim();
    if (directName) return directName;

    const nestedName = [client?.client?.first_name, client?.client?.last_name].filter(Boolean).join(' ').trim();
    if (nestedName) return nestedName;

    return [client?.first_name, client?.last_name].filter(Boolean).join(' ').trim() || null;
};

export const getInterventionImageUrls = (intervention: InterventionWithApiAliases) => {
    const relationImages = (intervention.images || []).map(image => (
        typeof image === 'string' ? image : image?.url
    ));
    const legacyImages = [intervention.image_1, intervention.image_2, intervention.image_3];

    return [...relationImages, ...legacyImages].filter((url, index, urls): url is string => (
        typeof url === 'string' && url.trim().length > 0 && urls.indexOf(url) === index
    ));
};

export const formatDistanceBetweenCoordinates = (
    fromLatitude?: number | string,
    fromLongitude?: number | string,
    toLatitude?: number | string,
    toLongitude?: number | string,
) => {
    const coordinates = [fromLatitude, fromLongitude, toLatitude, toLongitude].map(value => Number(value));
    if (coordinates.some(value => !Number.isFinite(value))) {
        return 'Distance indisponible';
    }

    const toRadians = (value: number) => (value * Math.PI) / 180;
    const [safeFromLatitude, safeFromLongitude, safeToLatitude, safeToLongitude] = coordinates as [number, number, number, number];
    const latitudeDelta = toRadians(safeToLatitude - safeFromLatitude);
    const longitudeDelta = toRadians(safeToLongitude - safeFromLongitude);
    const latitudeA = toRadians(safeFromLatitude);
    const latitudeB = toRadians(safeToLatitude);
    const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
    const kilometers = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return kilometers < 1
        ? `${Math.round(kilometers * 1000)} m`
        : `${(Math.round(kilometers * 10) / 10).toLocaleString('fr-FR')} km`;
};

const labels: Record<InterventionStatus, string> = {
    [InterventionStatus.NEGOTIATION]: 'Négociation',
    [InterventionStatus.PENDING]: 'En attente',
    [InterventionStatus.ACCEPTED]: 'Acceptée',
    [InterventionStatus.IN_PROGRESS]: 'En cours',
    [InterventionStatus.COMPLETED]: 'Terminée',
    [InterventionStatus.REJECTED]: 'Refusée',
    [InterventionStatus.CANCELLED]: 'Annulée',
    [InterventionStatus.CANCELED]: 'Annulée',
};

const normalizeStatus = (status?: string) => status?.trim().toLowerCase().replace(/[\s-]+/g, '_');

export const getInterventionStatusLabel = (status: InterventionStatus | string): string => {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'in_progress') return 'En cours';
    return labels[status as InterventionStatus] || 'Inconnue';
};

export const filterInterventions = (interventions: Intervention[], filter: InterventionFilter): Intervention[] => {
    const finishedStatuses = ['completed', 'canceled', 'cancelled', 'rejected'];
    const activeStatuses = ['negotiation', 'pending', 'accepted', 'in_progress'];
    if (filter === 'completed') return interventions.filter(item => finishedStatuses.includes(normalizeStatus(item.status) || ''));
    if (filter === 'active') return interventions.filter(item => activeStatuses.includes(normalizeStatus(item.status) || ''));
    return interventions;
};

export const getInterventionStatusColor = (status: InterventionStatus | string): string => {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'completed') return '#DDF5E5';
    if (['canceled', 'cancelled', 'rejected'].includes(normalizedStatus || '')) return '#FDE6E3';
    if (normalizedStatus === 'negotiation') return '#FFF0D6';
    return '#DDF5E5';
};
