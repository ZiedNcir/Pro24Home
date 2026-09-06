import { InterventionStatus, type Intervention } from '@store/api/api.types';

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

export const formatDistanceBetweenCoordinates = (
    fromLatitude?: number,
    fromLongitude?: number,
    toLatitude?: number,
    toLongitude?: number,
) => {
    if ([fromLatitude, fromLongitude, toLatitude, toLongitude].some(value => typeof value !== 'number')) {
        return 'Distance indisponible';
    }

    const toRadians = (value: number) => (value * Math.PI) / 180;
    const latitudeDelta = toRadians(toLatitude! - fromLatitude!);
    const longitudeDelta = toRadians(toLongitude! - fromLongitude!);
    const latitudeA = toRadians(fromLatitude!);
    const latitudeB = toRadians(toLatitude!);
    const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;
    const kilometers = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return kilometers < 1
        ? `${Math.round(kilometers * 1000)} m`
        : `${(Math.round(kilometers * 10) / 10).toLocaleString('fr-FR')} km`;
};

const labels: Record<InterventionStatus, string> = {
    [InterventionStatus.PENDING]: 'En attente',
    [InterventionStatus.ACCEPTED]: 'Acceptée',
    [InterventionStatus.IN_PROGRESS]: 'En cours',
    [InterventionStatus.COMPLETED]: 'Terminée',
    [InterventionStatus.REJECTED]: 'Refusée',
    [InterventionStatus.CANCELED]: 'Annulée',
};

export const getInterventionStatusLabel = (status: InterventionStatus): string => labels[status] || 'Inconnue';

export const filterInterventions = (interventions: Intervention[], filter: InterventionFilter): Intervention[] => {
    if (filter === 'completed') return interventions.filter(item => item.status === InterventionStatus.COMPLETED);
    if (filter === 'active') return interventions.filter(item => item.status !== InterventionStatus.COMPLETED && item.status !== InterventionStatus.CANCELED);
    return interventions;
};

export const getInterventionStatusColor = (status: InterventionStatus): string => {
    if (status === InterventionStatus.COMPLETED) return '#DDF5E5';
    if (status === InterventionStatus.CANCELED || status === InterventionStatus.REJECTED) return '#FDE6E3';
    return '#DDF5E5';
};
