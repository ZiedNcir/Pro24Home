import { api } from '../../../store/api/baseApi';
import { readLocalInterventions, removeLocalIntervention, type LocalIntervention } from '../model/local-interventions';

export const localInterventionsApi = api.enhanceEndpoints({ addTagTypes: ['LocalInterventions'] }).injectEndpoints({
    endpoints: builder => ({
        deleteLocalIntervention: builder.mutation<null, { userId: number; id: string }>({
            queryFn: async ({ userId, id }) => {
                try {
                    await removeLocalIntervention(userId, id);
                    return { data: null };
                } catch {
                    return { error: { status: 'CUSTOM_ERROR', error: 'Could not delete saved intervention' } };
                }
            },
            invalidatesTags: (_result, error, { userId }) => error ? [] : [{ type: 'LocalInterventions', id: userId }],
        }),
        getLocalInterventions: builder.query<LocalIntervention[], number>({
            queryFn: async userId => {
                try {
                    return { data: await readLocalInterventions(userId) };
                } catch {
                    return { error: { status: 'CUSTOM_ERROR', error: 'Could not read saved interventions' } };
                }
            },
            providesTags: (_result, _error, userId) => [{ type: 'LocalInterventions', id: userId }],
        }),
    }),
});

export const { useGetLocalInterventionsQuery, useDeleteLocalInterventionMutation } = localInterventionsApi;
