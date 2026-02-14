
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Text from '@components/Text';
import { horizontalScale } from '@utils/normalizedCss';
import SvgIcon, { IconName } from '../Icon/SvgIcon';

export type CheckBoxValue = string | number;

export interface CheckBoxOption {
    /** Label text for the checkbox */
    label: string;
    /** Unique identifier */
    id: CheckBoxValue;
    /** Whether the option is selected */
    selected?: boolean;
    /** Description text (optional) */
    description?: string;
    /** Whether the option is disabled */
    disabled?: boolean;
    /** Custom icon (optional) */
    icon?: string;
    /** Custom color (optional) */
    color?: string;
}

export interface CheckBoxProps {
    /** Array of checkbox options */
    options: CheckBoxOption[];
    /** Callback when selection changes */
    onSelect?: (selectedOption: CheckBoxOption) => void;
    /** Callback when multiple selection changes */
    onSelectMultiple?: (selectedOptions: CheckBoxOption[]) => void;
    /** Selection mode: single or multiple */
    selection?: 'single' | 'multiple';
    /** Default selected values */
    defaultValue?: CheckBoxValue[];
    /** Whether checkboxes are disabled */
    disabled?: boolean;
    /** Layout direction */
    direction?: 'vertical' | 'horizontal';
    /** Spacing between options */
    spacing?: number;
    /** Whether to show check icon */
    showCheck?: boolean;
    /** Custom check icon */
    checkIcon?: string;
    /** Custom uncheck icon */
    uncheckIcon?: string;
    /** Style for the container */
    style?: any;
    /** Test ID */
    testID?: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
    options,
    onSelect,
    onSelectMultiple,
    selection = 'single',
    defaultValue = [],
    disabled = false,
    direction = 'vertical',
    spacing = 8,
    showCheck = true,
    checkIcon = 'ellipse',
    uncheckIcon = 'empty-ellipse',
    style,
    testID,
}) => {
    const [selectedIds, setSelectedIds] = useState<CheckBoxValue[]>(defaultValue);

    const handlePress = (option: CheckBoxOption) => {
        if (disabled || option.disabled) return;

        let newSelectedIds: CheckBoxValue[];

        if (selection === 'single') {
            // Single selection: toggle selected option
            newSelectedIds = selectedIds.includes(option.id) ? [] : [option.id];
        } else {
            // Multiple selection: toggle option in selection
            if (selectedIds.includes(option.id)) {
                newSelectedIds = selectedIds.filter(id => id !== option.id);
            } else {
                newSelectedIds = [...selectedIds, option.id];
            }
        }

        setSelectedIds(newSelectedIds);

        // Call appropriate callback
        if (onSelect && selection === 'single') {
            const selectedOption = options.find(item => item.id === newSelectedIds[0]);
            if (selectedOption) {
                onSelect(selectedOption);
            }
        }

        if (onSelectMultiple) {
            const selectedOptions = options.filter(item => newSelectedIds.includes(item.id));
            onSelectMultiple(selectedOptions);
        }
    };

    const isSelected = (id: CheckBoxValue): boolean => {
        return selectedIds.includes(id);
    };

    return (
        <Container
            direction={direction}
            spacing={spacing}
            style={style}
            testID={testID}
        >
            {options.map((option) => {
                const isOptionSelected = isSelected(option.id);
                const isOptionDisabled = disabled || option.disabled;
                const iconColor = option.color || (isOptionSelected ? 'orange' : 'gray');

                return (
                    <TouchableOpacity
                        key={option.id.toString()}
                        onPress={() => handlePress(option)}
                        disabled={isOptionDisabled}
                        activeOpacity={0.7}
                        testID={`checkbox-${option.id}`}
                    >
                        <OptionContainer direction={direction}>
                            {showCheck && (
                                <IconContainer>
                                    <SvgIcon
                                        name={isOptionSelected ? checkIcon as IconName : uncheckIcon as IconName}
                                        size={20}
                                        color={iconColor}
                                    />
                                </IconContainer>
                            )}

                            {option.icon && (
                                <CustomIconContainer>
                                    <SvgIcon
                                        name={option.icon as IconName}
                                        size={20}
                                        color={iconColor}
                                    />
                                </CustomIconContainer>
                            )}

                            <TextContainer>
                                <Text
                                    variant="medium"
                                    color={isOptionDisabled ? 'gray' : 'black'}
                                    style={[
                                        styles.label,
                                        isOptionDisabled && styles.disabledLabel,
                                    ]}
                                >
                                    {option.label}
                                </Text>

                                {option.description && (
                                    <Text
                                        variant="regularSmall"
                                        color={isOptionDisabled ? 'grayLight' : 'gray'}
                                        style={styles.description}
                                    >
                                        {option.description}
                                    </Text>
                                )}
                            </TextContainer>
                        </OptionContainer>
                    </TouchableOpacity>
                );
            })}
        </Container>
    );
};

// Styled components
interface ContainerProps {
    direction: 'vertical' | 'horizontal';
    spacing: number;
}

const Container = styled.View<ContainerProps>`
  flex-direction: ${({ direction }) => direction};
  flex-wrap: ${({ direction }) => direction === 'horizontal' ? 'wrap' : 'nowrap'};
  gap: ${({ spacing }) => spacing}px;
`;

