import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import Text from '@components/Text';
import { Colors } from '@utils/constant';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontPixel,
    WIDTH_SCREEN,
} from '@utils/normalizedCss';
import { Button } from '@components/Button/Button';
import CustomModal from './CustomModal';
import SvgIcon, { IconName } from '@components/Icon/SvgIcon';

interface DialogModalProps {
    /** Controls modal visibility */
    visible: boolean;
    /** Callback when modal should close */
    onRequestClose: () => void;
    /** Dialog type (affects icon and colors) */
    type?: 'success' | 'error' | 'warning' | 'info' | 'custom';
    /** Dialog title (optional) */
    title?: string;
    /** Dialog message */
    message?: string;
    /** Custom icon name (overrides type-based icon) */
    iconName?: string;
    /** Icon size (default: fontPixel(24)) */
    iconSize?: number;
    /** Icon color (default: based on type) */
    iconColor?: string;
    /** Icon background color (default: based on type) */
    iconBackground?: string;
    /** Logo icon name (default: "logoMedium") */
    logoIcon?: string;
    /** Logo size (default: horizontalScale(180)) */
    logoSize?: number;
    /** Primary action button title (default: "Ok") */
    primaryButtonTitle?: string;
    /** Secondary action button title (optional) */
    secondaryButtonTitle?: string;
    /** Callback for primary button press */
    onPrimaryPress?: () => void;
    /** Callback for secondary button press */
    onSecondaryPress?: () => void;
    /** Whether to show close button (default: true) */
    showCloseButton?: boolean;
    /** Animation type (default: "fade") */
    animationType?: 'none' | 'slide' | 'fade';
    /** Modal position (default: "center") */
    position?: 'center' | 'top' | 'bottom';
    /** Modal width (default: horizontalScale(320)) */
    width?: number;
    /** Modal max width (default: horizontalScale(400)) */
    maxWidth?: number;
    /** Whether clicking overlay closes modal (default: false) */
    closeOnOverlayClick?: boolean;
    /** Custom overlay opacity (default: 0.5) */
    overlayOpacity?: number;
    /** Custom callbacks */
    onShow?: () => void;
    onHide?: () => void;
    /** Auto-hide after delay (in milliseconds) */
    autoHideDuration?: number;
    /** Whether to show loading state on primary button */
    isLoading?: boolean;
}

