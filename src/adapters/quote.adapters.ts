import type { Devis } from '../store/api/api.types';

export interface QuoteViewModel {
  professionalName: string;
  professionalJob?: string;
  price: string;
  description?: string;
}

export const devisToQuoteViewModel = (devis: Devis): QuoteViewModel => ({
  professionalName: devis.professional
    ? `${devis.professional.first_name} ${devis.professional.last_name}`.trim()
    : 'Professionnel Pro24Home',
  professionalJob: devis.professional?.company_name,
  price: `${Number(devis.price).toFixed(0)} €`,
  description: devis.notes,
});
