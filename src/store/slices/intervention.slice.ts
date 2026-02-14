// src/store/slices/intervention.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type {
    Intervention,
    Devis,
    Reclamation,
    Rating,
    InterventionStatus,
    DevisStatus
} from '../api/api.types';

interface InterventionState {
    interventions: Intervention[];
    selectedIntervention: Intervention | null;
    devis: Devis[];
    selectedDevis: Devis | null;
    reclamations: Reclamation[];
    selectedReclamation: Reclamation | null;
    ratings: Rating[];
    filters: {
        status: InterventionStatus | 'all';
        dateRange: {
            start: string | null;
            end: string | null;
        };
        serviceId: number | null;
        professionalId: number | null;
        clientId: number | null;
        minPrice: number | null;
        maxPrice: number | null;
        sortBy: 'date' | 'price' | 'status' | 'title';
        sortOrder: 'asc' | 'desc';
    };
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    mapView: {
        center: { latitude: number; longitude: number };
        zoom: number;
        interventions: Intervention[];
        selectedInterventionId: number | null;
    };
    calendarView: {
        selectedDate: string;
        interventionsByDate: Record<string, Intervention[]>;
    };
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: InterventionState = {
    interventions: [],
    selectedIntervention: null,
    devis: [],
    selectedDevis: null,
    reclamations: [],
    selectedReclamation: null,
    ratings: [],
    filters: {
        status: 'all',
        dateRange: {
            start: null,
            end: null,
        },
        serviceId: null,
        professionalId: null,
        clientId: null,
        minPrice: null,
        maxPrice: null,
        sortBy: 'date',
        sortOrder: 'desc',
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    },
    mapView: {
        center: { latitude: 48.8566, longitude: 2.3522 }, // Paris default
        zoom: 12,
        interventions: [],
        selectedInterventionId: null,
    },
    calendarView: {
        selectedDate: new Date().toISOString().split('T')[0],
        interventionsByDate: {},
    },
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    successMessage: null,
};

// Thunks
export const fetchInterventions = createAsyncThunk(
    'intervention/fetchInterventions',
    async (params: {
        page?: number;
        filters?: Partial<InterventionState['filters']>;
    }, { rejectWithValue }) => {
        try {
            // API call would go here
            return { interventions: [], pagination: initialState.pagination };
        } catch (error) {
            return rejectWithValue('Failed to fetch interventions');
        }
    }
);

export const createIntervention = createAsyncThunk(
    'intervention/create',
    async (data: any, { rejectWithValue }) => {
        try {
            // API call would go here
            return {} as Intervention;
        } catch (error) {
            return rejectWithValue('Failed to create intervention');
        }
    }
);

const interventionSlice = createSlice({
    name: 'intervention',
    initialState,
    reducers: {
        setInterventions: (state, action: PayloadAction<Intervention[]>) => {
            state.interventions = action.payload;
            state.pagination.totalItems = action.payload.length;
        },

        addIntervention: (state, action: PayloadAction<Intervention>) => {
            state.interventions.unshift(action.payload);
            state.pagination.totalItems += 1;

            // Update calendar view
            const date = action.payload.created_at.split('T')[0];
            if (!state.calendarView.interventionsByDate[date]) {
                state.calendarView.interventionsByDate[date] = [];
            }
            state.calendarView.interventionsByDate[date].push(action.payload);
        },

        updateIntervention: (state, action: PayloadAction<Intervention>) => {
            const index = state.interventions.findIndex(i => i.id === action.payload.id);
            if (index !== -1) {
                state.interventions[index] = action.payload;
            }

            if (state.selectedIntervention?.id === action.payload.id) {
                state.selectedIntervention = action.payload;
            }

            // Update in map view if present
            const mapIndex = state.mapView.interventions.findIndex(i => i.id === action.payload.id);
            if (mapIndex !== -1) {
                state.mapView.interventions[mapIndex] = action.payload;
            }

            // Update in calendar view
            Object.keys(state.calendarView.interventionsByDate).forEach(date => {
                state.calendarView.interventionsByDate[date] = state.calendarView.interventionsByDate[date].map(
                    intervention => intervention.id === action.payload.id ? action.payload : intervention
                );
            });
        },

        removeIntervention: (state, action: PayloadAction<number>) => {
            state.interventions = state.interventions.filter(i => i.id !== action.payload);
            state.pagination.totalItems -= 1;

            if (state.selectedIntervention?.id === action.payload) {
                state.selectedIntervention = null;
            }

            // Remove from map view
            state.mapView.interventions = state.mapView.interventions.filter(
                i => i.id !== action.payload
            );

            // Remove from calendar view
            Object.keys(state.calendarView.interventionsByDate).forEach(date => {
                state.calendarView.interventionsByDate[date] = state.calendarView.interventionsByDate[date].filter(
                    intervention => intervention.id !== action.payload
                );
            });
        },

        selectIntervention: (state, action: PayloadAction<Intervention | null>) => {
            state.selectedIntervention = action.payload;
            if (action.payload) {
                state.mapView.selectedInterventionId = action.payload.id;
            }
        },

        updateInterventionStatus: (
            state,
            action: PayloadAction<{ id: number; status: InterventionStatus }>
        ) => {
            const intervention = state.interventions.find(i => i.id === action.payload.id);
            if (intervention) {
                intervention.status = action.payload.status;
                intervention.updated_at = new Date().toISOString();
            }

            if (state.selectedIntervention?.id === action.payload.id) {
                state.selectedIntervention!.status = action.payload.status;
                state.selectedIntervention!.updated_at = new Date().toISOString();
            }
        },

        setDevis: (state, action: PayloadAction<Devis[]>) => {
            state.devis = action.payload;
        },

        addDevis: (state, action: PayloadAction<Devis>) => {
            state.devis.push(action.payload);

            // Link devis to intervention
            const intervention = state.interventions.find(
                i => i.id === action.payload.intervention_id
            );
            if (intervention) {
                if (!intervention.devis) intervention.devis = [];
                intervention.devis.push(action.payload);
            }
        },

        updateDevis: (state, action: PayloadAction<Devis>) => {
            const index = state.devis.findIndex(d => d.id === action.payload.id);
            if (index !== -1) {
                state.devis[index] = action.payload;
            }

            if (state.selectedDevis?.id === action.payload.id) {
                state.selectedDevis = action.payload;
            }

            // Update in intervention
            state.interventions.forEach(intervention => {
                if (intervention.devis) {
                    const devisIndex = intervention.devis.findIndex(d => d.id === action.payload.id);
                    if (devisIndex !== -1) {
                        intervention.devis[devisIndex] = action.payload;
                    }
                }
            });
        },

        updateDevisStatus: (
            state,
            action: PayloadAction<{ id: number; status: DevisStatus }>
        ) => {
            const devis = state.devis.find(d => d.id === action.payload.id);
            if (devis) {
                devis.status = action.payload.status;
                devis.updated_at = new Date().toISOString();
            }
        },

        selectDevis: (state, action: PayloadAction<Devis | null>) => {
            state.selectedDevis = action.payload;
        },

        setReclamations: (state, action: PayloadAction<Reclamation[]>) => {
            state.reclamations = action.payload;
        },

        addReclamation: (state, action: PayloadAction<Reclamation>) => {
            state.reclamations.push(action.payload);

            // Link reclamation to intervention
            const intervention = state.interventions.find(
                i => i.id === action.payload.intervention_id
            );
            if (intervention) {
                if (!intervention.reclamations) intervention.reclamations = [];
                intervention.reclamations.push(action.payload);
            }
        },

        updateReclamation: (state, action: PayloadAction<Reclamation>) => {
            const index = state.reclamations.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.reclamations[index] = action.payload;
            }

            if (state.selectedReclamation?.id === action.payload.id) {
                state.selectedReclamation = action.payload;
            }
        },

        selectReclamation: (state, action: PayloadAction<Reclamation | null>) => {
            state.selectedReclamation = action.payload;
        },

        setRatings: (state, action: PayloadAction<Rating[]>) => {
            state.ratings = action.payload;
        },

        addRating: (state, action: PayloadAction<Rating>) => {
            state.ratings.push(action.payload);

            // Link rating to intervention
            const intervention = state.interventions.find(
                i => i.id === action.payload.intervention_id
            );
            if (intervention) {
                intervention.rating = action.payload;
            }
        },

        updateRating: (state, action: PayloadAction<Rating>) => {
            const index = state.ratings.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.ratings[index] = action.payload;
            }
        },

        setFilters: (state, action: PayloadAction<Partial<InterventionState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.currentPage = 1; // Reset to first page when filters change
        },

        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.currentPage = 1;
        },

