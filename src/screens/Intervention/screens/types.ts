import { ImageSourcePropType } from 'react-native';

export type InterventionStep = 1 | 2 | 3 | 4;

export type InterventionType = {
    id: number;
    title: string;
    description: string;
    icon: string;
};

export type AddressItem = {
    id: number;
    title: string;
    address: string;
    details?: string;
    isDefault?: boolean;
};

export type UploadedPhoto = {
    id: number;
    image: ImageSourcePropType;
};