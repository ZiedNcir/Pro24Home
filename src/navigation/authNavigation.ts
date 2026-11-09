import { isUnverifiedAccount } from '@entities/user/model/account-status';
import { UserType } from '@entities/user/model';
import type { AuthResponse } from '@entities/user/model';
import { PROFESSIONAL_DOCUMENTS, getDocumentForType, getDocumentSubmissionProgress } from '@roles/professional/documents/model/professional-documents';

export type HomeRoute =
    | 'Tabs'
    | 'ProfessionnelHome'
    | 'AccountPendingScreen'
    | 'Documents'
    | 'ProfessionalVerificationPending'
    | 'VerifyScreen';
export type AuthResponseLike = Partial<AuthResponse> & { data?: Partial<AuthResponse> };

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

export const isInactiveAuthResponse = (response: unknown): boolean => {
    let payload = response;
    for (let depth = 0; depth < 4 && isRecord(payload); depth++) {
        const status = payload.is_active ?? (isRecord(payload.user) ? payload.user.is_active : undefined);
        if (status === 0 || status === '0' || status === false) return true;
        payload = payload.data;
    }
    return false;
};

export const getHomeRouteFromAuthResponse = (
    response: AuthResponseLike,
    fallbackRole: 'client' | 'professional' = 'client',
    documentsUploadFinished = false,
): HomeRoute => {
    const payload = response.data && typeof response.data === 'object'
        ? { ...response, ...response.data }
        : response;

    const accountStatus = (payload.is_active ?? payload.user?.is_active) as unknown;
    const userType = payload.user?.type ?? fallbackRole;
    const isActive = accountStatus !== 0 && accountStatus !== '0' && accountStatus !== false;

    if (userType === UserType.PROFESSIONAL) {
        const documents = payload.user?.documents;
        const submittedDocuments = Array.isArray(documents) ? documents : [];
        const hasRejectedDocument = PROFESSIONAL_DOCUMENTS.some(required => getDocumentForType(submittedDocuments, required.name)?.status === 'rejected');
        if (hasRejectedDocument) return 'Documents';
        if (payload.user && (accountStatus === true || accountStatus === 1 || accountStatus === '1')) return 'ProfessionnelHome';
        if (!documentsUploadFinished && !getDocumentSubmissionProgress(submittedDocuments).canContinue) return 'Documents';
        const allDocumentsApproved = PROFESSIONAL_DOCUMENTS.every(requiredDocument =>
            getDocumentForType(submittedDocuments, requiredDocument.name)?.status === 'approved',
        );

        return isActive && allDocumentsApproved
            ? 'ProfessionnelHome'
            : 'ProfessionalVerificationPending';
    }

    if (isUnverifiedAccount(payload)) return 'VerifyScreen';
    if (!isActive) return 'AccountPendingScreen';
    return 'Tabs';
};
