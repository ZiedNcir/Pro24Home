// src/store/api/endpoints/payment.ts
import { api } from '../baseApi';
import {
    PaymentIntent,
    Payment,
} from '../api.types';
import { prepareFormData } from '../../../utils/api.helpers';

export const paymentEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get the estimated intervention price
        getInterventionPrice: builder.query<{
            price?: number;
            minPrice?: number;
            maxPrice?: number;
        }, void>({
            query: () => '/api/get-intervention-price',
            providesTags: ['Payments'],
            transformResponse: (response: any) => {
                const payload = response?.data ?? response;
                if (typeof payload === 'number') return { price: payload };

                return {
                    price: Number(payload?.price) || undefined,
                    minPrice: Number(payload?.min_price ?? payload?.min) || undefined,
                    maxPrice: Number(payload?.max_price ?? payload?.max) || undefined,
                };
            },
        }),

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
            providesTags: (_result, _error, id) => [{ type: 'Payments', id }],
            transformResponse: (response: any) => response.data || response,
        }),
    }),
});

export const {
    useGetInterventionPriceQuery,
    useCreatePaymentIntentMutation,
    useCapturePaymentMutation,
    useValidatePaymentMutation,
    useGetPaymentHistoryQuery,
    useGetPaymentDetailsQuery,
} = paymentEndpoints;
