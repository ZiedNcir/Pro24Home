import React, { FC, createContext, useContext } from 'react';
import { ImageSourcePropType } from 'react-native';

export type IconType = 'svg' | 'image' | 'font' | 'component';

export interface IconConfig {
    type: IconType;
    name: string;
    component?: React.ComponentType<any>;
    source?: ImageSourcePropType;
    size?: number;
    color?: string;
}

export interface IconRegistryContextType {
    registerIcon: (name: string, config: IconConfig) => void;
    getIcon: (name: string) => IconConfig | undefined;
    unregisterIcon: (name: string) => void;
}

const IconRegistryContext = createContext<IconRegistryContextType | undefined>(undefined);

export const useIconRegistry = () => {
    const context = useContext(IconRegistryContext);
    if (!context) {
        throw new Error('useIconRegistry must be used within IconRegistryProvider');
    }
    return context;
};

interface IconRegistryProviderProps {
    defaultIcons?: Record<string, IconConfig>;
    children: React.ReactNode;
}

export const IconRegistryProvider: FC<IconRegistryProviderProps> = ({
    defaultIcons = {},
    children,
}) => {
    const [icons, setIcons] = React.useState<Record<string, IconConfig>>(defaultIcons);

    const registerIcon = (name: string, config: IconConfig) => {
        setIcons(prev => ({
            ...prev,
            [name]: config,
        }));
    };

    const getIcon = (name: string) => icons[name];

    const unregisterIcon = (name: string) => {
        setIcons(prev => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [name]: _, ...rest } = prev;
            return rest;
        });
    };

    return (
        <IconRegistryContext.Provider
            value={{ registerIcon, getIcon, unregisterIcon }}
        >
            {children}
        </IconRegistryContext.Provider>
    );
};