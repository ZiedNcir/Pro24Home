// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api/baseApi';
import authReducer from './slices/authSlice';
import userReducer from './slices/user.slice';
import uiReducer from './slices/ui.slice';
import interventionsReducer from './slices/intervention.slice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        user: userReducer,
        ui: uiReducer,
        interventions: interventionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'auth/login/fulfilled',
                    'auth/register/fulfilled',
                    'auth/getServices/fulfilled'
                ],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['meta.arg', 'payload.timestamp', 'meta.baseQueryMeta'],

                // Ignore these paths in the state
                ignoredPaths: ['items.dates'],
            },
        }).concat(api.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;