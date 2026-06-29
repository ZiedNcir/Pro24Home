import {
  useAddClientReclamationMutation,
  useAddProfessionalReclamationMutation,
  useGetClientReclamationsQuery,
  useGetProfessionalReclamationsQuery,
  useUpdateClientReclamationMutation,
  useUpdateProfessionalReclamationMutation,
  useDeleteClientReclamationMutation,
  useDeleteProfessionalReclamationMutation,
} from '../store/api';

export const useReclamations = () => {
  const [addClientReclamation, addClientReclamationState] = useAddClientReclamationMutation();
  const [addProfessionalReclamation, addProfessionalReclamationState] = useAddProfessionalReclamationMutation();
  const [updateClientReclamation, updateClientReclamationState] = useUpdateClientReclamationMutation();
  const [updateProfessionalReclamation, updateProfessionalReclamationState] = useUpdateProfessionalReclamationMutation();
  const [deleteClientReclamation, deleteClientReclamationState] = useDeleteClientReclamationMutation();
  const [deleteProfessionalReclamation, deleteProfessionalReclamationState] = useDeleteProfessionalReclamationMutation();

  return {
    addClientReclamation,
    addProfessionalReclamation,
    updateClientReclamation,
    updateProfessionalReclamation,
    deleteClientReclamation,
    deleteProfessionalReclamation,

    addClientReclamationState,
    addProfessionalReclamationState,
    updateClientReclamationState,
    updateProfessionalReclamationState,
    deleteClientReclamationState,
    deleteProfessionalReclamationState,

    useGetClientReclamationsQuery,
    useGetProfessionalReclamationsQuery,
  };
};
