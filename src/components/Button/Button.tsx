import React, { FC, useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import styled from 'styled-components/native';
import { Colors } from '@utils/constant';
import { fontPixel, horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
import Text from '@components/Text';
import { Spinner } from '@components/Modal/AppSpinner';
import SvgIcon, { IconName } from '@components/Icon/SvgIcon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning' | 'positive';
export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ButtonType = 'standard' | 'icon';

export interface ButtonProps extends PressableProps {
    // Content
    title?: string;
    subtitle?: string;

    // State
    loading?: boolean;
    disabled?: boolean;
    pressed?: boolean;

    // Styling
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: ButtonType;
    ghost?: boolean;
    fullWidth?: boolean;
    width?: number | string;
    height?: number | string;
    rounded?: boolean;
    elevated?: boolean;

    // Icons
    icon?: IconName;
    leftIcon?: IconName;
    rightIcon?: IconName;
    iconSize?: number;
    iconColor?: string;

    // Colors
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;

    // Loading
    loadingText?: string;
    hideContentWhenLoading?: boolean;

    // Spinner
    spinnerSize?: 'small' | 'medium' | 'large';
    spinnerColor?: string;
    spinnerType?: 'rotate' | 'pulse' | 'bounce' | 'wave' | 'dots';
}

// Get button dimensions based on size
const getButtonDimensions = (size: ButtonSize, type: ButtonType, fullWidth?: boolean, customWidth?: number | string) => {
    const dimensions = {
        small: {
            height: verticalScale(36),
            minWidth: horizontalScale(80),
            paddingHorizontal: horizontalScale(12),
            fontSize: fontPixel(12),
            iconSize: fontPixel(14),
            borderRadius: moderateScale(6),
            spinnerSize: 'small' as const,
        },
        medium: {
            height: verticalScale(44),
            minWidth: horizontalScale(100),
            paddingHorizontal: horizontalScale(16),
            fontSize: fontPixel(14),
            iconSize: fontPixel(16),
            borderRadius: moderateScale(8),
            spinnerSize: 'small' as const,
        },
        large: {
            height: verticalScale(52),
            minWidth: horizontalScale(120),
            paddingHorizontal: horizontalScale(20),
            fontSize: fontPixel(16),
            iconSize: fontPixel(18),
            borderRadius: moderateScale(10),
            spinnerSize: 'medium' as const,
        },
        xlarge: {
            height: verticalScale(60),
            minWidth: horizontalScale(140),
            paddingHorizontal: horizontalScale(24),
            fontSize: fontPixel(18),
            iconSize: fontPixel(20),
            borderRadius: moderateScale(12),
            spinnerSize: 'medium' as const,
        },
    };

    const base = dimensions[size] || dimensions.medium;

    if (type === 'icon') {
        return {
            ...base,
            width: base.height,
            minWidth: base.height,
            paddingHorizontal: 0,
        };
    }

    // Handle custom width
    if (customWidth) {
        return {
            ...base,
            width: customWidth,
        };
    }

    // Handle fullWidth
    if (fullWidth) {
        return {
            ...base,
            width: '100%',
            minWidth: '100%',
        };
    }

    return base;
};

// Get button colors based on variant and state
const getButtonColors = (
    variant: ButtonVariant,
    pressed: boolean,
    disabled: boolean,
    ghost?: boolean,
    customColors?: {
        color?: string;
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    }
) => {
    if (disabled) {
        return {
            backgroundColor: Colors.gray,
            textColor: Colors.black,
            borderColor: Colors.gray,
            iconColor: Colors.black,
        };
    }

    const baseColors = {
        primary: {
            backgroundColor: Colors.orange,
            textColor: Colors.white,
            borderColor: Colors.orange,
            iconColor: Colors.white,
            pressedBackground: '#E5563D',
        },
        secondary: {
            backgroundColor: Colors.white,
            textColor: Colors.orange,
            borderColor: Colors.orange,
            iconColor: Colors.orange,
            pressedBackground: '#F5F5F5',
        },
        outline: {
            backgroundColor: 'transparent',
            textColor: Colors.orange,
            borderColor: Colors.orange,
            iconColor: Colors.orange,
            pressedBackground: 'rgba(245, 95, 66, 0.1)',
        },
        ghost: {
            backgroundColor: 'transparent',
            textColor: Colors.orange,
            borderColor: 'transparent',
            iconColor: Colors.orange,
            pressedBackground: 'rgba(245, 95, 66, 0.1)',
        },
        danger: {
            backgroundColor: Colors.danger,
            textColor: Colors.white,
            borderColor: Colors.danger,
            iconColor: Colors.white,
            pressedBackground: '#E62C38',
        },
        warning: {
            backgroundColor: Colors.warning,
            textColor: Colors.white,
            borderColor: Colors.warning,
            iconColor: Colors.white,
            pressedBackground: '#E58120',
        },
        positive: {
            backgroundColor: Colors.positive,
            textColor: Colors.white,
            borderColor: Colors.positive,
            iconColor: Colors.white,
            pressedBackground: '#3BC99A',
        },
    };

    const variantColors = baseColors[variant] || baseColors.primary;

    // Override with custom colors if provided
    const colors = {
        backgroundColor: customColors?.backgroundColor ||
            (pressed && variantColors.pressedBackground ? variantColors.pressedBackground : variantColors.backgroundColor),
        textColor: customColors?.textColor || variantColors.textColor,
        borderColor: customColors?.borderColor || variantColors.borderColor,
        iconColor: customColors?.color || customColors?.textColor || variantColors.iconColor,
    };

    // Handle ghost variant for primary color
    if (ghost && variant === 'primary') {
        colors.backgroundColor = pressed ? 'rgba(245, 95, 66, 0.2)' : 'transparent';
        colors.textColor = Colors.orange;
        colors.iconColor = Colors.orange;
        colors.borderColor = 'transparent';
    }

    return colors;
};

// Styled Components
const ButtonContainer = styled(Pressable) <{
    variant: ButtonVariant;
    size: ButtonSize;
    type: ButtonType;
    pressed: boolean;
    disabled: boolean;
    ghost?: boolean;
    fullWidth?: boolean;
    rounded?: boolean;
    elevated?: boolean;
    customWidth?: number | string;
    customHeight?: number | string;
    backgroundColor: string;
    borderColor: string;
}>`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-width: ${({ variant }) => (variant === 'outline' || variant === 'secondary') ? '1.5px' : '0px'};
  border-color: ${({ borderColor }) => borderColor};
  border-radius: ${({ rounded, size, type }) =>
        rounded ? 9999 : getButtonDimensions(size, type).borderRadius}px;
  overflow: hidden;
  
  ${({ size, type, fullWidth, customWidth, customHeight }) => {
        const dims = getButtonDimensions(size, type, fullWidth, customWidth);

        let widthStyle = '';
        if (customWidth) {
            widthStyle = typeof customWidth === 'number' ? `width: ${customWidth}px;` : `width: ${customWidth};`;
        } else if (dims.minWidth) {
            widthStyle = typeof dims.minWidth === 'number' ? `width: ${dims.minWidth}px;` : `width: ${dims.minWidth};`;
        } else if (fullWidth) {
            widthStyle = 'width: 100%;';
        } else if (type !== 'icon') {
            widthStyle = `min-width: ${dims.minWidth}px;`;
        }

        const heightStyle = customHeight
            ? typeof customHeight === 'number'
                ? `height: ${customHeight}px;`
                : `height: ${customHeight};`
            : `height: ${dims.height}px;`;

        return `
      ${heightStyle}
      ${widthStyle}
      padding-horizontal: ${dims.paddingHorizontal}px;
    `;
    }}
  
  ${({ elevated }) => elevated && `
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
  `}
  
  ${({ disabled }) => disabled && 'opacity: 0.6;'}
`;

const ButtonContent = styled.View<{
    loading: boolean;
    hideContentWhenLoading: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  opacity: ${({ loading, hideContentWhenLoading }) =>
        loading && hideContentWhenLoading ? 0 : 1};
`;

const TextContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const TitleText = styled(Text) <{
    size: ButtonSize;
    type: ButtonType;
    textColor: string;
}>`
  font-family: Inter-Medium;
  font-size: ${({ size, type }) => getButtonDimensions(size, type).fontSize}px;
  color: ${({ textColor }) => textColor};
  text-align: center;
  line-height: ${({ size, type }) => getButtonDimensions(size, type).fontSize * 1.2}px;
`;

const SubtitleText = styled(Text) <{
    size: ButtonSize;
    type: ButtonType;
    textColor: string;
}>`
  font-family: Inter-Regular;
  font-size: ${({ size, type }) => getButtonDimensions(size, type).fontSize * 0.75}px;
  color: ${({ textColor }) => textColor};
  text-align: center;
  opacity: 0.8;
  margin-top: ${verticalScale(2)}px;
`;

const IconWrapper = styled.View<{
    position: 'left' | 'right';
    hasText: boolean;
}>`
  ${({ position, hasText }) => {
        if (!hasText) return '';
        return position === 'left'
            ? `margin-right: ${horizontalScale(8)}px;`
            : `margin-left: ${horizontalScale(8)}px;`;
    }}
`;

const LoadingContainer = styled.View<{
    hasText: boolean;
    hideContentWhenLoading: boolean;
}>`
  ${({ hasText, hideContentWhenLoading }) =>
        hasText && !hideContentWhenLoading ? `margin-right: ${horizontalScale(8)}px;` : ''}
  ${({ hideContentWhenLoading }) => hideContentWhenLoading ? 'position: absolute;' : ''}
  align-items: center;
  justify-content: center;
`;

export const Button: FC<ButtonProps> = ({
    // Content
    title,
    subtitle,

    // State
    loading = false,
    disabled = false,

    // Styling
    variant = 'primary',
    size = 'medium',
    type = 'standard',
    ghost = false,
    fullWidth = false,
    width,
    height,
    rounded = false,
    elevated = false,

    // Icons
    icon,
    leftIcon,
    rightIcon,
    iconSize,
    iconColor,

    // Colors
    color,
    backgroundColor,
    borderColor,
    textColor,

    // Loading
    loadingText,
    hideContentWhenLoading = false,

    // Spinner
    //spinnerSize,
    spinnerColor,
    spinnerType = 'dots',

    // Events
    onPressIn,
    onPressOut,
    style,
    ...rest
}) => {
    const [pressed, setPressed] = useState(false);
    const isIconType = type === 'icon';

    // Get button colors
    const buttonColors = getButtonColors(
        variant,
        pressed,
        disabled,
        ghost,
        { color, backgroundColor, borderColor, textColor }
    );

    // Get button dimensions
    const dimensions = getButtonDimensions(size, type, fullWidth, width);

    // Determine which icon to use
    const effectiveLeftIcon = leftIcon || (!rightIcon && icon ? icon : undefined);
    const effectiveRightIcon = rightIcon || (leftIcon && icon ? undefined : icon);

    // Check if button has text content
    const hasText = !isIconType && (!!title || !!subtitle || !!loadingText);
    //const hasLeftIcon = !!effectiveLeftIcon;
    //const hasRightIcon = !!effectiveRightIcon;

    // Get spinner size
    // const calculatedSpinnerSize = dimensions.spinnerSize;

    // Get spinner color based on variant
    const getSpinnerColor = () => {
        if (spinnerColor) return spinnerColor;

        // Choose appropriate spinner color based on button variant
        switch (variant) {
            case 'outline':
            case 'ghost':
                return buttonColors.textColor;
            case 'primary':
            case 'secondary':
            case 'danger':
            case 'warning':
            case 'positive':
            default:
                return buttonColors.iconColor;
        }
    };

    const handlePressIn = (e: any) => {
        if (!disabled && !loading) {
            setPressed(true);
            onPressIn?.(e);
        }
    };

    const handlePressOut = (e: any) => {
        setPressed(false);
        onPressOut?.(e);
    };

    const renderIcon = (iconName?: IconName, position?: 'left' | 'right') => {
        if (!iconName || loading) return null;

        return (
            <IconWrapper position={position!} hasText={hasText}>
                <SvgIcon
                    name={iconName}
                    size={iconSize || dimensions.iconSize}
                    color={iconColor || buttonColors.iconColor}
                />
            </IconWrapper>
        );
    };

    const renderContent = () => {
        if (loading && hideContentWhenLoading) {
            return null;
        }

        return (
            <>
                {renderIcon(effectiveLeftIcon, 'left')}

                {(title || subtitle || loadingText) && (
                    <TextContainer>
                        <TitleText
                            size={size}
                            type={type}
                            textColor={buttonColors.textColor}
                            numberOfLines={1}
                        >
                            {loading && loadingText ? loadingText : title}
                        </TitleText>
                        {subtitle && !loading && (
                            <SubtitleText
                                size={size}
                                type={type}
                                textColor={buttonColors.textColor}
                                numberOfLines={1}
                            >
                                {subtitle}
                            </SubtitleText>
                        )}
                    </TextContainer>
                )}

                {renderIcon(effectiveRightIcon, 'right')}
            </>
        );
    };

    return (
        <ButtonContainer
            variant={variant}
            size={size}
            type={type}
            pressed={pressed}
            disabled={disabled || loading}
            ghost={ghost}
            fullWidth={fullWidth}
            rounded={rounded}
            elevated={elevated}
            customWidth={width}
            customHeight={height}
            backgroundColor={buttonColors.backgroundColor}
            borderColor={buttonColors.borderColor}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={style}
            {...rest}
        >
            <ButtonContent
                loading={loading}
                hideContentWhenLoading={hideContentWhenLoading}
            >
                {loading && (
                    <LoadingContainer
                        hasText={hasText && !hideContentWhenLoading}
                        hideContentWhenLoading={hideContentWhenLoading}
                    >
                        <Spinner
                            animationType={spinnerType}
                            color={getSpinnerColor()}
                            duration={1000} visible={false} onRequestClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}



                        />
                    </LoadingContainer>
                )}

                {renderContent()}
            </ButtonContent>
        </ButtonContainer>
    );
};

// Convenience button components
export const PrimaryButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="primary" {...props} />
);

export const SecondaryButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="secondary" {...props} />
);

export const OutlineButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="outline" {...props} />
);

export const GhostButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="ghost" {...props} />
);

export const DangerButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="danger" {...props} />
);

export const WarningButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="warning" {...props} />
);

export const PositiveButton: FC<Omit<ButtonProps, 'variant'>> = (props) => (
    <Button variant="positive" {...props} />
);

export const IconButton: FC<Omit<ButtonProps, 'type'> & { icon: IconName }> = (props) => (
    <Button type="icon" {...props} />
);

export const SmallButton: FC<Omit<ButtonProps, 'size'>> = (props) => (
    <Button size="small" {...props} />
);

export const LargeButton: FC<Omit<ButtonProps, 'size'>> = (props) => (
    <Button size="large" {...props} />
);

export const XLargeButton: FC<Omit<ButtonProps, 'size'>> = (props) => (
    <Button size="xlarge" {...props} />
);

// Button with linear spinner (default)
export const LoadingButton: FC<ButtonProps> = (props) => (
    <Button spinnerType="dots" {...props} />
);

// Button with circular spinner
export const CircularLoadingButton: FC<ButtonProps> = (props) => (
    <Button spinnerType="rotate" {...props} />
);

// Button with dots spinner
export const DotsLoadingButton: FC<ButtonProps> = (props) => (
    <Button spinnerType="dots" {...props} />
);

export default Button;