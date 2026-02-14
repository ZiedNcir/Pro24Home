import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import Button, { ButtonProps } from '../Button/Button';

export type ButtonGroupAlignment = 'start' | 'center' | 'end' | 'space-between';
export type ButtonGroupLayout = 'horizontal' | 'vertical';

export interface ButtonGroupProps {
    /** Primary button (required) */
    primaryButton: ButtonProps;
    /** Secondary button (optional) */
    secondaryButton?: ButtonProps;
    /** Alignment of buttons */
    alignment?: ButtonGroupAlignment;
    /** Layout direction */
    layout?: ButtonGroupLayout;
    /** Spacing between buttons */
    spacing?: number;
    /** Whether buttons should fill available space */
    fill?: boolean;
    /** Reverse button order (secondary first) */
    reverse?: boolean;
    /** Style for the container */
    style?: any;
    /** Test ID */
    testID?: string;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
    primaryButton,
    secondaryButton,
    alignment = 'end',
    layout = 'horizontal',
    spacing = 12,
    fill = false,
    reverse = false,
    style,
    testID,
}) => {
    // Prepare buttons array in correct order
    const buttons = [];

    if (reverse && secondaryButton) {
        buttons.push(secondaryButton);
    }

    buttons.push(primaryButton);

    if (!reverse && secondaryButton) {
        buttons.push(secondaryButton);
    }

    return (
        <Container
            alignment={alignment}
            layout={layout}
            spacing={spacing}
            fill={fill}
            hasTwoButtons={!!secondaryButton}
            style={style}
            testID={testID}
        >
            {buttons.map((button, index) => (
                <ButtonWrapper
                    key={index}
                    layout={layout}
                    fill={fill}
                    hasTwoButtons={!!secondaryButton}
                    isLast={index === buttons.length - 1}
                >
                    <Button
                        {...button}
                        fullWidth={fill && layout === 'vertical'}
                        style={[
                            button.style as any,
                            fill && layout === 'horizontal' && styles.flexButton,
                        ]}
                    />
                </ButtonWrapper>
            ))}
        </Container>
    );
};

// Styled components
interface ContainerProps {
    alignment: ButtonGroupAlignment;
    layout: ButtonGroupLayout;
    spacing: number;
    fill: boolean;
    hasTwoButtons: boolean;
}

const Container = styled.View<ContainerProps>`
  flex-direction: ${({ layout }) => layout};
  align-items: ${({ alignment, layout }) => {
        if (layout === 'vertical') return 'stretch';
        switch (alignment) {
            case 'start': return 'flex-start';
            case 'center': return 'center';
            case 'end': return 'flex-end';
            case 'space-between': return 'space-between';
            default: return 'flex-end';
        }
    }};
  justify-content: ${({ alignment }) => {
        switch (alignment) {
            case 'start': return 'flex-start';
            case 'center': return 'center';
            case 'end': return 'flex-end';
            case 'space-between': return 'space-between';
            default: return 'flex-end';
        }
    }};
  gap: ${({ spacing }) => spacing}px;
  width: 100%;
`;

interface ButtonWrapperProps {
    layout: ButtonGroupLayout;
    fill: boolean;
    hasTwoButtons: boolean;
    isLast: boolean;
}

const ButtonWrapper = styled.View<ButtonWrapperProps>`
  ${({ layout, fill }) =>
        layout === 'vertical' && fill ? 'width: 100%;' : ''
    }
  ${({ layout, fill, hasTwoButtons }) =>
        layout === 'horizontal' && fill && hasTwoButtons
            ? 'flex: 1;'
            : ''
    }
`;

const styles = StyleSheet.create({
    flexButton: {
        flex: 1,
    },
});

// Pre-configured button groups for common patterns

