import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession } from '../src/core/session/session-storage';
import {
    readLocalInterventions, saveLocalIntervention, removeLocalIntervention,
    isNoProfessionalResponse, submitInterventionRequest,
} from '../src/entities/intervention/model/local-interventions';

const record = {
    id: 'local-123', createdAt: '2026-10-27T10:00:00.000Z',
    payload: { service_id: 1, address_id: 2, title: 'Fuite', description: 'Cuisine', price: 50 },
    snapshot: { serviceName: 'Plomberie', scheduledDate: '2026-10-28T10:00:00.000Z' },
};
let nextRecord = 0;
beforeEach(async () => { await AsyncStorage.clear(); record.id = `local-test-${++nextRecord}`; });

test('retains the complete request after logout for the same account only', async () => {
    await saveLocalIntervention(1, record);
    await clearSession();
    expect(await readLocalInterventions(1)).toEqual([record]);
    expect(await readLocalInterventions(2)).toEqual([]);
});
test('retries update the existing record and successful removal keeps other requests', async () => {
    await Promise.all([saveLocalIntervention(1, record), saveLocalIntervention(1, { ...record, id: 'other' })]);
    await saveLocalIntervention(1, { ...record, payload: { ...record.payload, price: 60 } });
    expect(await readLocalInterventions(1)).toHaveLength(2);
    await removeLocalIntervention(1, record.id);
    expect((await readLocalInterventions(1)).map(item => item.id)).toEqual(['other']);
});
test('does not overwrite unreadable storage', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce('{broken');
    await expect(saveLocalIntervention(1, record)).rejects.toThrow();
});
test.each([
    { data: { code: 'NO_PROFESSIONAL_AVAILABLE' }, status: 422 },
    { data: { message: 'Aucun professionnel disponible dans votre zone' }, status: 404 },
    { success: false, message: 'No professionals are online' },
])('recognizes explicit availability rejection: %j', value => {
    expect(isNoProfessionalResponse(value)).toBe(true);
});
test.each([
    { status: 'FETCH_ERROR', error: 'Network request failed' },
    { status: 401, data: { message: 'No professional available' } },
    { status: 422, data: { message: 'Invalid address' } },
    { message: 'Professional not found' },
    { message: 'No professional available', success: true, data: { id: 25 } },
])('does not treat other failures or created requests as unavailable: %j', value => {
    expect(isNoProfessionalResponse(value)).toBe(false);
});
test('saves rejected unavailable requests and deduplicates subsequent retries', async () => {
    const submit = async () => { throw { status: 422, data: { code: 'NO_PROFESSIONAL_AVAILABLE' } }; };
    const options = { userId: 1, record, submit };
    expect(await submitInterventionRequest(options)).toBe('unavailable');
    expect(await submitInterventionRequest(options)).toBe('unavailable');
    expect(await readLocalInterventions(1)).toEqual([record]);
});
test('handles HTTP success envelopes reporting unavailable professionals', async () => {
    expect(await submitInterventionRequest({ userId: 1, record, submit: async () => ({ success: false, message: 'Aucun professionnel disponible' }) })).toBe('unavailable');
    expect(await readLocalInterventions(1)).toEqual([record]);
});
test('keeps requests on unrelated failures and removes them after successful creation', async () => {
    await saveLocalIntervention(1, record);
    await expect(submitInterventionRequest({ userId: 1, record, submit: async () => { throw new Error('offline'); } })).rejects.toThrow('offline');
    expect(await readLocalInterventions(1)).toEqual([record]);
    expect(await submitInterventionRequest({ userId: 1, record, submit: async () => ({ data: { id: 25 } }) })).toBe('submitted');
    expect(await readLocalInterventions(1)).toEqual([]);
});
test('does not show success for application-level failures', async () => {
    await expect(submitInterventionRequest({ userId: 1, record, submit: async () => ({ success: false, message: 'Invalid address' }) })).rejects.toThrow('Invalid address');
});

test('displays local records as active with no-professional status', () => {
    const { localInterventionToDisplay } = require('../src/entities/intervention/model/local-interventions');
    const { filterInterventions, getInterventionStatusLabel } = require('../src/entities/intervention/model/intervention-presentation');
    const display = localInterventionToDisplay(record, 1);
    expect(display.localId).toBe(record.id);
    expect(display.scheduled_date).toBe(record.snapshot.scheduledDate);
    expect(filterInterventions([display], 'active')).toEqual([display]);
    expect(filterInterventions([display], 'completed')).toEqual([]);
    expect(getInterventionStatusLabel(display.status)).toBe('Aucun professionnel disponible');
});

