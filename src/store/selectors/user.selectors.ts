import type { RootState } from '../index';
import type { DocumentType } from '../api/api.types';

export const selectUserState = (state: RootState) => state.user;

export const selectUserProfile = (state: RootState) =>
  state.user.profile;

export const selectEffectiveProfile = (state: RootState) =>
  state.user.profile ?? state.auth.user;

export const selectUserDocuments = (state: RootState) =>
  state.user.documents.length > 0
    ? state.user.documents
    : state.auth.user?.documents ?? [];

export const selectUserVehicles = (state: RootState) =>
  state.user.vehicles.length > 0
    ? state.user.vehicles
    : state.auth.user?.vehicles ?? [];

export const selectUserAddresses = (state: RootState) =>
  state.user.addresses.length > 0
    ? state.user.addresses
    : state.auth.user?.address ?? [];

export const selectDefaultAddress = (state: RootState) => {
  const addresses = selectUserAddresses(state);
  return addresses.find((address) => address.is_default) ?? addresses[0] ?? null;
};

export const selectProfessionalVehicle = (state: RootState) => {
  const vehicles = selectUserVehicles(state);
  return vehicles[0] ?? null;
};

export const selectUserServices = (state: RootState) =>
  state.user.services;

export const selectSelectedServices = (state: RootState) =>
  state.user.selectedServices;

export const selectUserZones = (state: RootState) =>
  state.user.zones;

export const selectSelectedZone = (state: RootState) =>
  state.user.selectedZone;

export const selectFavoriteProfessionals = (state: RootState) =>
  state.user.favorites.professionals;

export const selectFavoriteAddresses = (state: RootState) =>
  state.user.favorites.addresses;

export const selectUserNotifications = (state: RootState) =>
  state.user.notifications;

export const selectUserPreferences = (state: RootState) =>
  state.user.preferences;

export const selectUserStats = (state: RootState) =>
  state.user.stats;

export const selectUserLoading = (state: RootState) =>
  state.user.isLoading;

export const selectUserError = (state: RootState) =>
  state.user.error;

export const selectApprovedDocuments = (state: RootState) =>
  selectUserDocuments(state).filter((document) => document.status === 'approved');

export const selectPendingDocuments = (state: RootState) =>
  selectUserDocuments(state).filter((document) => document.status === 'pending');

export const selectRejectedDocuments = (state: RootState) =>
  selectUserDocuments(state).filter((document) => document.status === 'rejected');

export const selectDocumentByType =
  (type: DocumentType) =>
  (state: RootState) =>
    selectUserDocuments(state).find((document) => document.name === type) ?? null;

export const selectHasApprovedDocument =
  (type: DocumentType) =>
  (state: RootState) =>
    selectUserDocuments(state).some(
      (document) => document.name === type && document.status === 'approved',
    );

export const selectHasRequiredProfessionalDocuments = (state: RootState) => {
  const required: DocumentType[] = ['identity_front', 'identity_back', 'kbis', 'rib'];

  return required.every((type) =>
    selectUserDocuments(state).some(
      (document) => document.name === type && document.status === 'approved',
    ),
  );
};