// Dialog/Modal buttons (Cancel/Confirm)
export const DialogButtons: FC<{
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmLoading?: boolean;
    cancelLoading?: boolean;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    reverse?: boolean;
    layout?: ButtonGroupLayout;
}> = ({
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmLoading = false,
    cancelLoading = false,
    confirmDisabled = false,
    cancelDisabled = false,
    reverse = false,
    layout = 'horizontal',
}) => (
        <ButtonGroup
            primaryButton={{
                title: confirmText,
                onPress: onConfirm,
                variant: 'primary',
                loading: confirmLoading,
                disabled: confirmDisabled,
            }}
            secondaryButton={{
                title: cancelText,
                onPress: onCancel,
                variant: 'secondary',
                loading: cancelLoading,
                disabled: cancelDisabled,
            }}
            alignment="space-between"
            layout={layout}
            reverse={reverse}
            fill={true}
        />
    );

// Save/Cancel buttons
export const SaveCancelButtons: FC<{
    onSave: () => void;
    onCancel: () => void;
    saveText?: string;
    cancelText?: string;
    saveLoading?: boolean;
    cancelLoading?: boolean;
    saveDisabled?: boolean;
    cancelDisabled?: boolean;
}> = (props) => (
    <DialogButtons
        confirmText={props.saveText || 'Save'}
        cancelText={props.cancelText || 'Cancel'}
        onConfirm={props.onSave}
        onCancel={props.onCancel}
        confirmLoading={props.saveLoading}
        cancelLoading={props.cancelLoading}
        confirmDisabled={props.saveDisabled}
        cancelDisabled={props.cancelDisabled}
    />
);

// Delete/Cancel buttons
export const DeleteCancelButtons: FC<{
    onDelete: () => void;
    onCancel: () => void;
    deleteText?: string;
    cancelText?: string;
    deleteLoading?: boolean;
    cancelLoading?: boolean;
    deleteDisabled?: boolean;
    cancelDisabled?: boolean;
}> = (props) => (
    <ButtonGroup
        primaryButton={{
            title: props.deleteText || 'Delete',
            onPress: props.onDelete,
            variant: 'primary',
            color: 'danger',
            loading: props.deleteLoading,
            disabled: props.deleteDisabled,
        }}
        secondaryButton={{
            title: props.cancelText || 'Cancel',
            onPress: props.onCancel,
            variant: 'secondary',
            loading: props.cancelLoading,
            disabled: props.cancelDisabled,
        }}
        alignment="space-between"
        fill={true}
    />
);

// Yes/No buttons
export const YesNoButtons: FC<{
    onYes: () => void;
    onNo: () => void;
    yesText?: string;
    noText?: string;
    yesLoading?: boolean;
    noLoading?: boolean;
    yesDisabled?: boolean;
    noDisabled?: boolean;
}> = (props) => (
    <ButtonGroup
        primaryButton={{
            title: props.yesText || 'Yes',
            onPress: props.onYes,
            variant: 'primary',
            loading: props.yesLoading,
            disabled: props.yesDisabled,
        }}
        secondaryButton={{
            title: props.noText || 'No',
            onPress: props.onNo,
            variant: 'secondary',
            loading: props.noLoading,
            disabled: props.noDisabled,
        }}
        alignment="space-between"
        fill={true}
    />
);

// Primary with Icon button
export const PrimaryWithActionButtons: FC<{
    primaryAction: ButtonProps;
    secondaryAction?: ButtonProps;
    layout?: ButtonGroupLayout;
}> = ({ primaryAction, secondaryAction, layout = 'horizontal' }) => (
    <ButtonGroup
        primaryButton={primaryAction}
        secondaryButton={secondaryAction}
        alignment={secondaryAction ? 'space-between' : 'end'}
        layout={layout}
        fill={!!secondaryAction}
    />
);

// Simple single button group (centered)
export const CenteredButton: FC<ButtonProps> = (props) => (
    <View style={{ alignItems: 'center' }}>
        <Button {...props} />
    </View>
);

export default ButtonGroup;