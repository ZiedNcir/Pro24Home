import { getDocumentForType, getDocumentProgress } from '../src/screens/Home/client/utils/professionalDocuments';

describe('professional document progress', () => {
    it('counts only approved documents and resolves a document by type', () => {
        const documents = [
            { id: 1, name: 'identity_front' as const, type: 'img' as const, url: '', uploaded_at: '', status: 'approved' as const },
            { id: 2, name: 'identity_back' as const, type: 'pdf' as const, url: '', uploaded_at: '', status: 'pending' as const },
        ];

        expect(getDocumentForType(documents, 'identity_back')?.id).toBe(2);
        expect(getDocumentProgress(documents)).toEqual({ completed: 1, total: 5 });
    });
});
