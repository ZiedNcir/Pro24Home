import type { RootState } from '../index';
import {
  DevisStatus,
  InterventionStatus,
} from '../api/api.types';

export const selectInterventionState = (state: RootState) =>
  state.interventions;

export const selectInterventions = (state: RootState) =>
  state.interventions.interventions;

export const selectSelectedIntervention = (state: RootState) =>
  state.interventions.selectedIntervention;

export const selectInterventionDevis = (state: RootState) =>
  state.interventions.devis;

export const selectSelectedDevis = (state: RootState) =>
  state.interventions.selectedDevis;

export const selectInterventionReclamations = (state: RootState) =>
  state.interventions.reclamations;

export const selectSelectedReclamation = (state: RootState) =>
  state.interventions.selectedReclamation;

export const selectInterventionRatings = (state: RootState) =>
  state.interventions.ratings;

export const selectInterventionFilters = (state: RootState) =>
  state.interventions.filters;

export const selectInterventionPagination = (state: RootState) =>
  state.interventions.pagination;

export const selectMapView = (state: RootState) =>
  state.interventions.mapView;

export const selectCalendarView = (state: RootState) =>
  state.interventions.calendarView;

export const selectInterventionLoading = (state: RootState) =>
  state.interventions.isLoading;

export const selectInterventionCreating = (state: RootState) =>
  state.interventions.isCreating;

export const selectInterventionUpdating = (state: RootState) =>
  state.interventions.isUpdating;

export const selectInterventionDeleting = (state: RootState) =>
  state.interventions.isDeleting;

export const selectInterventionError = (state: RootState) =>
  state.interventions.error;

export const selectInterventionSuccessMessage = (state: RootState) =>
  state.interventions.successMessage;

export const selectInterventionById =
  (id: number) =>
  (state: RootState) =>
    state.interventions.interventions.find((intervention) => intervention.id === id) ?? null;

export const selectInterventionsByStatus =
  (status: InterventionStatus) =>
  (state: RootState) =>
    state.interventions.interventions.filter(
      (intervention) => intervention.status === status,
    );

export const selectPendingInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.PENDING)(state);

export const selectAcceptedInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.ACCEPTED)(state);

export const selectInProgressInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.IN_PROGRESS)(state);

export const selectCompletedInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.COMPLETED)(state);

export const selectCanceledInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.CANCELED)(state);

export const selectRejectedInterventions = (state: RootState) =>
  selectInterventionsByStatus(InterventionStatus.REJECTED)(state);

export const selectInterventionsByDate =
  (date: string) =>
  (state: RootState) =>
    state.interventions.calendarView.interventionsByDate[date] ?? [];

export const selectDevisByInterventionId =
  (interventionId: number) =>
  (state: RootState) =>
    state.interventions.devis.filter(
      (devis) => devis.intervention_id === interventionId,
    );

export const selectPendingDevis = (state: RootState) =>
  state.interventions.devis.filter(
    (devis) => devis.status === DevisStatus.PENDING,
  );

export const selectAcceptedDevis = (state: RootState) =>
  state.interventions.devis.filter(
    (devis) => devis.status === DevisStatus.ACCEPTED,
  );

export const selectActiveDevisForSelectedIntervention = (state: RootState) => {
  const selected = state.interventions.selectedIntervention;
  if (!selected) return null;

  return (
    state.interventions.devis.find(
      (devis) =>
        devis.intervention_id === selected.id &&
        devis.status === DevisStatus.PENDING,
    ) ??
    selected.devis?.find((devis) => devis.status === DevisStatus.PENDING) ??
    null
  );
};

export const selectFilteredInterventions = (state: RootState) => {
  const { interventions, filters } = state.interventions;

  return interventions
    .filter((intervention) => {
      if (filters.status !== 'all' && intervention.status !== filters.status) {
        return false;
      }

      if (filters.serviceId && intervention.service_id !== filters.serviceId) {
        return false;
      }

      if (filters.professionalId && intervention.professional_id !== filters.professionalId) {
        return false;
      }

      if (filters.clientId && intervention.client_id !== filters.clientId) {
        return false;
      }

      if (filters.minPrice !== null && intervention.price && intervention.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== null && intervention.price && intervention.price > filters.maxPrice) {
        return false;
      }

      if (filters.dateRange.start) {
        const interventionDate = new Date(intervention.created_at);
        const startDate = new Date(filters.dateRange.start);
        if (interventionDate < startDate) return false;
      }

      if (filters.dateRange.end) {
        const interventionDate = new Date(intervention.created_at);
        const endDate = new Date(filters.dateRange.end);
        if (interventionDate > endDate) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;

      switch (filters.sortBy) {
        case 'date':
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * order;
        case 'price':
          return ((a.price ?? 0) - (b.price ?? 0)) * order;
        case 'title':
          return a.title.localeCompare(b.title) * order;
        case 'status':
          return a.status.localeCompare(b.status) * order;
        default:
          return 0;
      }
    });
};
