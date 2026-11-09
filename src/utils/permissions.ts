import { PermissionsAndroid, Platform } from 'react-native';

// iOS prompts are handled by the native image picker. Android requires an
// explicit request because CAMERA is declared in this application's manifest.
export const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    if (await PermissionsAndroid.check(permission)) return true;
    return await PermissionsAndroid.request(permission) === PermissionsAndroid.RESULTS.GRANTED;
};
