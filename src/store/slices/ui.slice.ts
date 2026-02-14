// src/store/slices/ui.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppTheme, AppLanguage } from '../../types/global';

interface UIState {
    theme: AppTheme;
    language: AppLanguage;
    isDarkMode: boolean;
    isRTL: boolean;
    isLoading: boolean;
    loadingText: string | null;
    isNetworkConnected: boolean;
    isOnline: boolean;
    toast: {
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        duration: number;
    };
    modal: {
        show: boolean;
        type: string | null;
        props: Record<string, any>;
    };
    bottomSheet: {
        show: boolean;
        type: string | null;
        props: Record<string, any>;
        snapPoints: (string | number)[];
    };
    navigation: {
        currentRoute: string | null;
        previousRoute: string | null;
        params: Record<string, any>;
    };
    layout: {
        orientation: 'portrait' | 'landscape';
        keyboardVisible: boolean;
        keyboardHeight: number;
        safeArea: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
    };
    errors: {
        globalError: string | null;
        validationErrors: Record<string, string[]>;
    };
    version: {
        current: string;
        latest: string;
        updateAvailable: boolean;
        forceUpdate: boolean;
        changelog: string[];
    };
}

const initialState: UIState = {
    theme: 'system',
    language: 'fr',
    isDarkMode: false,
    isRTL: false,
    isLoading: false,
    loadingText: null,
    isNetworkConnected: true,
    isOnline: true,
    toast: {
        show: false,
        message: '',
        type: 'info',
        duration: 3000,
    },
    modal: {
        show: false,
        type: null,
        props: {},
    },
    bottomSheet: {
        show: false,
        type: null,
        props: {},
        snapPoints: ['25%', '50%', '75%'],
    },
    navigation: {
        currentRoute: null,
        previousRoute: null,
        params: {},
    },
    layout: {
        orientation: 'portrait',
        keyboardVisible: false,
        keyboardHeight: 0,
        safeArea: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    },
    errors: {
        globalError: null,
        validationErrors: {},
    },
    version: {
        current: '1.0.0',
        latest: '1.0.0',
        updateAvailable: false,
        forceUpdate: false,
        changelog: [],
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = action.payload;
            state.isDarkMode = action.payload === 'dark' ||
                (action.payload === 'system' &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
        },

        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            state.isDarkMode = state.theme === 'dark';
        },

        setLanguage: (state, action: PayloadAction<AppLanguage>) => {
            state.language = action.payload;
            state.isRTL = action.payload === 'ar';
            // You might want to persist this to AsyncStorage
        },

        setLoading: (state, action: PayloadAction<boolean | { isLoading: boolean; text?: string }>) => {
            if (typeof action.payload === 'boolean') {
                state.isLoading = action.payload;
                state.loadingText = null;
            } else {
                state.isLoading = action.payload.isLoading;
                state.loadingText = action.payload.text || null;
            }
        },

        showToast: (
            state,
            action: PayloadAction<{
                message: string;
                type?: 'success' | 'error' | 'warning' | 'info';
                duration?: number;
            }>
        ) => {
            state.toast = {
                show: true,
                message: action.payload.message,
                type: action.payload.type || 'info',
                duration: action.payload.duration || 3000,
            };
        },

        hideToast: (state) => {
            state.toast.show = false;
        },

        showModal: (
            state,
            action: PayloadAction<{ type: string; props?: Record<string, any> }>
        ) => {
            state.modal = {
                show: true,
                type: action.payload.type,
                props: action.payload.props || {},
            };
        },

        hideModal: (state) => {
            state.modal.show = false;
            state.modal.type = null;
            state.modal.props = {};
        },

        updateModalProps: (state, action: PayloadAction<Record<string, any>>) => {
            state.modal.props = { ...state.modal.props, ...action.payload };
        },

        showBottomSheet: (
            state,
            action: PayloadAction<{
                type: string;
                props?: Record<string, any>;
                snapPoints?: (string | number)[];
            }>
        ) => {
            state.bottomSheet = {
                show: true,
                type: action.payload.type,
                props: action.payload.props || {},
                snapPoints: action.payload.snapPoints || ['25%', '50%', '75%'],
            };
        },

        hideBottomSheet: (state) => {
            state.bottomSheet.show = false;
            state.bottomSheet.type = null;
            state.bottomSheet.props = {};
        },

        updateBottomSheetProps: (state, action: PayloadAction<Record<string, any>>) => {
            state.bottomSheet.props = { ...state.bottomSheet.props, ...action.payload };
        },

        setNetworkStatus: (state, action: PayloadAction<boolean>) => {
            state.isNetworkConnected = action.payload;
        },

        setOnlineStatus: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload;
        },

        setCurrentRoute: (
            state,
            action: PayloadAction<{ route: string; params?: Record<string, any> }>
        ) => {
            state.navigation.previousRoute = state.navigation.currentRoute;
            state.navigation.currentRoute = action.payload.route;
            state.navigation.params = action.payload.params || {};
        },

        goBack: (state) => {
            state.navigation.currentRoute = state.navigation.previousRoute;
            state.navigation.previousRoute = null;
            state.navigation.params = {};
        },

        setOrientation: (state, action: PayloadAction<'portrait' | 'landscape'>) => {
            state.layout.orientation = action.payload;
        },

        setKeyboardVisible: (state, action: PayloadAction<boolean>) => {
            state.layout.keyboardVisible = action.payload;
        },

        setKeyboardHeight: (state, action: PayloadAction<number>) => {
            state.layout.keyboardHeight = action.payload;
        },

        setSafeArea: (
            state,
            action: PayloadAction<{ top: number; bottom: number; left: number; right: number }>
        ) => {
            state.layout.safeArea = action.payload;
        },

        setGlobalError: (state, action: PayloadAction<string | null>) => {
            state.errors.globalError = action.payload;
        },

        setValidationErrors: (state, action: PayloadAction<Record<string, string[]>>) => {
            state.errors.validationErrors = action.payload;
        },

        clearValidationError: (state, action: PayloadAction<string>) => {
            delete state.errors.validationErrors[action.payload];
        },

        clearAllErrors: (state) => {
            state.errors.globalError = null;
            state.errors.validationErrors = {};
        },

        setAppVersion: (
            state,
            action: PayloadAction<{
                current: string;
                latest: string;
                updateAvailable?: boolean;
                forceUpdate?: boolean;
                changelog?: string[];
            }>
        ) => {
            state.version = {
                ...state.version,
                ...action.payload,
                updateAvailable: action.payload.updateAvailable ||
                    action.payload.current !== action.payload.latest,
            };
        },

        dismissUpdate: (state) => {
            state.version.updateAvailable = false;
        },

        // Utility actions
        showSuccessToast: (state, action: PayloadAction<string>) => {
            state.toast = {
                show: true,
                message: action.payload,
                type: 'success',
                duration: 3000,
            };
        },

        showErrorToast: (state, action: PayloadAction<string>) => {
            state.toast = {
                show: true,
                message: action.payload,
                type: 'error',
                duration: 5000,
            };
        },

        showWarningToast: (state, action: PayloadAction<string>) => {
            state.toast = {
                show: true,
                message: action.payload,
                type: 'warning',
                duration: 4000,
            };
        },

        showInfoToast: (state, action: PayloadAction<string>) => {
            state.toast = {
                show: true,
                message: action.payload,
                type: 'info',
                duration: 3000,
            };
        },

        // Network-aware actions
        queueAction: (
            state,
            action: PayloadAction<{ type: string; payload: any; timestamp: number }>
        ) => {
            // This would typically be handled by a middleware
            // but we can store queued actions in state
            if (!state.isOnline) {
                // Store in AsyncStorage or local queue
            }
        },

        retryQueuedActions: (state) => {
            // Process queued actions when back online
        },
    },
});

