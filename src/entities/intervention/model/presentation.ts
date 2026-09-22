import { InterventionStatus, type Intervention } from './types';
import { API_BASE_URL } from '@core/api/base-api';
import i18n from '@utils/i18n';

type InterventionAddressLike = Partial<NonNullable<Intervention['address']>> & {
    latitude?: number | string;
    longitude?: number | string;
};

const normalizeStatus = (status?: string) => status?.trim().toLowerCase().replace(/[\s-]+/g, '_');

export const shouldShowTrackingButton = (status?: string, isProfessional = false) => {
    const normalizedStatus = normalizeStatus(status);
    return isProfessional && ['accepted', 'in_progress'].includes(normalizedStatus || '');
};

export const shouldShowRatingPrompt = (status?: string, rating?: { rating?: number } | null, isProfessional = false) => (
    !isProfessional && normalizeStatus(status) === 'completed' && !rating
);

type InterventionWithApiAliases = {
    address?: InterventionAddressLike;
    adress?: InterventionAddressLike;
    images?: Array<{ url?: string | null } | string | null>;
    image_1?: string | null;
    image_2?: string | null;
    image_3?: string | null;
    devis?: Array<{ id?: number; price?: number | string | null }>;
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

type ProfessionalBriefIntervention = InterventionWithApiAliases & {
    client?: InterventionClientLike | null;
    title?: string;
    description?: string;
    service?: { name?: string | null } | null;
    price?: number | string | null;
};

export type ProfessionalInterventionBriefItem = {
    key: 'client' | 'location' | 'request' | 'price';
    label: string;
    primary: string;
    secondary?: string;
};

export type InterventionFilter = 'all' | 'active' | 'completed';

export const getInterventionListCopy = (isProfessional: boolean) => isProfessional
    ? { title: i18n.t('intervention.list.professionalTitle'), empty: i18n.t('intervention.list.professionalEmpty') }
    : { title: i18n.t('intervention.list.clientTitle'), empty: i18n.t('intervention.list.clientEmpty') };

export const getInterventionDetailCopy = (isProfessional: boolean) => isProfessional
    ? { title: i18n.t('intervention.detail.newTitle'), section: i18n.t('intervention.detail.requestDetails') }
    : { title: i18n.t('intervention.detail.detailTitle'), section: i18n.t('intervention.detail.request') };

export const getProfessionalEmptyStateCopy = () => ({
    heading: i18n.t('intervention.list.professionalEmptyHeading'),
    description: i18n.t('intervention.list.professionalEmptyDescription'),
    reassuranceTitle: i18n.t('intervention.list.stayAvailable'),
    reassuranceDescription: i18n.t('intervention.list.stayAvailableDescription'),
});

export const getInterventionAddress = (intervention: InterventionWithApiAliases) => (
    intervention.address || intervention.adress
);

export const formatInterventionPrice = (price?: number | string | null) => {
    if (price === null || price === undefined || price === '') return null;

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) return null;

    return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'EUR',
    }).format(numericPrice);
};

export const getInterventionPrice = (intervention: InterventionWithApiAliases & { price?: number | string | null }) => {
    const directPrice = formatInterventionPrice(intervention.price);
    if (directPrice) return directPrice;

    const devisPrice = intervention.devis?.find(devis => devis.price !== null && devis.price !== undefined && devis.price !== '')?.price;
    return formatInterventionPrice(devisPrice);
};

export const getInterventionDevis = (intervention: InterventionWithApiAliases) => (
    intervention.devis?.find(devis => devis.id !== undefined && formatInterventionPrice(devis.price)) || null
);

export const shouldShowClientDevisActions = (price: number | string | null | undefined, status?: string, devisId?: number) => (
    Boolean(formatInterventionPrice(price)) && normalizeStatus(status) === 'negotiation' && devisId !== undefined
);

export const isValidInterventionPriceInput = (value: string) => {
    const price = Number(value.trim().replace(',', '.'));
    return Number.isFinite(price) && price > 0;
};