const DialogModal: React.FC<DialogModalProps> = ({
    visible,
    onRequestClose,
    type = 'success',
    title,
    message = 'Votre demande a été envoyée avec succès',
    iconName,
    iconSize = fontPixel(24),
    iconColor,
    iconBackground,
    logoIcon = 'logoMedium',
    logoSize = horizontalScale(180),
    primaryButtonTitle = 'Ok',
    secondaryButtonTitle,
    onPrimaryPress,
    onSecondaryPress,
    showCloseButton = true,
    animationType = 'fade',
    position = 'center',
    width = horizontalScale(320),
    maxWidth = horizontalScale(400),
    closeOnOverlayClick = false,
    overlayOpacity = 0.5,
    onShow,
    autoHideDuration,
    isLoading = false,
}) => {
    useEffect(() => {
        if (visible && autoHideDuration) {
            const timer = setTimeout(() => {
                onRequestClose();
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [visible, autoHideDuration, onRequestClose]);

    // Get type-based configurations
    const getTypeConfig = () => {
        const configs = {
            success: {
                icon: iconName || 'faCheck',
                iconColor: iconColor || Colors.positive,
                iconBackground: iconBackground || Colors.positiveLight,
                titleColor: Colors.positive,
            },
            error: {
                icon: iconName || 'error',
                iconColor: iconColor || Colors.danger,
                iconBackground: iconBackground || Colors.dangerLight,
                titleColor: Colors.danger,
            },
            warning: {
                icon: iconName || 'warning',
                iconColor: iconColor || Colors.warning,
                iconBackground: iconBackground || Colors.warningLight,
                titleColor: Colors.warning,
            },
            info: {
                icon: iconName || 'info',
                iconColor: iconColor || Colors.orange,
                iconBackground: iconBackground || Colors.orangeLight,
                titleColor: Colors.orange,
            },
            custom: {
                icon: iconName || 'info',
                iconColor: iconColor || Colors.positive,
                iconBackground: iconBackground || Colors.positiveLight,
                titleColor: Colors.positive,
            },
        };

        return configs[type];
    };


    const typeConfig = getTypeConfig();

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        } else {
            onRequestClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        }
    };

    return (
        <CustomModal
            visible={visible}
            onRequestClose={onRequestClose}
            animationType={animationType}
            position={position}
            closeOnOverlayClick={closeOnOverlayClick}
            overlayOpacity={overlayOpacity}
            overlayColor={Colors.overlay || Colors.black}
            onShow={onShow}
        >
            <ModalContainer
                width={Math.min(width, maxWidth)}
                screenWidth={WIDTH_SCREEN}
            >
                {showCloseButton && (
                    <CloseButton onPress={onRequestClose}>
                        <SvgIcon
                            name="delete"
                            size={fontPixel(20)}
                            color={Colors.text.secondary}
                        />
                    </CloseButton>
                )}

                <IconContainer backgroundColor={typeConfig.iconBackground}>
                    <SvgIcon
                        name={typeConfig.icon as IconName}
                        size={iconSize}
                        color={typeConfig.iconColor}
                    />
                </IconContainer>

                {title && (
                    <TitleText
                        variant="bold"
                        numberOfLines={2}
                        color={typeConfig.titleColor}
                    >
                        {title}
                    </TitleText>
                )}

                <LogoContainer>
                    <SvgIcon
                        name={logoIcon as IconName}
                        size={logoSize}
                        color={Colors.orange}
                    />
                </LogoContainer>

                <MessageContainer>
                    <MessageText
                        variant="medium"
                        numberOfLines={4}
                        screenWidth={WIDTH_SCREEN}
                    >
                        {message}
                    </MessageText>
                </MessageContainer>

                <ButtonContainer hasSecondary={!!secondaryButtonTitle}>
                    {secondaryButtonTitle && (
                        <SecondaryButton
                            title={secondaryButtonTitle}
                            variant="outline"
                            onPress={handleSecondaryPress}
                            disabled={isLoading}
                            minWidth={horizontalScale(100)}
                        />
                    )}
                    <PrimaryButton
                        title={primaryButtonTitle}
                        variant="primary"
                        onPress={handlePrimaryPress}
                        loading={isLoading}
                        disabled={isLoading}
                        minWidth={horizontalScale(100)}
                    />
                </ButtonContainer>
            </ModalContainer>
        </CustomModal>
    );
};

// Styled Components
const ModalContainer = styled.View<{
    width: number;
    screenWidth: number;
}>`
  width: ${({ width }) => width}px;
  max-width: 90%;
  background-color: ${Colors.background.paper || Colors.white};
  border-radius: ${moderateScale(16)}px;
  padding: ${verticalScale(24)}px ${horizontalScale(20)}px;
  align-items: center;
  elevation: 8;
  shadow-color: ${Colors.shadow || Colors.black};
  shadow-offset: 0px ${verticalScale(4)}px;
  shadow-opacity: 0.3;
  shadow-radius: ${moderateScale(5)}px;
  margin-horizontal: ${({ screenWidth }) => screenWidth * 0.05}px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: ${verticalScale(16)}px;
  right: ${horizontalScale(16)}px;
  z-index: 10;
  padding: ${moderateScale(8)}px;
`;

const IconContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: ${verticalScale(60)}px;
  height: ${verticalScale(60)}px;
  border-radius: ${verticalScale(30)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${verticalScale(16)}px;
  elevation: 4;
  shadow-color: ${({ backgroundColor }) => backgroundColor};
  shadow-offset: 0px ${verticalScale(2)}px;
  shadow-opacity: 0.4;
  shadow-radius: ${moderateScale(3)}px;
`;

const TitleText = styled(Text) <{ color: string }>`
  font-size: ${fontPixel(20)}px;
  text-align: center;
  margin-bottom: ${verticalScale(12)}px;
  color: ${({ color }) => color};
  line-height: ${fontPixel(28)}px;
  font-weight: 700;
`;

const LogoContainer = styled.View`
  height: ${verticalScale(80)}px;
  justify-content: center;
  align-items: center;
  margin-vertical: ${verticalScale(16)}px;
`;

const MessageContainer = styled.View`
  margin-vertical: ${verticalScale(16)}px;
  width: 100%;
`;

const MessageText = styled(Text) <{ screenWidth: number }>`
  text-align: center;
  color: ${Colors.text.secondary || Colors.gray[600]};
  line-height: ${fontPixel(22)}px;
  font-size: ${fontPixel(16)}px;
  padding-horizontal: ${({ screenWidth }) => screenWidth * 0.02}px;
`;

const ButtonContainer = styled.View<{ hasSecondary: boolean }>`
  flex-direction: ${({ hasSecondary }) => hasSecondary ? 'row' : 'column'};
  justify-content: center;
  width: 100%;
  margin-top: ${verticalScale(20)}px;
  gap: ${horizontalScale(12)}px;
`;

const PrimaryButton = styled(Button) <{ minWidth: number }>`
  flex: 1;
  min-width: ${({ minWidth }) => minWidth}px;
  height: ${verticalScale(48)}px;
`;

const SecondaryButton = styled(Button) <{ minWidth: number }>`
  flex: 1;
  min-width: ${({ minWidth }) => minWidth}px;
  height: ${verticalScale(48)}px;
`;

// Export different variants for convenience
export const SuccessDialog = (props: Omit<DialogModalProps, 'type'>) => (
    <DialogModal type="success" {...props} />
);

export const ErrorDialog = (props: Omit<DialogModalProps, 'type'>) => (
    <DialogModal type="error" {...props} />
);

export const WarningDialog = (props: Omit<DialogModalProps, 'type'>) => (
    <DialogModal type="warning" {...props} />
);

export const InfoDialog = (props: Omit<DialogModalProps, 'type'>) => (
    <DialogModal type="info" {...props} />
);

export default DialogModal;