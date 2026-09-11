import { InterventionStatus } from '../src/store/api/api.types';
import { filterInterventions, formatDistanceBetweenCoordinates, formatInterventionPrice, getInterventionAddress, getInterventionClientName, getInterventionDetailCopy, getInterventionImageUrls, getInterventionListCopy, getProfessionalEmptyStateCopy, getInterventionStatusLabel, shouldShowTrackingButton } from '../src/screens/Intervention/utils/interventionPresentation';

describe('interventionPresentation', () => {
    it('shows tracking for accepted and in-progress professional interventions', () => {
        expect(shouldShowTrackingButton('accepted', true)).toBe(true);
        expect(shouldShowTrackingButton('in_progress', true)).toBe(true);
        expect(shouldShowTrackingButton('in progress', true)).toBe(true);
        expect(shouldShowTrackingButton('pending', true)).toBe(false);
        expect(shouldShowTrackingButton('accepted', false)).toBe(false);
    });
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

    it('supports API status variants for in-progress and completed interventions', () => {
        const interventions = [
            { status: 'in_progress' },
            { status: 'in progress' },
            { status: 'completed' },
        ] as any;

        expect(filterInterventions(interventions, 'active')).toHaveLength(2);
        expect(filterInterventions(interventions, 'completed')).toHaveLength(1);
        expect(getInterventionStatusLabel('in_progress' as any)).toBe('En cours');
    });

    it('supports negotiation and both cancelled status spellings', () => {
        expect(getInterventionStatusLabel('negotiation' as any)).toBe('Négociation');
        expect(getInterventionStatusLabel('cancelled' as any)).toBe('Annulée');
        expect(getInterventionStatusLabel('canceled' as any)).toBe('Annulée');
        expect(filterInterventions([{ status: 'negotiation' }, { status: 'cancelled' }, { status: 'rejected' }, { status: 'completed' }] as any, 'active')).toHaveLength(1);
        expect(filterInterventions([{ status: 'negotiation' }, { status: 'cancelled' }, { status: 'rejected' }, { status: 'completed' }] as any, 'completed')).toHaveLength(3);
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
        expect(formatDistanceBetweenCoordinates('48.8566', '2.3522', '48.8666', '2.3522')).toBe('1,1 km');
        expect(formatDistanceBetweenCoordinates(undefined, 2.35, 48.86, 2.35)).toBe('Distance indisponible');
    });

    it('reads raw API address and price aliases safely', () => {
        const intervention = { adress: { address: 'De eljem', latitude: '35.30', longitude: '10.71' }, price: '20.00' } as any;

        expect(getInterventionAddress(intervention)?.address).toBe('De eljem');
        expect(formatInterventionPrice(intervention.price)).toBe('20,00 €');
    });

    it('resolves the professional-facing client name from supported API shapes', () => {
        expect(getInterventionClientName({ name: 'Zied Ncir' })).toBe('Zied Ncir');
        expect(getInterventionClientName({ client: { first_name: 'Zied', last_name: 'Ncir' } })).toBe('Zied Ncir');
        expect(getInterventionClientName(null)).toBeNull();
    });

    it('collects legacy and relation image URLs without duplicates or empty values', () => {
        expect(getInterventionImageUrls({
            images: [{ url: 'photo-1.jpg' }, null, 'photo-2.jpg'],
            image_1: 'photo-1.jpg',
            image_2: 'photo-3.jpg',
            image_3: null,
        })).toEqual(['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg']);
    });
});
