import type {
  Intervention,
  InterventionStatus,
} from '../store/api/api.types';

export interface RequestSummaryViewModel {
  categoryTitle: string;
  categoryIcon: any;
  problemType: string;
  description?: string;
  addressLabel: string;
  photoCount: number;
}

export interface TrackingViewModel {
  professionalName: string;
  professionalJob?: string;
  eta: string;
  distance?: string;
  rating?: number;
  addressLabel?: string;
}

export const interventionStatusLabel: Record<InterventionStatus, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  'in progress': 'En cours',
  completed: 'Terminée',
  rejected: 'Refusée',
  canceled: 'Annulée',
};

export const interventionToRequestSummary = (
  intervention: Intervention,
): RequestSummaryViewModel => ({
  categoryTitle: intervention.service?.name ?? 'Intervention',
  categoryIcon: 'tools',
  problemType: intervention.sub_service?.name ?? intervention.title,
  description: intervention.description,
  addressLabel: intervention.address?.location_name ?? intervention.address?.address ?? '',
  photoCount: intervention.images?.length ?? 0,
});

export const interventionToTracking = (
  intervention: Intervention,
): TrackingViewModel | null => {
  if (!intervention.professional) return null;

  return {
    professionalName: `${intervention.professional.first_name} ${intervention.professional.last_name}`.trim(),
    professionalJob: intervention.professional.company_name,
    eta: '—',
    distance: '—',
    addressLabel: intervention.address?.location_name ?? intervention.address?.address,
  };
};
