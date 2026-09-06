import { InterventionStatus, type Intervention } from '@store/api/api.types';

export type InterventionFilter = 'all' | 'active' | 'completed';

export const getInterventionListCopy = (isProfessional: boolean) => isProfessional
    ? { title: 'Demandes d’intervention', empty: 'Aucune demande d’intervention pour le moment.' }
    : { title: 'Mes interventions', empty: 'Vous n’avez pas encore d’intervention.' };

export const getInterventionDetailCopy = (isProfessional: boolean) => isProfessional
    ? { title: 'Demande d’intervention', section: 'Détails de la demande' }
    : { title: 'Détail de l’intervention', section: 'Votre demande' };

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
