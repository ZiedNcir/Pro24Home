import AsyncStorage from '@react-native-async-storage/async-storage';

const photoKey = (userId: number) => `profile-photo:v1:${userId}`;

export const createProfilePhoto = (asset: { base64?: string; type?: string }): string => {
    const type = asset.type || 'image/jpeg';
    if (!asset.base64 || asset.base64.length > 750_000 || !type.startsWith('image/')) {
        throw new Error('Invalid profile photo');
    }
    return `data:${type};base64,${asset.base64}`;
};

export const readProfilePhoto = (userId: number): Promise<string | null> => AsyncStorage.getItem(photoKey(userId));

export const saveProfilePhoto = (userId: number, photo: string): Promise<void> => AsyncStorage.setItem(photoKey(userId), photo);
