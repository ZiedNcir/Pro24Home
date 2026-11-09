import { PermissionsAndroid, Platform } from 'react-native';
import { requestCameraPermission } from '../src/utils/permissions';

describe('contextual camera access', () => {
    const initialOS = Platform.OS;
    afterEach(() => { Object.defineProperty(Platform, 'OS', { configurable: true, value: initialOS }); jest.restoreAllMocks(); });
    test('leaves iOS permission handling to the native camera picker', async () => {
        Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
        const request = jest.spyOn(PermissionsAndroid, 'request');
        expect(await requestCameraPermission()).toBe(true);
        expect(request).not.toHaveBeenCalled();
    });
    test('requests only camera access on Android when needed', async () => {
        Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
        jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
        const request = jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
        expect(await requestCameraPermission()).toBe(true);
        expect(request).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.CAMERA);
    });
    test('does not open the camera when Android permission is denied', async () => {
        Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
        jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
        jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);
        expect(await requestCameraPermission()).toBe(false);
    });
});
