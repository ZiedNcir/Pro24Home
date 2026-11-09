import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession } from '../src/core/session/session-storage';
import { createProfilePhoto, readProfilePhoto, saveProfilePhoto } from '../src/entities/user/model/profile-photo';

beforeEach(async () => { await AsyncStorage.clear(); });

test('stores image bytes instead of a temporary picker file', () => {
    expect(createProfilePhoto({ base64: 'YWJj', type: 'image/jpeg' })).toBe('data:image/jpeg;base64,YWJj');
    expect(() => createProfilePhoto({})).toThrow();
});
test('retains the profile photo across logout for the same account only', async () => {
    const photo = createProfilePhoto({ base64: 'YWJj', type: 'image/jpeg' });
    await saveProfilePhoto(1, photo);
    await clearSession();
    expect(await readProfilePhoto(1)).toBe(photo);
    expect(await readProfilePhoto(2)).toBeNull();
});
test('replaces the existing photo for the account', async () => {
    await saveProfilePhoto(1, 'data:image/jpeg;base64,YWJj');
    await saveProfilePhoto(1, 'data:image/jpeg;base64,ZGVm');
    expect(await readProfilePhoto(1)).toBe('data:image/jpeg;base64,ZGVm');
});
test('rejects invalid or oversized image data', () => {
    expect(() => createProfilePhoto({ base64: 'abc', type: 'text/plain' })).toThrow();
    expect(() => createProfilePhoto({ base64: 'A'.repeat(750001), type: 'image/jpeg' })).toThrow();
});
test('reports storage failure without replacing the previous photo', async () => {
    await saveProfilePhoto(1, 'data:image/jpeg;base64,YWJj');
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Disk full'));
    await expect(saveProfilePhoto(1, 'data:image/jpeg;base64,ZGVm')).rejects.toThrow('Disk full');
    expect(await readProfilePhoto(1)).toBe('data:image/jpeg;base64,YWJj');
});
