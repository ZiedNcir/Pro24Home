import type { Document, DocumentType } from '@entities/user/model';

export const PROFESSIONAL_DOCUMENTS: Array<{
    name: DocumentType;
    titleKey: string;
    descriptionKey: string;
    icon: 'fa-id-card' | 'fa-home' | 'fa-building' | 'fa-credit-card';
}> = [
    { name: 'identity_front', titleKey: 'professional.documents.identityFront', descriptionKey: 'professional.documents.identityFrontDescription', icon: 'fa-id-card' },
    { name: 'identity_back', titleKey: 'professional.documents.identityBack', descriptionKey: 'professional.documents.identityBackDescription', icon: 'fa-id-card' },
    { name: 'proof_of_address', titleKey: 'professional.documents.proofAddress', descriptionKey: 'professional.documents.proofAddressDescription', icon: 'fa-home' },
    { name: 'kbis', titleKey: 'professional.documents.kbis', descriptionKey: 'professional.documents.kbisDescription', icon: 'fa-building' },
    { name: 'rib', titleKey: 'professional.documents.rib', descriptionKey: 'professional.documents.ribDescription', icon: 'fa-credit-card' },
];

export const getDocumentForType = (documents: Document[], name: DocumentType) => {
    const matches = documents.filter(document => document.name === name);
    const dated = matches.filter(document => Number.isFinite(Date.parse(document.uploaded_at)));
    if (dated.length > 0) {
        return dated.sort((a, b) => Date.parse(b.uploaded_at) - Date.parse(a.uploaded_at) || b.id - a.id)[0];
    }
    // Without upload dates, keep an unresolved rejection visible rather than guessing a newer version.
    return matches.find(document => document.status === 'rejected') || matches[0];
};

export const getDocumentProgress = (documents: Document[]) => ({
    completed: PROFESSIONAL_DOCUMENTS.filter(item => getDocumentForType(documents, item.name)?.status === 'approved').length,
    total: PROFESSIONAL_DOCUMENTS.length,
});

export const getDocumentSubmissionProgress = (documents: Document[]) => {
    const missing = PROFESSIONAL_DOCUMENTS.filter(required => {
        const document = getDocumentForType(documents, required.name);
        return document?.status !== 'pending' && document?.status !== 'approved';
    });
    return {
        submitted: PROFESSIONAL_DOCUMENTS.length - missing.length,
        total: PROFESSIONAL_DOCUMENTS.length,
        canContinue: missing.length === 0,
        nextMissing: missing[0]?.name,
    };
};