        setPagination: (state, action: PayloadAction<Partial<InterventionState['pagination']>>) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        nextPage: (state) => {
            if (state.pagination.hasNextPage) {
                state.pagination.currentPage += 1;
            }
        },

        previousPage: (state) => {
            if (state.pagination.hasPreviousPage) {
                state.pagination.currentPage -= 1;
            }
        },

        setMapView: (state, action: PayloadAction<Partial<InterventionState['mapView']>>) => {
            state.mapView = { ...state.mapView, ...action.payload };
        },

        setMapCenter: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
            state.mapView.center = action.payload;
        },

        setMapZoom: (state, action: PayloadAction<number>) => {
            state.mapView.zoom = action.payload;
        },

        updateMapInterventions: (state, action: PayloadAction<Intervention[]>) => {
            state.mapView.interventions = action.payload;
        },

        selectMapIntervention: (state, action: PayloadAction<number | null>) => {
            state.mapView.selectedInterventionId = action.payload;
        },

        setCalendarDate: (state, action: PayloadAction<string>) => {
            state.calendarView.selectedDate = action.payload;
        },

        updateCalendarInterventions: (
            state,
            action: PayloadAction<Record<string, Intervention[]>>
        ) => {
            state.calendarView.interventionsByDate = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setCreating: (state, action: PayloadAction<boolean>) => {
            state.isCreating = action.payload;
        },

        setUpdating: (state, action: PayloadAction<boolean>) => {
            state.isUpdating = action.payload;
        },

        setDeleting: (state, action: PayloadAction<boolean>) => {
            state.isDeleting = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.successMessage = null;
        },

        setSuccessMessage: (state, action: PayloadAction<string | null>) => {
            state.successMessage = action.payload;
            state.error = null;
        },

        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },

        resetInterventionState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterventions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInterventions.fulfilled, (state, action) => {
                state.interventions = action.payload.interventions;
                state.pagination = action.payload.pagination;
                state.isLoading = false;
            })
            .addCase(fetchInterventions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createIntervention.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createIntervention.fulfilled, (state, action) => {
                state.interventions.unshift(action.payload);
                state.pagination.totalItems += 1;
                state.isCreating = false;
                state.successMessage = 'Intervention created successfully';
            })
            .addCase(createIntervention.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setInterventions,
    addIntervention,
    updateIntervention,
    removeIntervention,
    selectIntervention,
    updateInterventionStatus,
    setDevis,
    addDevis,
    updateDevis,
    updateDevisStatus,
    selectDevis,
    setReclamations,
    addReclamation,
    updateReclamation,
    selectReclamation,
    setRatings,
    addRating,
    updateRating,
    setFilters,
    clearFilters,
    setPagination,
    nextPage,
    previousPage,
    setMapView,
    setMapCenter,
    setMapZoom,
    updateMapInterventions,
    selectMapIntervention,
    setCalendarDate,
    updateCalendarInterventions,
    setLoading,
    setCreating,
    setUpdating,
    setDeleting,
    setError,
    setSuccessMessage,
    clearMessages,
    resetInterventionState,
} = interventionSlice.actions;

