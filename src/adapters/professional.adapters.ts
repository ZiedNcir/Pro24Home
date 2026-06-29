import type { Professional, ProfessionalInfo } from '../store/api/api.types';

export interface ProfessionalCardViewModel {
  name: string;
  job?: string;
  eta?: string;
  distance?: string;
  rating?: number;
  verified?: boolean;
}

export const professionalInfoToCard = (
  professional?: ProfessionalInfo | null,
  meta?: {
    eta?: string;
    distance?: string;
    rating?: number;
  },
): ProfessionalCardViewModel | null => {
  if (!professional) return null;

  return {
    name: `${professional.first_name} ${professional.last_name}`.trim(),
    job: professional.company_name,
    eta: meta?.eta,
    distance: meta?.distance,
    rating: meta?.rating,
    verified: professional.online_status,
  };
};

export const professionalToCard = (
  professional?: Professional | null,
  meta?: {
    eta?: string;
    distance?: string;
    rating?: number;
  },
): ProfessionalCardViewModel | null => {
  if (!professional) return null;

  return {
    name: `${professional.first_name} ${professional.last_name}`.trim(),
    job: professional.company_name,
    eta: meta?.eta,
    distance: meta?.distance,
    rating: meta?.rating,
    verified: professional.online_status,
  };
};
