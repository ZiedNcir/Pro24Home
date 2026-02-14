import React, { FC } from 'react';
import SvgIcon, { SvgIconProps } from './SvgIcon';
import AppImage, { AppImageProps } from '../Image/AppImage';


import { useIconRegistry } from './IconRegistry';

export type IconProps = {
    name: string;
    type?: 'svg' | 'image' | 'auto';
    size?: number;
    color?: string;
    width?: number;
    height?: number;
    tintColor?: string;
    style?: any;
    testID?: string;
} & Partial<SvgIconProps> &
    Partial<Omit<AppImageProps, 'source'>>;

const Icon: FC<IconProps> = ({
    name,
    type = 'auto',
    size = 24,
    color,
    width = size,
    height = size,
    tintColor,
    style,
    testID,
    ...rest
}) => {
    const iconRegistry = useIconRegistry();
    const registeredIcon = iconRegistry.getIcon(name);

    // Determine icon type
    const iconType = type === 'auto' ? registeredIcon?.type || 'svg' : type;

    // If registered icon has specific config, use it
    const finalSize = registeredIcon?.size || size;
    const finalColor = color || registeredIcon?.color;

    // Render based on type
    switch (iconType) {
        case 'svg':
            return (
                <SvgIcon
                    testID={testID}
                    size={finalSize}
                    color={finalColor}
                    style={style}
                    {...rest as SvgIconProps}
                />
            );

        case 'image':
            return (
                <AppImage
                    testID={testID}
                    source={registeredIcon?.source || { uri: name }}
                    width={width}
                    height={height}
                    style={style}
                    tintColor={tintColor || finalColor}
                    {...rest as AppImageProps}
                />
            );

        default:
            console.warn(`Icon type "${iconType}" not supported for icon "${name}"`);
            return null;
    }
};

export default Icon;