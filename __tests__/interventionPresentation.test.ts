import { InterventionStatus } from '../src/store/api/api.types';
import { filterInterventions, formatDistanceBetweenCoordinates, formatInterventionPrice, getInterventionAddress, getInterventionDetailCopy, getInterventionListCopy, getProfessionalEmptyStateCopy, getInterventionStatusLabel } from '../src/screens/Intervention/utils/interventionPresentation';

describe('interventionPresentation', () => {
    it('maps API statuses to French labels', () => {
        expect(getInterventionStatusLabel(InterventionStatus.IN_PROGRESS)).toBe('En cours');
        expect(getInterventionStatusLabel(InterventionStatus.COMPLETED)).toBe('Terminée');
    });

    it('filters all, active and completed interventions', () => {
        const interventions = [
            { status: InterventionStatus.PENDING },
            { status: InterventionStatus.IN_PROGRESS },
            { status: InterventionStatus.COMPLETED },
        ] as any;

        expect(filterInterventions(interventions, 'all')).toHaveLength(3);
        expect(filterInterventions(interventions, 'active')).toHaveLength(2);
        expect(filterInterventions(interventions, 'completed')).toHaveLength(1);
    });

    it('uses received-intervention copy for professionals', () => {
        expect(getInterventionListCopy(true)).toEqual({
            title: 'Demandes d’intervention',
            empty: 'Aucune demande d’intervention pour le moment.',
        });
    });

    it('uses request copy for professional intervention details', () => {
        expect(getInterventionDetailCopy(true)).toEqual({ title: 'Demande d’intervention', section: 'Détails de la demande' });
    });

    it('provides reassuring content for the professional empty state', () => {
        expect(getProfessionalEmptyStateCopy()).toEqual({
            heading: 'Aucune demande pour le moment',
            description: 'Les nouvelles demandes apparaîtront ici dès qu’un client fera appel à vous.',
            reassuranceTitle: 'Restez disponible pour recevoir des demandes',
            reassuranceDescription: 'Activez vos disponibilités et vos zones d’intervention pour ne manquer aucune opportunité.',
        });
    });

    it('formats the distance between professional and intervention coordinates', () => {
        expect(formatDistanceBetweenCoordinates(48.8566, 2.3522, 48.8666, 2.3522)).toBe('1,1 km');
        expect(formatDistanceBetweenCoordinates(undefined, 2.35, 48.86, 2.35)).toBe('Distance indisponible');
    });

    it('reads raw API address and price aliases safely', () => {
        const intervention = { adress: { address: 'De eljem', latitude: '35.30', longitude: '10.71' }, price: '20.00' } as any;

        expect(getInterventionAddress(intervention)?.address).toBe('De eljem');
        expect(formatInterventionPrice(intervention.price)).toBe('20,00 €');
    });
});
