// utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermissions = async (): Promise<void> => {
    try {
        if (Platform.OS === 'android') {
            // Request camera and storage permissions for Android
            const permissions = [
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ];

            if (Platform.Version >= 33) {
                // Android 13+ needs different permissions
                permissions.push(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                );
            }

            const granted = await PermissionsAndroid.requestMultiple(permissions);

            Object.entries(granted).forEach(([permission, result]) => {
                console.log(
                    `${permission}: ${result === PermissionsAndroid.RESULTS.GRANTED ? 'GRANTED' : 'DENIED'}`
                );
            });

            // Request location permissions if needed
            const locationPermissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ];

            const locationGranted = await PermissionsAndroid.requestMultiple(locationPermissions);

            Object.entries(locationGranted).forEach(([permission, result]) => {
                console.log(
                    `${permission}: ${result === PermissionsAndroid.RESULTS.GRANTED ? 'GRANTED' : 'DENIED'}`
                );
            });

        } else if (Platform.OS === 'ios') {
            // Request permissions for iOS
            const permissions = [
                { permission: PERMISSIONS.IOS.CAMERA, name: 'Camera' },
                { permission: PERMISSIONS.IOS.PHOTO_LIBRARY, name: 'Photo Library' },
                { permission: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, name: 'Location' },
            ];

            for (const { permission, name } of permissions) {
                try {
                    const result = await request(permission);
                    console.log(`${name} permission: ${result === RESULTS.GRANTED ? 'GRANTED' : 'DENIED'}`);
                } catch (error) {
                    console.error(`Error requesting ${name} permission:`, error);
                }
            }
        }

        // Request notification permission (handled by OneSignal on iOS)
        if (Platform.OS === 'android') {
            const notificationPermission = await request(PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH);
            console.log(
                `Notification permission: ${notificationPermission === RESULTS.GRANTED ? 'GRANTED' : 'DENIED'}`
            );
        }

    } catch (error) {
        console.error('Permission request error:', error);
        throw error;
    }
};

export const checkPermissions = async (): Promise<Record<string, string>> => {
    const status: Record<string, string> = {};

    try {
        if (Platform.OS === 'android') {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ];

            for (const permission of permissions) {
                const result = await PermissionsAndroid.check(permission);
                status[permission] = result ? 'GRANTED' : 'DENIED';
            }
        } else if (Platform.OS === 'ios') {
            // iOS permission checks would go here
        }
    } catch (error) {
        console.error('Error checking permissions:', error);
    }

    return status;
};

export const hasRequiredPermissions = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            const requiredPermissions = [
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ];

            for (const permission of requiredPermissions) {
                const result = await PermissionsAndroid.check(permission);
                if (!result) return false;
            }
        }
        return true;
    } catch (error) {
        console.error('Error checking required permissions:', error);
        return false;
    }
};