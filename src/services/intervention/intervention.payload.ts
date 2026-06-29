import type { CreateInterventionRequest } from '../../store/api/api.types';

export interface CreateInterventionForm {
  service_id: number;
  address_id: number;
  title: string;
  description: string;
  price?: number;
  images?: any[];
}

export const buildCreateInterventionPayload = (
  form: CreateInterventionForm,
): CreateInterventionRequest => ({
  service_id: form.service_id,
  address_id: form.address_id,
  title: form.title,
  description: form.description,
  price: form.price,
  image_1: form.images?.[0],
  image_2: form.images?.[1],
  image_3: form.images?.[2],
});
