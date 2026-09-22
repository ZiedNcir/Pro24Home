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

export const getDocumentForType = (documents: Document[], name: DocumentType) =>
    documents.find(document => document.name === name);

export const getDocumentProgress = (documents: Document[]) => ({
    completed: PROFESSIONAL_DOCUMENTS.filter(item => getDocumentForType(documents, item.name)?.status === 'approved').length,
    total: PROFESSIONAL_DOCUMENTS.length,
});
