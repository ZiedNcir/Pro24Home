// src/store/slices/user.slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type {
    User,
    Professional,
    Document,
    Vehicle,
    Address,
    Service,
    Zone
} from '../api/api.types';

interface UserState {
    profile: User | null;
    documents: Document[];
    vehicles: Vehicle[];
    addresses: Address[];
    services: Service[];
    zones: Zone[];
    selectedZone: Zone | null;
    selectedServices: Service[];
    favorites: {
        professionals: Professional[];
        addresses: Address[];
    };
    notifications: {
        enabled: boolean;
        pushEnabled: boolean;
        emailEnabled: boolean;
        smsEnabled: boolean;
        quietHours: {
            enabled: boolean;
            start: string; // "22:00"
            end: string;   // "08:00"
        };
    };
    preferences: {
        language: 'fr' | 'en' | 'ar';
        theme: 'light' | 'dark' | 'system';
        currency: 'EUR' | 'USD' | 'TND';
        distanceUnit: 'km' | 'miles';
        autoAcceptDevis: boolean;
        showTutorial: boolean;
        dataSaving: boolean;
    };
    stats: {
        totalInterventions: number;
        completedInterventions: number;
        pendingInterventions: number;
        totalEarnings: number;
        averageRating: number;
        responseTime: number; // in minutes
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    documents: [],
    vehicles: [],
    addresses: [],
    services: [],
    zones: [],
    selectedZone: null,
    selectedServices: [],
    favorites: {
        professionals: [],
        addresses: [],
    },
    notifications: {
        enabled: true,
        pushEnabled: true,
        emailEnabled: false,
        smsEnabled: false,
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
        },
    },
    preferences: {
        language: 'fr',
        theme: 'system',
        currency: 'EUR',
        distanceUnit: 'km',
        autoAcceptDevis: false,
        showTutorial: true,
        dataSaving: false,
    },
    stats: {
        totalInterventions: 0,
        completedInterventions: 0,
        pendingInterventions: 0,
        totalEarnings: 0,
        averageRating: 0,
        responseTime: 0,
    },
    isLoading: false,
    error: null,
};

// Thunks
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (userId: number, { rejectWithValue }) => {
        try {
            // This would be your API call to fetch user profile
            // For now, return mock data
            return {} as User;
        } catch (error) {
            return rejectWithValue('Failed to fetch user profile');
        }
    }
);

