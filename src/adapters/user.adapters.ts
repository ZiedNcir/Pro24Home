import type {
  Address,
  ClientInfo,
  ProfessionalInfo,
  User,
  Vehicle,
} from '../store/api/api.types';

export type UserRoleLabel = 'Particulier' | 'Professionnel';

export const getUserDisplayName = (user?: User | null): string => {
  if (!user) return '';

  if (user.name) return user.name;

  if (user.client) {
    return `${user.client.first_name} ${user.client.last_name}`.trim();
  }

  if (user.professional) {
    return `${user.professional.first_name} ${user.professional.last_name}`.trim();
  }

  return user.email;
};

export const getClientDisplayName = (client?: ClientInfo | null): string =>
  client ? `${client.first_name} ${client.last_name}`.trim() : '';

export const getProfessionalDisplayName = (
  professional?: ProfessionalInfo | null,
): string =>
  professional
    ? `${professional.first_name} ${professional.last_name}`.trim()
    : '';

export const getUserRoleLabel = (user?: User | null): UserRoleLabel | '' => {
  if (!user) return '';
  return user.type === 'professional' ? 'Professionnel' : 'Particulier';
};

export const addressToLabel = (address?: Address | null): string => {
  if (!address) return '';
  return [address.location_name, address.address, address.floor]
    .filter(Boolean)
    .join(' • ');
};

export const vehicleToLabel = (vehicle?: Vehicle | null): string => {
  if (!vehicle) return '';
  return [vehicle.name, vehicle.model, vehicle.year]
    .filter(Boolean)
    .join(' • ');
};