test('availability requires an online professional, accepting server-filtered records without a flag', () => {
    const { hasAvailableProfessionals } = require('../src/entities/intervention/model/local-interventions');
    expect(hasAvailableProfessionals([])).toBe(false);
    expect(hasAvailableProfessionals([{ online_status: false }, { online_status: '0' }])).toBe(false);
    expect(hasAvailableProfessionals([{ online_status: true }])).toBe(true);
    expect(hasAvailableProfessionals([{ online_status: 1 }])).toBe(true);
    expect(hasAvailableProfessionals([{ id: 1 }])).toBe(true);
});

test('checks availability before creation and saves the full snapshot when nobody is online', async () => {
    const withAddress = { ...record, snapshot: { ...record.snapshot, address: { id: 2, address: 'Tunis', latitude: 36.8, longitude: 10.1 } } };
    let created = false;
    await submitInterventionRequest({
        userId: 1, record: withAddress,
        findProfessionals: async () => [],
        submit: async () => { created = true; return { data: { id: 25 } }; },
    });
    expect(created).toBe(false);
    expect(await readLocalInterventions(1)).toEqual([withAddress]);
});
test('availability lookup network failure does not save an unavailable request', async () => {
    const withAddress = { ...record, snapshot: { ...record.snapshot, address: { id: 2, latitude: 36.8, longitude: 10.1 } } };
    await expect(submitInterventionRequest({
        userId: 1, record: withAddress,
        findProfessionals: async () => { throw new Error('Network failure'); },
        submit: async () => ({ data: { id: 25 } }),
    })).rejects.toThrow('Network failure');
    expect(await readLocalInterventions(1)).toEqual([]);
});

test('confirmed creation stays successful and cannot be submitted again when local cleanup fails', async () => {
    const cleanupRecord = { ...record, id: 'cleanup-failure' };
    await saveLocalIntervention(1, cleanupRecord);
    const originalSetItem = (AsyncStorage.setItem as jest.Mock).getMockImplementation()!;
    const write = jest.spyOn(AsyncStorage, 'setItem').mockImplementation((key, value) => {
        if (key.startsWith('local_interventions:v1:')) return Promise.reject(new Error('Disk error'));
        return originalSetItem(key, value);
    });
    let creations = 0;
    const options = { userId: 1, record: cleanupRecord, submit: async () => { creations++; return { data: { id: 25 } }; } };
    await expect(submitInterventionRequest(options)).resolves.toBe('submitted');
    expect(await readLocalInterventions(1)).toEqual([]);
    await expect(submitInterventionRequest(options)).resolves.toBe('submitted');
    expect(creations).toBe(1);
    write.mockImplementation(originalSetItem);
});

test('does not claim a request was saved when phone storage rejects the write', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage full'));
    await expect(submitInterventionRequest({
        userId: 1, record, submit: async () => { throw { data: { code: 'NO_PROFESSIONAL_AVAILABLE' } }; },
    })).rejects.toThrow();
    expect(await readLocalInterventions(1)).toEqual([]);
});

test('keeps multiple photo-heavy requests below Android per-item storage limits', async () => {
    const originalSetItem = (AsyncStorage.setItem as jest.Mock).getMockImplementation()!;
    const write = jest.spyOn(AsyncStorage, 'setItem').mockImplementation((key, value) => {
        if (value.length > 2_000_000) return Promise.reject(new Error('Row too big'));
        return originalSetItem(key, value);
    });
    const photo = { uri: `data:image/jpeg;base64,${'A'.repeat(400_000)}`, type: 'image/jpeg', name: 'photo.jpg' };
    const large = { ...record, payload: { ...record.payload, image_1: photo, image_2: photo, image_3: photo } };
    try {
        await saveLocalIntervention(1, large);
        await saveLocalIntervention(1, { ...large, id: `${record.id}-second` });
        expect(await readLocalInterventions(1)).toHaveLength(2);
    } finally { write.mockImplementation(originalSetItem); }
});
