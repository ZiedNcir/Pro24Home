import React, { useCallback } from 'react';
import {
    Modal,
    ModalProps,
    TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';

interface CustomModalProps extends Partial<ModalProps> {
    /** Controls modal visibility */
    visible: boolean;
    /** Callback when modal should close */
    onRequestClose: () => void;
    /** Modal content */
    children: React.ReactNode;
    /** Clicking overlay closes modal (default: true) */
    closeOnOverlayClick?: boolean;
    /** Animation type (default: 'fade') */
    animationType?: 'none' | 'slide' | 'fade';
    /** Overlay opacity (default: 0.5) */
    overlayOpacity?: number;
    /** Overlay color (default: black) */
    overlayColor?: string;
    /** Modal position (default: 'center') */
    position?: 'center' | 'top' | 'bottom' | 'fullScreen';
    /** Custom container style */
    containerStyle?: object;
    /** Custom content style */
    contentStyle?: object;
    /** Prevent keyboard dismiss (default: false) */
    preventKeyboardDismiss?: boolean;
    /** Status bar style (iOS only) */
    statusBarTranslucent?: boolean;
    /** Handle hardware back button (Android only) */
    hardwareAccelerated?: boolean;
}

// Styled Components
const Overlay = styled.Pressable<{
    opacity: number;
    color: string;
    position: string;
}>`
  flex: 1;
  background-color: ${({ color, opacity }) => `rgba(${hexToRgb(color)}, ${opacity})`};
  justify-content: ${({ position }) => {
        switch (position) {
            case 'top': return 'flex-start';
            case 'bottom': return 'flex-end';
            case 'center': return 'center';
            case 'fullScreen': return 'flex-start';
            default: return 'center';
        }
    }};
  align-items: ${({ position }) => position === 'fullScreen' ? 'stretch' : 'center'};
  padding: ${({ position }) => position === 'fullScreen' ? '0px' : '20px'};
`;

const ModalContent = styled.View<{
    position: string;
}>`
  background-color: ${({ theme }) => theme?.colors?.background || '#FFFFFF'};
  border-radius: ${({ position }) => position === 'fullScreen' ? '0px' : '12px'};
  width: ${({ position }) => {
        switch (position) {
            case 'fullScreen': return '100%';
            case 'center': return '90%';
            default: return '100%';
        }
    }};
  max-width: ${({ position }) => position === 'center' ? '400px' : '100%'};
  max-height: ${({ position }) => position === 'fullScreen' ? '100%' : '90%'};
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

// Helper function to convert hex to rgba
const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1] as string, 16)}, ${parseInt(result[2] as string, 16)}, ${parseInt(result[3] as string, 16)}`
        : '0, 0, 0';
};

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onRequestClose,
    children,
    closeOnOverlayClick = true,
    animationType = 'fade',
    overlayOpacity = 0.5,
    overlayColor = '#000000',
    position = 'center',
    containerStyle,
    contentStyle,
    preventKeyboardDismiss = false,
    statusBarTranslucent = true,
    hardwareAccelerated = true,
    ...modalProps
}) => {
    const handleOverlayPress = useCallback(() => {
        if (closeOnOverlayClick) {
            onRequestClose();
        }
    }, [closeOnOverlayClick, onRequestClose]);

    const handleContentPress = useCallback((e: any) => {
        // Prevent overlay click when clicking modal content
        e.stopPropagation();
    }, []);

    return (
        <Modal
            transparent={true}
            animationType={animationType}
            visible={visible}
            onRequestClose={onRequestClose}
            statusBarTranslucent={statusBarTranslucent}
            hardwareAccelerated={hardwareAccelerated}
            presentationStyle={position === 'fullScreen' ? 'fullScreen' : 'overFullScreen'}
            {...modalProps}
        >
            <TouchableWithoutFeedback
                onPress={handleOverlayPress}
                disabled={!closeOnOverlayClick || preventKeyboardDismiss}
                accessible={false}
            >
                <Overlay
                    opacity={overlayOpacity}
                    color={overlayColor}
                    position={position}
                    style={containerStyle}
                >
                    <TouchableWithoutFeedback onPress={handleContentPress}>
                        <ModalContent
                            position={position}
                            style={[
                                position === 'bottom' && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                                position === 'top' && { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                                contentStyle,
                            ]}
                        >
                            {children}
                        </ModalContent>
                    </TouchableWithoutFeedback>
                </Overlay>
            </TouchableWithoutFeedback>
        </Modal>
    );
};


export default CustomModal;