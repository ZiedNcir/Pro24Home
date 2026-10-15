import { UserType } from '@entities/user/model';
import type { AuthResponse } from '@entities/user/model';
import { PROFESSIONAL_DOCUMENTS } from '@roles/professional/documents/model/professional-documents';

export type HomeRoute =
    | 'Tabs'
    | 'ProfessionnelHome'
    | 'AccountPendingScreen'
    | 'Documents'
    | 'ProfessionalVerificationPending';
export type AuthResponseLike = Partial<AuthResponse> & { data?: Partial<AuthResponse> };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const isInactiveAuthResponse = (response: unknown): boolean => {
    if (!isRecord(response)) return false;
    if (response.is_active === 0 || response.is_active === '0' || response.is_active === false) return true;

    if (isRecord(response.data)) {
        if (response.data.is_active === 0 || response.data.is_active === '0' || response.data.is_active === false) return true;
        return isRecord(response.data.data)
            && (response.data.data.is_active === 0 || response.data.data.is_active === '0' || response.data.data.is_active === false);
    }

    return false;
};

export const getHomeRouteFromAuthResponse = (
    response: AuthResponseLike,
    fallbackRole: 'client' | 'professional' = 'client',
): HomeRoute => {
    const payload = response.data && typeof response.data === 'object'
        ? { ...response, ...response.data }
        : response;

    const accountStatus = payload.is_active as unknown;
    const userType = payload.user?.type ?? fallbackRole;
    const isActive = accountStatus !== 0 && accountStatus !== '0' && accountStatus !== false;

    if (userType === UserType.PROFESSIONAL) {
        const documents = payload.user?.documents;
        const submittedDocuments = Array.isArray(documents) ? documents : [];
        const hasRejectedRequiredDocument = submittedDocuments.some(document =>
            PROFESSIONAL_DOCUMENTS.some(requiredDocument => requiredDocument.name === document.name)
                && document.status === 'rejected',
        );
        const hasAllRequiredDocuments = !hasRejectedRequiredDocument && PROFESSIONAL_DOCUMENTS.every(requiredDocument =>
            submittedDocuments.some(document =>
                document.name === requiredDocument.name && document.status !== 'rejected',
            ),
        );

        if (!hasAllRequiredDocuments) return 'Documents';

        const allDocumentsApproved = PROFESSIONAL_DOCUMENTS.every(requiredDocument =>
            submittedDocuments.some(document =>
                document.name === requiredDocument.name && document.status === 'approved',
            ),
        );

        return isActive && allDocumentsApproved
            ? 'ProfessionnelHome'
            : 'ProfessionalVerificationPending';
    }

    if (!isActive) return 'AccountPendingScreen';
    return 'Tabs';
};
