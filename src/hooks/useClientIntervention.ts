import { useCallback } from 'react';

import {
  useAddInterventionMutation,
  useCancelInterventionMutation,
  useDeleteInterventionMutation,
  useAcceptDevisMutation,
  useReviseDevisMutation,
  useGetInterventionsQuery,
  useGetInterventionQuery,
  useGetInterventionPriceQuery,
  useGetInterventionDevisQuery,
} from '../store/api';

import {
  buildCreateInterventionPayload,
  CreateInterventionForm,
} from '../services/intervention';

export const useClientIntervention = () => {
  const [addInterventionMutation, addInterventionState] = useAddInterventionMutation();
  const [cancelInterventionMutation, cancelInterventionState] = useCancelInterventionMutation();
  const [deleteInterventionMutation, deleteInterventionState] = useDeleteInterventionMutation();
  const [acceptDevisMutation, acceptDevisState] = useAcceptDevisMutation();
  const [reviseDevisMutation, reviseDevisState] = useReviseDevisMutation();

  const createIntervention = useCallback(
    (form: CreateInterventionForm) =>
      addInterventionMutation(buildCreateInterventionPayload(form)).unwrap(),
    [addInterventionMutation],
  );

  const cancelIntervention = useCallback(
    (id: number) => cancelInterventionMutation(id).unwrap(),
    [cancelInterventionMutation],
  );

  const deleteIntervention = useCallback(
    (id: number) => deleteInterventionMutation(id).unwrap(),
    [deleteInterventionMutation],
  );

  const acceptDevis = useCallback(
    (id: number) => acceptDevisMutation(id).unwrap(),
    [acceptDevisMutation],
  );

  const reviseDevis = useCallback(
    (id: number) => reviseDevisMutation(id).unwrap(),
    [reviseDevisMutation],
  );

  return {
    createIntervention,
    cancelIntervention,
    deleteIntervention,
    acceptDevis,
    reviseDevis,

    addInterventionState,
    cancelInterventionState,
    deleteInterventionState,
    acceptDevisState,
    reviseDevisState,

    useGetInterventionsQuery,
    useGetInterventionQuery,
    useGetInterventionPriceQuery,
    useGetInterventionDevisQuery,
  };
};
