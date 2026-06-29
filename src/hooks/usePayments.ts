import {
  useCreatePaymentIntentMutation,
  useCapturePaymentMutation,
  useValidatePaymentMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentDetailsQuery,
} from '../store/api';

export const usePayments = () => {
  const [createPaymentIntent, createPaymentIntentState] = useCreatePaymentIntentMutation();
  const [capturePayment, capturePaymentState] = useCapturePaymentMutation();
  const [validatePayment, validatePaymentState] = useValidatePaymentMutation();

  return {
    createPaymentIntent,
    capturePayment,
    validatePayment,

    createPaymentIntentState,
    capturePaymentState,
    validatePaymentState,

    useGetPaymentHistoryQuery,
    useGetPaymentDetailsQuery,
  };
};