export const shouldShowPriceProposal = (price: number | string | null | undefined, status?: string) => (
    !formatInterventionPrice(price) && ['pending', 'negotiation'].includes(normalizeStatus(status) || '')
);

export const getInterventionClientName = (client?: InterventionClientLike | null) => {
    const directName = client?.name?.trim();
    if (directName) return directName;

    const nestedName = [client?.client?.first_name, client?.client?.last_name].filter(Boolean).join(' ').trim();
    if (nestedName) return nestedName;

    return [client?.first_name, client?.last_name].filter(Boolean).join(' ').trim() || null;
};

export const getProfessionalInterventionBrief = (intervention: ProfessionalBriefIntervention): ProfessionalInterventionBriefItem[] => {
    const address = getInterventionAddress(intervention)?.address?.trim() || i18n.t('intervention.detail.addressLabel');
    const service = intervention.service?.name?.trim() || intervention.title?.trim() || i18n.t('intervention.creation.serviceType');
    const description = intervention.description?.trim() || i18n.t('intervention.detail.request');

    return [
        { key: 'client', label: i18n.t('intervention.detail.client'), primary: getInterventionClientName(intervention.client) || i18n.t('intervention.detail.clientUnknown') },
        { key: 'location', label: i18n.t('intervention.detail.addressLabel'), primary: address },
        { key: 'request', label: i18n.t('intervention.detail.requestDetails'), primary: service, secondary: description },
        { key: 'price', label: i18n.t('intervention.detail.amount'), primary: getInterventionPrice(intervention) || i18n.t('intervention.detail.priceToPropose') },
    ];
};

export const getInterventionImageUrls = (intervention: InterventionWithApiAliases) => {
    const relationImages = (intervention.images || []).map(image => (
        typeof image === 'string' ? image : image?.url
    ));
    const legacyImages = [intervention.image_1, intervention.image_2, intervention.image_3];

    return [...relationImages, ...legacyImages].filter((url, index, urls): url is string => (
        typeof url === 'string' && url.trim().length > 0 && urls.indexOf(url) === index
    )).map(url => {
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const path = url.replace(/^\/+/, '').replace(/^storage\//, '');
        return `${API_BASE_URL}/storage/${path}`;
    });
};

export const formatDistanceBetweenCoordinates = (
    fromLatitude?: number | string,
    fromLongitude?: number | string,
    toLatitude?: number | string,
    toLongitude?: number | string,
) => {
    const coordinates = [fromLatitude, fromLongitude, toLatitude, toLongitude].map(value => Number(value));
    if (coordinates.some(value => !Number.isFinite(value))) {
        return i18n.t('intervention.detail.distanceUnavailable');
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
        : `${(Math.round(kilometers * 10) / 10).toLocaleString(i18n.language)} km`;
};

const statusKeys: Record<InterventionStatus, string> = {
    [InterventionStatus.NEGOTIATION]: 'intervention.detail.statusNegotiation',
    [InterventionStatus.PENDING]: 'intervention.detail.statusPending',
    [InterventionStatus.ACCEPTED]: 'intervention.detail.statusAccepted',
    [InterventionStatus.IN_PROGRESS]: 'intervention.detail.statusInProgress',
    [InterventionStatus.COMPLETED]: 'intervention.detail.statusCompleted',
    [InterventionStatus.REJECTED]: 'intervention.detail.statusRejected',
    [InterventionStatus.CANCELLED]: 'intervention.detail.statusCancelled',
    [InterventionStatus.CANCELED]: 'intervention.detail.statusCancelled',
};

export const getInterventionStatusLabel = (status: InterventionStatus | string): string => {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'in_progress') return i18n.t('intervention.detail.statusInProgress');
    const key = statusKeys[status as InterventionStatus];
    return key ? i18n.t(key) : i18n.t('intervention.detail.statusUnknown');
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
