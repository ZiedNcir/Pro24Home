import { useCallback } from 'react';

import {
  useAcceptInterventionMutation,
  useReviseInterventionMutation,
  useAddDevisMutation,
  useUpdateInterventionStatusMutation,
  useUpdateStatusMutation,
  useToggleOnlineStatusMutation,
} from '../store/api';

export const useProfessionalIntervention = () => {
  const [acceptInterventionMutation, acceptInterventionState] = useAcceptInterventionMutation();
  const [reviseInterventionMutation, reviseInterventionState] = useReviseInterventionMutation();
  const [addDevisMutation, addDevisState] = useAddDevisMutation();
  const [updateInterventionStatusMutation, updateInterventionStatusState] = useUpdateInterventionStatusMutation();
  const [updateStatusMutation, updateStatusState] = useUpdateStatusMutation();
  const [toggleOnlineStatusMutation, toggleOnlineStatusState] = useToggleOnlineStatusMutation();

  const acceptIntervention = useCallback(
    (id: number) => acceptInterventionMutation(id).unwrap(),
    [acceptInterventionMutation],
  );

  const reviseIntervention = useCallback(
    (id: number) => reviseInterventionMutation(id).unwrap(),
    [reviseInterventionMutation],
  );

  const sendDevis = useCallback(
    (interventionId: number, price: number) =>
      addDevisMutation({ interventionId, price }).unwrap(),
    [addDevisMutation],
  );

  const updateInterventionStatus = useCallback(
    (payload: { interventionId: number; status: 'in progress' | 'rejected' | 'completed' }) =>
      updateInterventionStatusMutation(payload).unwrap(),
    [updateInterventionStatusMutation],
  );

  return {
    acceptIntervention,
    reviseIntervention,
    sendDevis,
    updateInterventionStatus,
    updateStatus: updateStatusMutation,
    toggleOnlineStatus: toggleOnlineStatusMutation,

    acceptInterventionState,
    reviseInterventionState,
    addDevisState,
    updateInterventionStatusState,
    updateStatusState,
    toggleOnlineStatusState,
  };
};
