import type { Document, DocumentType } from '@store/api/api.types';

export const PROFESSIONAL_DOCUMENTS: Array<{
    name: DocumentType;
    title: string;
    description: string;
    icon: 'fa-id-card' | 'fa-home' | 'fa-building' | 'fa-credit-card';
}> = [
    { name: 'identity_front', title: "Pièce d’identité recto", description: 'Carte nationale ou titre de séjour', icon: 'fa-id-card' },
    { name: 'identity_back', title: "Pièce d’identité verso", description: 'Le verso de votre pièce d’identité', icon: 'fa-id-card' },
    { name: 'proof_of_address', title: 'Justificatif de domicile', description: 'Facture ou attestation de moins de 3 mois', icon: 'fa-home' },
    { name: 'kbis', title: 'Extrait Kbis', description: 'Document officiel de votre entreprise', icon: 'fa-building' },
    { name: 'rib', title: 'Relevé d’identité bancaire', description: 'Pour recevoir vos paiements', icon: 'fa-credit-card' },
];

export const getDocumentForType = (documents: Document[], name: DocumentType) =>
    documents.find(document => document.name === name);

export const getDocumentProgress = (documents: Document[]) => ({
    completed: PROFESSIONAL_DOCUMENTS.filter(item => getDocumentForType(documents, item.name)?.status === 'approved').length,
    total: PROFESSIONAL_DOCUMENTS.length,
});
