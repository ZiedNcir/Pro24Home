import React, { useEffect, useRef } from 'react';
import { Animated, View, Easing, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import CustomModal from './CustomModal';
import { SvgIcon, Text } from '@components';
import type { IconName } from '@components/Icon/SvgIcon';



interface SpinnerProps {
    /** Controls spinner visibility */
    visible: boolean;
    /** Callback when spinner should close (optional) */
    onRequestClose: () => void;
    /** Spinner size (default: 80) */
    size?: number;
    /** Spinner color (default: '#007AFF') */
    color?: string;
    /** Animation type (default: 'rotate') */
    animationType?: 'rotate' | 'pulse' | 'bounce' | 'wave' | 'dots';
    /** Background color for spinner container (default: 'rgba(0, 0, 0, 0.7)') */
    backdropColor?: string;
    /** Whether to show backdrop (default: true) */
    showBackdrop?: boolean;
    /** Custom icon name (default: 'logo') */
    iconName?: string;
    /** Custom message below spinner */
    message?: string;
    /** Message text style */
    messageStyle?: object;
    /** Whether to close on backdrop press (default: false) */
    closeOnBackdropPress?: boolean;
    /** Duration of one animation cycle in milliseconds (default: 2000) */
    duration?: number;
    /** Whether to show loading text (default: false) */
    showLoadingText?: boolean;
    /** Custom loading text (default: 'Loading...') */
    loadingText?: string;
}

// Styled Components
const SpinnerContainer = styled.View<{ showBackdrop: boolean; backdropColor: string }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ showBackdrop, backdropColor }) =>
        showBackdrop ? backdropColor : 'transparent'};
`;

const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
  
`;

const MessageText = styled.Text`
  margin-top: 16px;
  font-size: 14px;
  color: white;
  text-align: center;
  font-weight: 500;
`;

const LoadingDotsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

const Dot = styled(Animated.View) <{ color: string; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ color }) => color};
  margin-horizontal: 4px;
`;

export const Spinner: React.FC<SpinnerProps> = ({
    visible,
    onRequestClose,
    size = 80,
    color = '#007AFF',
    animationType = 'rotate',
    backdropColor = 'rgba(0, 0, 0, 0.7)',
    showBackdrop = true,
    iconName = 'LogoMediumPro24Icon',
    message,
    messageStyle,
    closeOnBackdropPress = false,
    duration = 2000,
    showLoadingText = false,
    loadingText = 'Loading...',
}) => {
    // Animation refs
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const dotAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    // Rotation animation
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Scale animation
    const scaleInterpolate = scaleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    // Bounce animation
    const bounceInterpolate = bounceAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -20, 0],
    });

    useEffect(() => {
        if (!visible) {
            // Stop all animations and reset values
            rotateAnim.stopAnimation();
            scaleAnim.stopAnimation();
            bounceAnim.stopAnimation();
            dotAnims.forEach(anim => anim.stopAnimation());

            // Reset values
            rotateAnim.setValue(0);
            scaleAnim.setValue(1);
            bounceAnim.setValue(0);
            dotAnims.forEach(anim => anim.setValue(0));
            return;
        }

        let animation: Animated.CompositeAnimation;

        switch (animationType) {
            case 'rotate':
                animation = Animated.loop(
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: duration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                );
                break;

            case 'pulse':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.2,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;

            case 'bounce':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(bounceAnim, {
                            toValue: 1,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(bounceAnim, {
                            toValue: 0,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;

            case 'wave':
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(rotateAnim, {
                            toValue: 1,
                            duration: duration,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1.2,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                );
                break;

            case 'dots':
                // Create staggered dot animations
                const dotAnimations = dotAnims.map((anim, index) =>
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(anim, {
                                toValue: 1,
                                duration: 400,
                                easing: Easing.inOut(Easing.ease),
                                useNativeDriver: true,
                                delay: index * 100,
                            }),
                            Animated.timing(anim, {
                                toValue: 0,
                                duration: 400,
                                easing: Easing.inOut(Easing.ease),
                                useNativeDriver: true,
                            }),
                        ])
                    )
                );

                // Start all dot animations
                dotAnimations.forEach(anim => anim.start());

                return () => {
                    dotAnimations.forEach(anim => anim.stop());
                };
        }

        if (animation) {
            animation.start();
        }

        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [visible, animationType, duration, rotateAnim, scaleAnim, bounceAnim, dotAnims]);

    const renderSpinnerContent = () => {
        const dotSize = size / 4;

        switch (animationType) {
            case 'dots':
                return (
                    <LoadingDotsContainer>
                        {dotAnims.map((anim, index) => (
                            <Dot
                                key={`dot-${index}`}
                                color={color}
                                size={dotSize}
                                style={{
                                    transform: [
                                        {
                                            scale: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.5],
                                            }),
                                        },
                                    ],
                                    opacity: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 1],
                                    }),
                                }}
                            />
                        ))}
                    </LoadingDotsContainer>
                );

            default:
                return (
                    <IconContainer>
                        <Animated.View
                            style={{
                                transform: [
                                    ...(animationType === 'rotate' || animationType === 'wave'
                                        ? [{ rotate: rotateInterpolate }]
                                        : []),
                                    ...(animationType === 'pulse' || animationType === 'wave'
                                        ? [{ scale: scaleInterpolate }]
                                        : []),
                                    ...(animationType === 'bounce'
                                        ? [{ translateY: bounceInterpolate }]
                                        : []),
                                ],
                            }}
                        >
                            <SvgIcon
                                name={iconName as IconName}
                                size={size}
                                color={color}
                            />
                        </Animated.View>
                    </IconContainer>
                );
        }
    };

    const modalContent = (
        <SpinnerContainer
            showBackdrop={showBackdrop}
            backdropColor={backdropColor}
        >
            {renderSpinnerContent()}

            {(message || (showLoadingText && loadingText)) && (
                <MessageText style={messageStyle}>
                    {message || loadingText}
                </MessageText>
            )}
        </SpinnerContainer>
    );

    if (showBackdrop) {
        return (
            <CustomModal
                visible={visible}
                onRequestClose={onRequestClose}
                closeOnOverlayClick={closeOnBackdropPress}
                overlayOpacity={0.35}
                overlayColor="#000000"
                position="center"
                animationType="fade"
                preventKeyboardDismiss={true}
            >
                {modalContent}
            </CustomModal>
        );
    }

    // If no backdrop needed, just render the spinner directly
    return visible ? modalContent : null;
};

// Alternative: Using StyleSheet version
export const SimpleSpinner: React.FC<SpinnerProps> = ({
    visible,
    onRequestClose,
    size = 80,
    color = '#007AFF',
    backdropColor = 'rgba(0, 0, 0, 0.7)',
    showBackdrop = true,
    iconName = 'logo',
    message,
}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) {
            rotateAnim.stopAnimation();
            rotateAnim.setValue(0);
            return;
        }

        const animation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [visible, rotateAnim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const content = (
        <View style={[
            styles.container,
            showBackdrop && { backgroundColor: backdropColor }
        ]}>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <SvgIcon name={iconName as IconName} size={size} color={color} />
            </Animated.View>
            {message && <Text style={styles.messageText}>{message}</Text>}
        </View>
    );

    if (showBackdrop) {
        return (
            <CustomModal
                visible={visible}
                onRequestClose={onRequestClose}
                closeOnOverlayClick={false}
            >
                {content}
            </CustomModal>
        );
    }

    return visible ? content : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText: {
        marginTop: 16,
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500' as const,
    },
});