export const updateUserPreferences = createAsyncThunk(
    'user/updatePreferences',
    async (preferences: Partial<UserState['preferences']>, { rejectWithValue }) => {
        try {
            // API call to update preferences
            return preferences;
        } catch (error) {
            return rejectWithValue('Failed to update preferences');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<User>) => {
            state.profile = action.payload;
        },

        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },

        setDocuments: (state, action: PayloadAction<Document[]>) => {
            state.documents = action.payload;
        },

        addDocument: (state, action: PayloadAction<Document>) => {
            state.documents.push(action.payload);
        },

        removeDocument: (state, action: PayloadAction<number>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },

        updateDocumentStatus: (
            state,
            action: PayloadAction<{ id: number; status: Document['status'] }>
        ) => {
            const document = state.documents.find(doc => doc.id === action.payload.id);
            if (document) {
                document.status = action.payload.status;
            }
        },

        setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
            state.vehicles = action.payload;
        },

        addVehicle: (state, action: PayloadAction<Vehicle>) => {
            state.vehicles.push(action.payload);
        },

        removeVehicle: (state, action: PayloadAction<number>) => {
            state.vehicles = state.vehicles.filter(
                vehicle => vehicle.serial_number !== action.payload
            );
        },

        setAddresses: (state, action: PayloadAction<Address[]>) => {
            state.addresses = action.payload;
        },

        addAddress: (state, action: PayloadAction<Address>) => {
            state.addresses.push(action.payload);
        },

        updateAddress: (state, action: PayloadAction<Address>) => {
            const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
        },

        removeAddress: (state, action: PayloadAction<number>) => {
            state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        },

        setDefaultAddress: (state, action: PayloadAction<number>) => {
            state.addresses.forEach(addr => {
                addr.is_default = addr.id === action.payload;
            });
        },

        setServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
        },

        setSelectedServices: (state, action: PayloadAction<Service[]>) => {
            state.selectedServices = action.payload;
        },

        toggleServiceSelection: (state, action: PayloadAction<number>) => {
            const service = state.services.find(s => s.id === action.payload);
            if (service) {
                const index = state.selectedServices.findIndex(s => s.id === action.payload);
                if (index === -1) {
                    state.selectedServices.push(service);
                } else {
                    state.selectedServices.splice(index, 1);
                }
            }
        },

        setZones: (state, action: PayloadAction<Zone[]>) => {
            state.zones = action.payload;
        },

        selectZone: (state, action: PayloadAction<Zone | null>) => {
            state.selectedZone = action.payload;
        },

        addFavoriteProfessional: (state, action: PayloadAction<Professional>) => {
            const exists = state.favorites.professionals.some(
                pro => pro.id === action.payload.id
            );
            if (!exists) {
                state.favorites.professionals.push(action.payload);
            }
        },

        removeFavoriteProfessional: (state, action: PayloadAction<number>) => {
            state.favorites.professionals = state.favorites.professionals.filter(
                pro => pro.id !== action.payload
            );
        },

        addFavoriteAddress: (state, action: PayloadAction<Address>) => {
            const exists = state.favorites.addresses.some(
                addr => addr.id === action.payload.id
            );
            if (!exists) {
                state.favorites.addresses.push(action.payload);
            }
        },

        removeFavoriteAddress: (state, action: PayloadAction<number>) => {
            state.favorites.addresses = state.favorites.addresses.filter(
                addr => addr.id !== action.payload
            );
        },

        updateNotificationSettings: (
            state,
            action: PayloadAction<Partial<UserState['notifications']>>
        ) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },

        toggleNotificationType: (
            state,
            action: PayloadAction<'push' | 'email' | 'sms'>
        ) => {
            switch (action.payload) {
                case 'push':
                    state.notifications.pushEnabled = !state.notifications.pushEnabled;
                    break;
                case 'email':
                    state.notifications.emailEnabled = !state.notifications.emailEnabled;
                    break;
                case 'sms':
                    state.notifications.smsEnabled = !state.notifications.smsEnabled;
                    break;
            }
        },

        setQuietHours: (
            state,
            action: PayloadAction<{ enabled: boolean; start?: string; end?: string }>
        ) => {
            state.notifications.quietHours = {
                ...state.notifications.quietHours,
                ...action.payload,
            };
        },

        updateUserStats: (state, action: PayloadAction<Partial<UserState['stats']>>) => {
            state.stats = { ...state.stats, ...action.payload };
        },

        incrementTotalInterventions: (state) => {
            state.stats.totalInterventions += 1;
        },

        incrementCompletedInterventions: (state) => {
            state.stats.completedInterventions += 1;
        },

        updateEarnings: (state, action: PayloadAction<number>) => {
            state.stats.totalEarnings += action.payload;
        },

        updateAverageRating: (state, action: PayloadAction<number>) => {
            // Calculate new average rating
            const currentTotal = state.stats.averageRating * (state.stats.totalInterventions - 1);
            state.stats.averageRating = (currentTotal + action.payload) / state.stats.totalInterventions;
        },

        updateResponseTime: (state, action: PayloadAction<number>) => {
            // Calculate average response time
            const currentTotal = state.stats.responseTime * (state.stats.totalInterventions - 1);
            state.stats.responseTime = (currentTotal + action.payload) / state.stats.totalInterventions;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        resetUserState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserPreferences.fulfilled, (state, action) => {
                state.preferences = { ...state.preferences, ...action.payload };
            });
    },
});

export const {
    setUserProfile,
    updateProfile,
    setDocuments,
    addDocument,
    removeDocument,
    updateDocumentStatus,
    setVehicles,
    addVehicle,
    removeVehicle,
    setAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    setServices,
    setSelectedServices,
    toggleServiceSelection,
    setZones,
    selectZone,
    addFavoriteProfessional,
    removeFavoriteProfessional,
    addFavoriteAddress,
    removeFavoriteAddress,
    updateNotificationSettings,
    toggleNotificationType,
    setQuietHours,
    updateUserStats,
    incrementTotalInterventions,
    incrementCompletedInterventions,
    updateEarnings,
    updateAverageRating,
    updateResponseTime,
    setLoading,
    setError,
    clearError,
    resetUserState,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectUserDocuments = (state: { user: UserState }) => state.user.documents;
export const selectUserVehicles = (state: { user: UserState }) => state.user.vehicles;
export const selectUserAddresses = (state: { user: UserState }) => state.user.addresses;
export const selectDefaultAddress = (state: { user: UserState }) =>
    state.user.addresses.find(addr => addr.is_default);
export const selectUserServices = (state: { user: UserState }) => state.user.services;
export const selectSelectedServices = (state: { user: UserState }) =>
    state.user.selectedServices;
export const selectUserZones = (state: { user: UserState }) => state.user.zones;
export const selectSelectedZone = (state: { user: UserState }) => state.user.selectedZone;
export const selectFavoriteProfessionals = (state: { user: UserState }) =>
    state.user.favorites.professionals;
export const selectFavoriteAddresses = (state: { user: UserState }) =>
    state.user.favorites.addresses;
export const selectNotificationSettings = (state: { user: UserState }) =>
    state.user.notifications;
export const selectUserPreferences = (state: { user: UserState }) =>
    state.user.preferences;
export const selectUserStats = (state: { user: UserState }) => state.user.stats;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;