export const {
    setTheme,
    toggleTheme,
    setLanguage,
    setLoading,
    showToast,
    hideToast,
    showModal,
    hideModal,
    updateModalProps,
    showBottomSheet,
    hideBottomSheet,
    updateBottomSheetProps,
    setNetworkStatus,
    setOnlineStatus,
    setCurrentRoute,
    goBack,
    setOrientation,
    setKeyboardVisible,
    setKeyboardHeight,
    setSafeArea,
    setGlobalError,
    setValidationErrors,
    clearValidationError,
    clearAllErrors,
    setAppVersion,
    dismissUpdate,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    queueAction,
    retryQueuedActions,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectIsDarkMode = (state: { ui: UIState }) => state.ui.isDarkMode;
export const selectLanguage = (state: { ui: UIState }) => state.ui.language;
export const selectIsRTL = (state: { ui: UIState }) => state.ui.isRTL;
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading;
export const selectLoadingText = (state: { ui: UIState }) => state.ui.loadingText;
export const selectToast = (state: { ui: UIState }) => state.ui.toast;
export const selectModal = (state: { ui: UIState }) => state.ui.modal;
export const selectBottomSheet = (state: { ui: UIState }) => state.ui.bottomSheet;
export const selectIsNetworkConnected = (state: { ui: UIState }) =>
    state.ui.isNetworkConnected;
export const selectIsOnline = (state: { ui: UIState }) => state.ui.isOnline;
export const selectCurrentRoute = (state: { ui: UIState }) => state.ui.navigation.currentRoute;
export const selectRouteParams = (state: { ui: UIState }) => state.ui.navigation.params;
export const selectLayout = (state: { ui: UIState }) => state.ui.layout;
export const selectErrors = (state: { ui: UIState }) => state.ui.errors;
export const selectVersion = (state: { ui: UIState }) => state.ui.version;
export const selectIsUpdateAvailable = (state: { ui: UIState }) =>
    state.ui.version.updateAvailable;

// Derived selectors
export const selectIsModalOpen = (type?: string) => (state: { ui: UIState }) =>
    state.ui.modal.show && (!type || state.ui.modal.type === type);

export const selectIsBottomSheetOpen = (type?: string) => (state: { ui: UIState }) =>
    state.ui.bottomSheet.show && (!type || state.ui.bottomSheet.type === type);

export const selectValidationError = (field: string) => (state: { ui: UIState }) =>
    state.ui.errors.validationErrors[field]?.[0] || null;

export default uiSlice.reducer;