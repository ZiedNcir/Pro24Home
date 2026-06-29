import type {
  RegisterClientRequest,
  RegisterProfessionalRequest,
} from '../../store/api/api.types';

export const buildClientRegisterPayload = (
  input: RegisterClientRequest,
): RegisterClientRequest => ({
  ...input,
  lang: input.lang ?? 'fr',
});

export const buildProfessionalRegisterPayload = (
  input: RegisterProfessionalRequest,
): RegisterProfessionalRequest => ({
  ...input,
  lang: input.lang ?? 'fr',
  source: input.source ?? 'mobile',
});