const OptionContainer = styled.View<{ direction: 'vertical' | 'horizontal' }>`
  flex-direction: row;
  align-items: flex-start;
  padding: ${({ direction }) =>
        direction === 'vertical' ? '8px 0' : '4px 8px'
    };
`;

const IconContainer = styled.View`
  margin-right: 8px;
  margin-top: 2px;
`;

const CustomIconContainer = styled.View`
  margin-right: 12px;
  margin-top: 2px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
    label: {
        marginLeft: horizontalScale(5),
    },
    disabledLabel: {
        opacity: 0.5,
    },
    description: {
        marginLeft: horizontalScale(5),
        marginTop: 2,
    },
});

// Single CheckBox component (for individual checkboxes)
export interface SingleCheckBoxProps {
    /** Label text */
    label: string;
    /** Description text (optional) */
    description?: string;
    /** Whether the checkbox is checked */
    checked?: boolean;
    /** Callback when checked state changes */
    onCheckedChange?: (checked: boolean) => void;
    /** Whether the checkbox is disabled */
    disabled?: boolean;
    /** Custom icon */
    icon?: string;
    /** Custom check icon */
    checkIcon?: string;
    /** Custom uncheck icon */
    uncheckIcon?: string;
    /** Style for the container */
    style?: any;
    /** Test ID */
    testID?: string;
}

export const SingleCheckBox: React.FC<SingleCheckBoxProps> = ({
    label,
    description,
    checked = false,
    onCheckedChange,
    disabled = false,
    icon,
    checkIcon = 'ellipse',
    uncheckIcon = 'empty-ellipse',
    style,
    testID,
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handlePress = () => {
        if (disabled) return;

        const newChecked = !isChecked;
        setIsChecked(newChecked);
        onCheckedChange?.(newChecked);
    };

    const iconColor = isChecked ? 'orange' : 'gray';

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7}
            style={style}
            testID={testID}
        >
            <OptionContainer direction="vertical">
                <IconContainer>
                    <SvgIcon
                        name={isChecked ? checkIcon as IconName : uncheckIcon as IconName}
                        size={20}
                        color={iconColor}
                    />
                </IconContainer>

                {icon && (
                    <CustomIconContainer>
                        <SvgIcon
                            name={icon as IconName}
                            size={20}
                            color={iconColor}
                        />
                    </CustomIconContainer>
                )}

                <TextContainer>
                    <Text
                        variant="medium"
                        color={disabled ? 'gray' : 'black'}
                        style={disabled ? styles.disabledLabel : styles.label}
                    >
                        {label}
                    </Text>

                    {description && (
                        <Text
                            variant="regularSmall"
                            color={disabled ? 'grayLight' : 'gray'}
                            style={styles.description}
                        >
                            {description}
                        </Text>
                    )}
                </TextContainer>
            </OptionContainer>
        </TouchableOpacity>
    );
};

// Radio Button component (single selection with different style)
export const RadioButton: React.FC<Omit<SingleCheckBoxProps, 'checkIcon' | 'uncheckIcon'>> = (props) => (
    <SingleCheckBox
        checkIcon="ellipse"
        uncheckIcon="empty-ellipse"
        {...props}
    />
);

// Toggle Switch component
export interface ToggleSwitchProps {
    /** Label text */
    label: string;
    /** Description text */
    description?: string;
    /** Whether the toggle is on */
    value?: boolean;
    /** Callback when toggle changes */
    onValueChange?: (value: boolean) => void;
    /** Whether the toggle is disabled */
    disabled?: boolean;
    /** Style for the container */
    style?: any;
    /** Test ID */
    testID?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    label,
    description,
    value = false,
    onValueChange,
    disabled = false,
    style,
    testID,
}) => {
    const [isOn, setIsOn] = useState(value);

    const handlePress = () => {
        if (disabled) return;

        const newValue = !isOn;
        setIsOn(newValue);
        onValueChange?.(newValue);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7}
            style={style}
            testID={testID}
        >
            <OptionContainer direction="vertical">
                <SwitchContainer>
                    <SwitchTrack isOn={isOn} disabled={disabled}>
                        <SwitchThumb isOn={isOn} />
                    </SwitchTrack>
                </SwitchContainer>

                <TextContainer>
                    <Text
                        variant="medium"
                        color={disabled ? 'gray' : 'black'}
                        style={disabled ? styles.disabledLabel : styles.label}
                    >
                        {label}
                    </Text>

                    {description && (
                        <Text
                            variant="regularSmall"
                            color={disabled ? 'grayLight' : 'gray'}
                            style={styles.description}
                        >
                            {description}
                        </Text>
                    )}
                </TextContainer>
            </OptionContainer>
        </TouchableOpacity>
    );
};

// Switch styled components
const SwitchContainer = styled.View`
  margin-right: 12px;
  margin-top: 2px;
`;

const SwitchTrack = styled.View<{ isOn: boolean; disabled: boolean }>`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  background-color: ${({ isOn, disabled, theme }) => {
        if (disabled) return theme?.colors?.gray300 || '#E0E0E0';
        return isOn
            ? theme?.colors?.primary || '#FF6B00'
            : theme?.colors?.gray300 || '#E0E0E0';
    }};
  justify-content: center;
  padding: 2px;
`;

const SwitchThumb = styled.View<{ isOn: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: white;
  align-self: ${({ isOn }) => isOn ? 'flex-end' : 'flex-start'};
`;

export default CheckBox;