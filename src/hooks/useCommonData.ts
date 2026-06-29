import {
  useGetZonesQuery,
  useGetAppConfigQuery,
  useUploadFileMutation,
} from '../store/api';

export const useCommonData = () => {
  const zonesQuery = useGetZonesQuery();
  const appConfigQuery = useGetAppConfigQuery();
  const [uploadFile, uploadFileState] = useUploadFileMutation();

  return {
    zones: zonesQuery.data ?? [],
    zonesQuery,
    appConfig: appConfigQuery.data,
    appConfigQuery,
    uploadFile,
    uploadFileState,
  };
};
