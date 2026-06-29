import {
  useUploadDocumentMutation,
  useUpdateVehicleMutation,
  useUpdateProProfileMutation,
  useUpdateZoneMutation,
  useUpdateNotificationsMutation,
  useDownloadDocumentQuery,
  useLazyDownloadDocumentQuery,
} from '../store/api';

export const useProfessionalProfile = () => {
  const [uploadDocument, uploadDocumentState] = useUploadDocumentMutation();
  const [updateVehicle, updateVehicleState] = useUpdateVehicleMutation();
  const [updateProfile, updateProfileState] = useUpdateProProfileMutation();
  const [updateZone, updateZoneState] = useUpdateZoneMutation();
  const [updateNotifications, updateNotificationsState] = useUpdateNotificationsMutation();

  return {
    uploadDocument,
    updateVehicle,
    updateProfile,
    updateZone,
    updateNotifications,

    uploadDocumentState,
    updateVehicleState,
    updateProfileState,
    updateZoneState,
    updateNotificationsState,

    useDownloadDocumentQuery,
    useLazyDownloadDocumentQuery,
  };
};
