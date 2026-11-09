import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ProfessionalUploadAccount { id?: number; email?: string | null }
export interface ProfessionalUploadState { uploaded: string[]; finished: boolean }
interface StoredState extends ProfessionalUploadState { userId?: number }
const emptyState = (): ProfessionalUploadState => ({ uploaded: [], finished: false });
const accountKeys = (account: ProfessionalUploadAccount) => {
    const email = account.email?.trim().toLowerCase();
    return [account.id ? `professional-upload:v1:user:${account.id}` : null,
        email ? `professional-upload:v1:email:${encodeURIComponent(email)}` : null].filter((key): key is string => Boolean(key));
};

export const readProfessionalUploadState = async (account: ProfessionalUploadAccount): Promise<ProfessionalUploadState> => {
    const keys = accountKeys(account);
    if (!keys.length) return emptyState();
    const entries = await AsyncStorage.multiGet(keys);
    for (const [, raw] of entries) {
        if (!raw) continue;
        try {
            const value = JSON.parse(raw) as StoredState;
            if (account.id && value.userId !== account.id) continue;
            if (typeof value.finished === 'boolean' && Array.isArray(value.uploaded) && value.uploaded.every(name => typeof name === 'string')) {
                return { uploaded: value.uploaded, finished: value.finished };
            }
        } catch { /* Ignore invalid local metadata; the server remains authoritative. */ }
    }
    return emptyState();
};

export const hasFinishedProfessionalUpload = async (account: ProfessionalUploadAccount): Promise<boolean> => (
    (await readProfessionalUploadState(account)).finished
);

const writeState = async (account: ProfessionalUploadAccount, state: ProfessionalUploadState): Promise<ProfessionalUploadState> => {
    const keys = accountKeys(account);
    if (!keys.length) throw new Error('Missing professional account');
    const raw = JSON.stringify({ ...state, userId: account.id });
    await AsyncStorage.multiSet(keys.map(key => [key, raw]));
    return state;
};

export const markProfessionalUploadFinished = async (account: ProfessionalUploadAccount, uploaded: readonly string[] = []): Promise<void> => {
    const state = await readProfessionalUploadState(account);
    await writeState(account, { uploaded: Array.from(new Set([...state.uploaded, ...uploaded])), finished: true });
};

export const recordProfessionalDocumentUpload = async (
    account: ProfessionalUploadAccount, name: string, required: readonly string[], knownUploaded: readonly string[] = [], rejected: readonly string[] = [],
): Promise<ProfessionalUploadState> => {
    const previous = await readProfessionalUploadState(account);
    const uploaded = Array.from(new Set([...previous.uploaded.filter(value => !rejected.includes(value)), ...knownUploaded, name])).filter(value => required.includes(value));
    return writeState(account, { uploaded, finished: required.every(value => uploaded.includes(value)) });
};
