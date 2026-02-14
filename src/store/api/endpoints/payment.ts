// src/store/api/endpoints/payment.ts
import { api } from '../baseApi';
import {
    PaymentIntent,
    Payment,
} from '../api.types';
import { prepareFormData } from '../../../utils/api.helpers';

export const paymentEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Create Payment Intent
        createPaymentIntent: builder.mutation<PaymentIntent, { intervention_id: number }>({
            query: (data) => ({
                url: '/api/create-payment-intent',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['Payments'],
        }),

        // Capture Payment
        capturePayment: builder.mutation<{ message: string }, { intervention_id: number }>({
            query: (data) => ({
                url: '/api/capture-payment',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['Payments', 'Interventions'],
        }),

        // Validate Payment
        validatePayment: builder.mutation<{ message: string }, { payment_intent_id: string }>({
            query: (data) => ({
                url: '/api/valide-payment',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['Payments', 'Interventions'],
        }),

        // Get Payment History
        getPaymentHistory: builder.query<Payment[], {
            page?: number;
            per_page?: number;
            type?: 'client' | 'professional';
        }>({
            query: (params = {}) => ({
                url: '/api/payments/history',
                method: 'GET',
                params,
            }),
            providesTags: ['Payments'],
            transformResponse: (response: any) => response.data || response,
        }),

        // Get Payment Details
        getPaymentDetails: builder.query<Payment, number>({
            query: (id) => `/api/payments/${id}`,
            providesTags: (result, error, id) => [{ type: 'Payments', id }],
            transformResponse: (response: any) => response.data || response,
        }),
    }),
});

export const {
    useCreatePaymentIntentMutation,
    useCapturePaymentMutation,
    useValidatePaymentMutation,
    useGetPaymentHistoryQuery,
    useGetPaymentDetailsQuery,
} = paymentEndpoints;