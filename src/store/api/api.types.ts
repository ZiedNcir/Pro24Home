// src/store/api/api.types.ts

// Base Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    }
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// User Types
export enum UserType {
    CLIENT = 'client',
    PROFESSIONAL = 'professional'
}

/**
 * Base user information common to all user types
 */
export interface BaseUser {
    /** Unique identifier for the user */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name */
    last_name: string;
    /** User's email address */
    email: string;
    /** User's phone number */
    phone_number: string;
    /** User's address (optional) */
    address?: string;
    /** Postal code for the address */
    postal_code?: string;
    /** OneSignal device token for push notifications */
    onesignal_key?: string;
    /** Account creation timestamp (ISO 8601 string) */
    created_at: string;
    /** Last update timestamp (ISO 8601 string) */
    updated_at: string;
}

/**
 * Client-specific user information (used in nested user.client object)
 */
export interface ClientInfo {
    /** Client record ID */
    id: number;
    /** Reference to the main user ID */
    user_id: number;
    /** Client's first name */
    first_name: string;
    /** Client's last name */
    last_name: string;
    /** Client's address */
    address: string;
    /** Postal code */
    postal_code: string;
    /** OneSignal device token */
    onesignal_key?: string;
    /** Record creation timestamp */
    created_at: string;
    /** Record update timestamp */
    updated_at: string;
}

/**
 * Professional-specific user information (used in nested user.professional object)
 */
export interface ProfessionalInfo {
    /** Professional record ID */
    id: number;
    /** Reference to the main user ID */
    user_id: number;
    /** Company name */
    company_name: string;
    /** SIRET number for business identification */
    siret_number: string;
    /** Business address */
    address: string;
    /** Postal code */
    postal_code: string;
    /** Professional's first name */
    first_name: string;
    /** Professional's last name */
    last_name: string;
    /** Associated service zone ID */
    zone_id?: number;
    /** OneSignal device token */
    onesignal_key?: string;
    /** Whether the professional is online */
    online_status: boolean;
    /** Current latitude */
    latitude?: number;
    /** Current longitude */
    longitude?: number;
    /** Services offered by the professional */
    services: Service[];
    /** Notification preferences */
    notifications_enabled: boolean;
    /** Record creation timestamp */
    created_at: string;
    /** Record update timestamp */
    updated_at: string;
}

/**
 * Complete user profile with authentication and role-specific data
 */
export interface User {
    /** Unique user identifier */
    id: number;
    /** Full display name (computed field) */
    name: string;
    /** User's email address */
    email: string;
    /** Registration source (null if direct) */
    source: string | null;
    /** OneSignal device token */
    onesignal_key: string | null;
    /** Email verification timestamp (null if unverified) */
    email_verified_at: string | null;
    /** Account creation timestamp */
    created_at: string;
    /** Last update timestamp */
    updated_at: string;
    /** User type discriminator */
    type: UserType;
    /** Verification code for email/phone (null after verification) */
    verification_code: string | null;
    /** Verification status (1 = verified, 0 = unverified) */
    is_verified: number;
    /** Account activation status (1 = active, 0 = inactive) */
    is_active: number;
    /** Number of verification attempts */
    verification_attempts: number;
    /** Last verification code sent timestamp */
    last_verification_sent_at: string | null;
    /** User's phone number */
    phone_number: string;
    /** Notification preferences (1 = enabled, 0 = disabled) */
    notifications_enabled: number;
    /** Client-specific data (populated if type === 'client') */
    client: ClientInfo | null;
    /** Professional-specific data (populated if type === 'professional') */
    professional: ProfessionalInfo | null;
    /** User's uploaded documents */
    documents: Document[];
    /** User's saved addresses */
    address: Address[];
    /** Professional's registered vehicles */
    vehicles: Vehicle[];
}

/**
 * Legacy Client interface for backward compatibility with existing relations
 * @deprecated Use ClientInfo for new nested user.client objects
 */
export interface Client extends BaseUser {
    type: UserType.CLIENT;
}

/**
 * Legacy Professional interface for backward compatibility with existing relations
 * @deprecated Use ProfessionalInfo for new nested user.professional objects
 */
export interface Professional extends BaseUser {
    type: UserType.PROFESSIONAL;
    company_name: string;
    siret_number: string;
    zone_id?: number;
    documents: Document[];
    vehicles: Vehicle[];
    online_status: boolean;
    latitude?: number;
    longitude?: number;
    services: Service[];
    notifications_enabled: boolean;
}

// Auth Types
export interface AuthResponse {
    exist: boolean;
    is_verified: boolean;
    is_active: boolean;
    access_token: string;
    user: User;
    message?: string;
}

export interface RegisterClientRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    address: string;
    postal_code: string;
    onesignal_key: string;
    lang?: 'fr' | 'en' | 'ar';
}

