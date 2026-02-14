// src/types/global.d.ts
import 'react-redux';

// Extend React-Redux types
declare module 'react-redux' {
    interface DefaultRootState extends RootState { }
}

// Navigation types (if using React Navigation)
export declare global {
    type NavigationProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
        RootStackParamList,
        T
    >;

    interface RootStackParamList {
        Auth: undefined;
        Main: undefined;
        Home: undefined;
        Interventions: undefined;
        InterventionDetail: { interventionId: number };
        Profile: undefined;
        Settings: undefined;
        // Add other screens as needed
    }

    // App configuration
    interface AppConfig {
        version: string;
        environment: 'development' | 'staging' | 'production';
        apiUrl: string;
        onesignalAppId?: string;
        stripePublishableKey?: string;
    }

    // File types for React Native
    interface FileType {
        uri: string;
        type: string;
        name: string;
        size?: number;
    }

    // API Response wrapper
    interface ApiResponse<T = any> {
        success: boolean;
        data?: T;
        message?: string;
        errors?: Record<string, string[]>;
    }

    // Pagination meta
    interface PaginationMeta {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    }

    // Location coordinates
    interface Coordinates {
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitude?: number;
    }

    // User roles and permissions
    enum UserRole {
        CLIENT = 'client',
        PROFESSIONAL = 'professional',
        ADMIN = 'admin'
    }

    // Intervention status enum
    enum InterventionStatus {
        PENDING = 'pending',
        ACCEPTED = 'accepted',
        IN_PROGRESS = 'in progress',
        COMPLETED = 'completed',
        REJECTED = 'rejected',
        CANCELED = 'canceled'
    }

    // Devis status enum
    enum DevisStatus {
        PENDING = 'pending',
        ACCEPTED = 'accepted',
        REVISED = 'revised',
        REJECTED = 'rejected'
    }

    // Payment status enum
    enum PaymentStatus {
        PENDING = 'pending',
        PROCESSING = 'processing',
        COMPLETED = 'completed',
        FAILED = 'failed',
        REFUNDED = 'refunded'
    }

    // Notification types
    enum NotificationType {
        INTERVENTION = 'intervention',
        DEVIS = 'devis',
        RECLAMATION = 'reclamation',
        PAYMENT = 'payment',
        SYSTEM = 'system',
        CHAT = 'chat'
    }

    // Language types


    // Form field validation
    interface ValidationRules {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: any) => string | null;
    }
}
export type AppLanguage = 'fr' | 'en' | 'ar';

// Theme types
export type AppTheme = 'light' | 'dark' | 'system';