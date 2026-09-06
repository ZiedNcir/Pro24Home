import { InterventionStatus } from '../src/store/api/api.types';
import { filterInterventions, getInterventionDetailCopy, getInterventionListCopy, getProfessionalEmptyStateCopy, getInterventionStatusLabel } from '../src/screens/Intervention/utils/interventionPresentation';

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
});
