import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Address, CreateInterventionRequest, Intervention } from '../../../store/api/api.types';
import { InterventionStatus } from '../../../store/api/api.types';

export class LocalInterventionStorageError extends Error {}

export interface InterventionSnapshot {
    serviceName: string;
    address?: Address;
    scheduledDate?: string;
}

export interface LocalIntervention {
    id: string;
    createdAt: string;
    payload: CreateInterventionRequest;
    snapshot: InterventionSnapshot;
    checkPriceWithProfessional?: boolean;
}

export const hasAvailableProfessionals = (professionals: Array<{ online_status?: unknown; onligne?: unknown }>): boolean => (
    professionals.some(professional => {
        const online = professional.online_status ?? professional.onligne;
        // Some API versions return only eligible professionals, without their status flag.
        return online === undefined || online === true || online === 1 || online === '1' || online === 'true';
    })
);

const storageKey = (userId: number) => `local_interventions:v1:${userId}`;
const recordKey = (userId: number, id: string) => `local_interventions:record:v1:${userId}:${id}`;
const confirmationKey = (userId: number, id: string) => `local_interventions:submitted:${userId}:${id}`;
const confirmedSubmissions = new Set<string>();
const queues = new Map<number, Promise<unknown>>();
const enqueue = <T>(userId: number, operation: () => Promise<T>): Promise<T> => {
    const next = (queues.get(userId) || Promise.resolve()).catch(() => undefined).then(operation);
    queues.set(userId, next);
    next.finally(() => { if (queues.get(userId) === next) queues.delete(userId); }).catch(() => undefined);
    return next;
};

const readIndex = async (userId: number): Promise<string[]> => {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const ids: unknown = JSON.parse(raw);
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Invalid saved intervention index');
    return ids;
};

export const readLocalInterventions = async (userId: number): Promise<LocalIntervention[]> => {
    const ids = await readIndex(userId);
    if (!ids.length) return [];
    const confirmations = await AsyncStorage.multiGet(ids.map(id => confirmationKey(userId, id)));
    const pendingIds = ids.filter((id, index) => !confirmedSubmissions.has(confirmationKey(userId, id)) && confirmations[index]?.[1] !== 'true');
    if (!pendingIds.length) return [];
    const entries = await AsyncStorage.multiGet(pendingIds.map(id => recordKey(userId, id)));
    return entries.map(([, raw], index) => {
        const record = raw ? JSON.parse(raw) : null;
        if (!record || record.id !== pendingIds[index] || typeof record.createdAt !== 'string'
            || typeof record.payload?.title !== 'string' || typeof record.payload?.description !== 'string'
            || typeof record.payload?.service_id !== 'number' || typeof record.payload?.address_id !== 'number'
            || typeof record.snapshot?.serviceName !== 'string') throw new Error('Invalid saved intervention');
        return record as LocalIntervention;
    });
};

export const saveLocalIntervention = (userId: number, record: LocalIntervention) => enqueue(userId, async () => {
    const ids = await readIndex(userId);
    // Separate records keep each photo payload below Android's per-item read limit.
    // Commit the record before its index so readers never see a partial new entry.
    await AsyncStorage.setItem(recordKey(userId, record.id), JSON.stringify(record));
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify([record.id, ...ids.filter(id => id !== record.id)]));
}).catch(() => { throw new LocalInterventionStorageError('Could not save intervention'); });

export const removeLocalIntervention = (userId: number, id: string) => enqueue(userId, async () => {
    const ids = await readIndex(userId);
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(ids.filter(value => value !== id)));
    await AsyncStorage.removeItem(recordKey(userId, id));
});

// Only explicit availability failures qualify. An unassigned created request is still a server request.
export const isNoProfessionalResponse = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    const response = value as { status?: unknown; success?: boolean; id?: unknown; code?: unknown; message?: unknown; data?: { id?: unknown; code?: unknown; message?: unknown } };
    if ([401, 403, 'FETCH_ERROR', 'TIMEOUT_ERROR', 'PARSING_ERROR'].includes(response.status as string | number)) return false;
    if (response.success === true || response.id || response.data?.id) return false;
    const code = String(response.data?.code || response.code || '').toUpperCase();
    if (['NO_PROFESSIONAL', 'NO_PROFESSIONAL_AVAILABLE', 'NO_PROFESSIONAL_ONLINE', 'PROFESSIONAL_UNAVAILABLE'].includes(code)) return true;
    const message = String(response.data?.message || response.message || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return /\b(no|aucun)\b.*\b(professional|professionals|professionnel|professionnels)\b.*\b(available|online|disponible|disponibles|ligne)\b/.test(message);
};

export const submitInterventionRequest = async ({ userId, record, submit, findProfessionals }: {
    userId: number;
    record: LocalIntervention;
    submit: (payload: CreateInterventionRequest) => Promise<unknown>;
    findProfessionals?: (location: { latitude: number; longitude: number; service_id: number }) => Promise<Array<{ online_status?: unknown; onligne?: unknown }>>;
}): Promise<'submitted' | 'unavailable'> => {
    const confirmation = confirmationKey(userId, record.id);
    if (confirmedSubmissions.has(confirmation) || await AsyncStorage.getItem(confirmation) === 'true') return 'submitted';
    let response: unknown;
    try {
        const address = record.snapshot.address;
        if (findProfessionals && address && address.latitude != null && address.longitude != null
            && Number.isFinite(Number(address.latitude)) && Number.isFinite(Number(address.longitude))) {
            const professionals = await findProfessionals({
                latitude: Number(address.latitude), longitude: Number(address.longitude), service_id: record.payload.service_id,
            });
            if (!Array.isArray(professionals)) throw new Error('Invalid professional availability response');
            if (!hasAvailableProfessionals(professionals)) {
                await saveLocalIntervention(userId, record);
                return 'unavailable';
            }
        }
        response = await submit(record.payload);
    } catch (error) {
        if (!isNoProfessionalResponse(error)) throw error;
        await saveLocalIntervention(userId, record);
        return 'unavailable';
    }
    if (isNoProfessionalResponse(response)) {
        await saveLocalIntervention(userId, record);
        return 'unavailable';
    }
    if (response && typeof response === 'object' && 'success' in response && response.success === false) {
        throw new Error(String((response as { message?: string }).message || 'Request failed'));
    }
    // Server creation is terminal. Cleanup must never turn it into a retryable failure.
    confirmedSubmissions.add(confirmation);
    await AsyncStorage.setItem(confirmation, 'true').catch(() => undefined);
    await removeLocalIntervention(userId, record.id).catch(() => undefined);
    return 'submitted';
};

export const localInterventionToDisplay = (record: LocalIntervention, userId: number): Intervention & { localId: string } => ({
    id: 0,
    localId: record.id,
    title: record.payload.title,
    description: record.payload.description,
    price: record.payload.price,
    status: InterventionStatus.NO_PROFESSIONAL,
    service_id: record.payload.service_id,
    sub_service_id: 0,
    address_id: record.payload.address_id,
    client_id: userId,
    requested_date: record.createdAt,
    scheduled_date: record.snapshot.scheduledDate,
    created_at: record.createdAt,
    updated_at: record.createdAt,
    address: record.snapshot.address,
    images: [],
});