export interface RegisterProfessionalRequest extends RegisterClientRequest {
    siret_number: string;
    company_name: string;
    services: number[];
    source?: string;
    commercial_id?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerificationRequest {
    code: string;
    email: string;
    phone_number: string;
}

export interface ChangePasswordRequest {
    password: string;
    password_confirmation: string;
}

// Service Types
export interface Service {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    parent_id?: number;
    children?: Service[];
}

export interface SubService {
    id: number;
    service_id: number;
    name: string;
    price_range?: string;
}

// Zone Types
export interface Zone {
    id: number;
    name: string;
    code: string;
    radius: number;
    center_latitude: number;
    center_longitude: number;
    is_active: boolean;
}

// Vehicle Types
export interface Vehicle {
    serial_number: number;
    type: 'car' | 'van' | 'truck' | 'motorcycle';
    name: string;
    model?: string;
    year?: number;
}

// Document Types
export type DocumentType =
    | 'identity_front'
    | 'identity_back'
    | 'proof_of_address'
    | 'kbis'
    | 'rib';

export interface Document {
    id: number;
    name: DocumentType;
    type: 'pdf' | 'img';
    url: string;
    uploaded_at: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Address Types
export type AddressType = 'maison' | 'appartement' | 'entreprise' | 'hotel';

export interface Address {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    address: string;
    location_name: string;
    details?: string;
    phone: string;
    code_maison?: string;
    zone_id: number;
    type: AddressType;
    floor?: string;
    hotel_name?: string;
    company_name?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

// Intervention Types
export enum InterventionStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    IN_PROGRESS = 'in progress',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    CANCELED = 'canceled'
}

export interface Intervention {
    id: number;
    title: string;
    description: string;
    price?: number;
    status: InterventionStatus;
    service_id: number;
    sub_service_id: number;
    address_id: number;
    client_id: number;
    professional_id?: number;
    requested_date: string;
    scheduled_date?: string;
    completed_date?: string;
    created_at: string;
    updated_at: string;

    // Relations
    service?: Service;
    sub_service?: SubService;
    address?: Address;
    client?: Client;
    professional?: Professional;
    images: InterventionImage[];
    devis?: Devis[];
    reclamations?: Reclamation[];
    rating?: Rating;
}

export interface InterventionImage {
    id: number;
    intervention_id: number;
    url: string;
    order: number;
    created_at: string;
}

export interface CreateInterventionRequest {
    service_id: number;
    address_id: number;
    title: string;
    description: string;
    price?: number;
    image_1?: File;
    image_2?: File;
    image_3?: File;
}

// Devis Types
export enum DevisStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REVISED = 'revised',
    REJECTED = 'rejected'
}

export interface Devis {
    id: number;
    intervention_id: number;
    professional_id: number;
    price: number;
    status: DevisStatus;
    created_at: string;
    updated_at: string;
    notes?: string;

    intervention?: Intervention;
    professional?: Professional;
}

// Reclamation Types
export interface Reclamation {
    id: number;
    intervention_id: number;
    user_id: number;
    user_type: UserType;
    motif: string;
    description: string;
    files: ReclamationFile[];
    status: 'pending' | 'in_review' | 'resolved' | 'rejected';
    resolution?: string;
    resolved_at?: string;
    created_at: string;
    updated_at: string;

    intervention?: Intervention;
    user?: User;
}

export interface ReclamationFile {
    id: number;
    reclamation_id: number;
    url: string;
    file_name: string;
    mime_type: string;
    created_at: string;
}

export interface CreateReclamationRequest {
    intervention_id: number;
    motif: string;
    description: string;
    files?: File[];
}

// Rating Types
export interface Rating {
    id: number;
    intervention_id: number;
    client_id: number;
    professional_id: number;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
    updated_at: string;

    client?: Client;
    professional?: Professional;
    intervention?: Intervention;
}

export interface CreateRatingRequest {
    intervention_id: number;
    rating: number;
    comment?: string;
}

// Notification Types
export interface Notification {
    id: number;
    user_id: number;
    user_type: UserType;
    title: string;
    message: string;
    type: 'intervention' | 'devis' | 'reclamation' | 'payment' | 'system';
    data?: Record<string, any>;
    read: boolean;
    created_at: string;
    read_at?: string;
}

// Payment Types
export interface PaymentIntent {
    id: string;
    client_secret: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
    intervention_id: number;
    created_at: string;
}

export interface Payment {
    id: number;
    intervention_id: number;
    client_id: number;
    professional_id: number;
    amount: number;
    fee: number;
    net_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    payment_intent_id: string;
    stripe_charge_id?: string;
    receipt_url?: string;
    created_at: string;
    updated_at: string;
}

// Professional Location Types
export interface ProfessionalLocation {
    professional_id: number;
    latitude: number;
    longitude: number;
    online: boolean;
    last_seen: string;
}

export interface ProfessionalSearchRequest {
    latitude: number;
    longitude: number;
    service_id: number;
    distance?: number;
}

export interface ProfessionalZoneSearchRequest {
    zone_id: number;
    latitude: number;
    longitude: number;
    distance: number;
}