// Selectors
export const selectInterventions = (state: { intervention: InterventionState }) =>
    state.intervention.interventions;
export const selectSelectedIntervention = (state: { intervention: InterventionState }) =>
    state.intervention.selectedIntervention;
export const selectInterventionDevis = (state: { intervention: InterventionState }) =>
    state.intervention.devis;
export const selectSelectedDevis = (state: { intervention: InterventionState }) =>
    state.intervention.selectedDevis;
export const selectInterventionReclamations = (state: { intervention: InterventionState }) =>
    state.intervention.reclamations;
export const selectSelectedReclamation = (state: { intervention: InterventionState }) =>
    state.intervention.selectedReclamation;
export const selectInterventionRatings = (state: { intervention: InterventionState }) =>
    state.intervention.ratings;
export const selectInterventionFilters = (state: { intervention: InterventionState }) =>
    state.intervention.filters;
export const selectInterventionPagination = (state: { intervention: InterventionState }) =>
    state.intervention.pagination;
export const selectMapView = (state: { intervention: InterventionState }) =>
    state.intervention.mapView;
export const selectCalendarView = (state: { intervention: InterventionState }) =>
    state.intervention.calendarView;
export const selectInterventionsByDate = (date: string) =>
    (state: { intervention: InterventionState }) =>
        state.intervention.calendarView.interventionsByDate[date] || [];
export const selectInterventionLoading = (state: { intervention: InterventionState }) =>
    state.intervention.isLoading;
export const selectInterventionCreating = (state: { intervention: InterventionState }) =>
    state.intervention.isCreating;
export const selectInterventionError = (state: { intervention: InterventionState }) =>
    state.intervention.error;
export const selectInterventionSuccessMessage = (state: { intervention: InterventionState }) =>
    state.intervention.successMessage;

// Filtered interventions selector
export const selectFilteredInterventions = (state: { intervention: InterventionState }) => {
    const { interventions, filters } = state.intervention;

    return interventions.filter(intervention => {
        // Filter by status
        if (filters.status !== 'all' && intervention.status !== filters.status) {
            return false;
        }

        // Filter by service
        if (filters.serviceId && intervention.service_id !== filters.serviceId) {
            return false;
        }

        // Filter by professional
        if (filters.professionalId && intervention.professional_id !== filters.professionalId) {
            return false;
        }

        // Filter by client
        if (filters.clientId && intervention.client_id !== filters.clientId) {
            return false;
        }

        // Filter by price range
        if (filters.minPrice !== null && intervention.price && intervention.price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice !== null && intervention.price && intervention.price > filters.maxPrice) {
            return false;
        }

        // Filter by date range
        if (filters.dateRange.start) {
            const interventionDate = new Date(intervention.created_at);
            const startDate = new Date(filters.dateRange.start);
            if (interventionDate < startDate) {
                return false;
            }
        }

        if (filters.dateRange.end) {
            const interventionDate = new Date(intervention.created_at);
            const endDate = new Date(filters.dateRange.end);
            if (interventionDate > endDate) {
                return false;
            }
        }

        return true;
    }).sort((a, b) => {
        // Sorting logic
        const order = filters.sortOrder === 'asc' ? 1 : -1;

        switch (filters.sortBy) {
            case 'date':
                return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * order;
            case 'price':
                return ((a.price || 0) - (b.price || 0)) * order;
            case 'title':
                return a.title.localeCompare(b.title) * order;
            case 'status':
                return a.status.localeCompare(b.status) * order;
            default:
                return 0;
        }
    });
};

export default interventionSlice.reducer;