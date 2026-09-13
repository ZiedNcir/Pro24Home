// src/components/Field/Field.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    Pressable,
    TextInput,
    TextInputProps,
    View,
    Animated,
    Easing,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import {
    Control,
    FieldValues,
    Path,
    PathValue,
    useController,
    RegisterOptions,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { getLocales } from 'react-native-localize';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';

// Components
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import type { IconName } from '@components/Icon/SvgIcon';

// Hooks
import useToggle from '@hooks/useToggle';

// Utils
import {
    moderateScale,
    horizontalScale,
    verticalScale,
    fontPixel,
} from '@utils/normalizedCss';

// Validation utils
import { Regex } from '@utils/constant';
import { colors } from '@theme/index';

// Configure LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface FieldProps<T extends FieldValues> extends TextInputProps {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    helperText?: string;
    validate?: (value: string) => true | string;
    required?: boolean;
    password?: boolean;
    defaultValue?: string;
    regex?: RegExp;
    regexMessage?: string;
    date?: boolean;
    code?: boolean;
    isPhone?: boolean;
    multiline?: boolean;
    defaultDate?: number;

    // Enhanced validation rules
    rules?: Omit<
        RegisterOptions<T, Path<T>>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    > & {
        min?: { value: number; message: string };
        max?: { value: number; message: string };
        minLength?: { value: number; message: string };
        maxLength?: { value: number; message: string };
        pattern?: { value: RegExp; message: string };
        validate?:
        | Record<string, (value: string) => true | string>
        | ((value: string) => true | string);
    };

    // Field type specific rules
    email?: boolean;
    numeric?: boolean;
    url?: boolean;
    alphanumeric?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;

    accessoryRight?: IconName;
    accessoryLeft?: IconName;

    /** V2 */
    disabled?: boolean;
    readOnly?: boolean;
    rightText?: string;
    onRightPress?: () => void;
    containerStyle?: any;
    inputWrapperStyle?: any;

    // Animation props
    animated?: boolean;
    shakeOnError?: boolean;
    pulseOnFocus?: boolean;

    // Character counter
    showCharacterCount?: boolean;
    maxCharacters?: number;

    // Formatting
    formatOnBlur?: (value: string) => string;
    formatOnChange?: (value: string) => string;

    // Debounce for onChange
    debounceTime?: number;
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const FieldWrapper = styled(View)`
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
`;

const LabelWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

// IMPORTANT: Label opacity is animated -> must be an Animated component.
// We wrap your custom Text with Animated.createAnimatedComponent.
const AnimatedAppText = Animated.createAnimatedComponent(Text);

const AnimatedLabel = styled(AnimatedAppText) <{ error?: boolean }>`
  color: ${({ theme, error }) =>
        error ? theme.colors.danger : theme.colors.textPrimary};
`;

const CharacterCount = styled(Text) <{ exceeded?: boolean }>`
  color: ${({ theme, exceeded }) =>
        exceeded ? theme.colors.danger : theme.colors.textSecondary};
  font-size: ${({ theme }) => fontPixel(theme.typography.sizes.headline.small)}px;
`;

/**
 * OPTION A:
 * Split into 2 layers so we never mix JS-driven (borderColor) with native-driven transforms.
 *
 * - OuterWrapper: JS-driven animated styles (borderColor, shadows/elevation etc).
 * - InnerTransform: native-driven transforms (shake / pulse).
 */
const OuterWrapper = styled(Animated.View) <{
    focus?: boolean;
    error?: boolean;
    multiline?: boolean;
    disabled?: boolean;
}>`
  background-color: ${({ theme, disabled }) =>
        disabled ? theme.colors.primaryDark : theme.colors.white};

  border-width: 1.5px;
  border-style: solid;

  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  height: ${({ multiline }) =>
        multiline ? `${verticalScale(80)}px` : `${verticalScale(40)}px`};

  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  /* keep elevation tied to focus (non-animated boolean). */
  ${({ theme, focus }) => (focus ? theme.elevation.xs : '')};
`;

// Inner content keeps original row layout
const InnerTransform = styled(Animated.View) <{ multiline?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: ${({ multiline }) => (multiline ? 'flex-start' : 'center')};
  justify-content: space-between;
`;

const LeftWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.xs}px;
`;

const Input = styled(TextInput) <{ readOnly?: boolean; disabled?: boolean }>`
  flex: 1;
  font-size: ${({ theme }) => fontPixel(theme.typography.sizes.label.large)}px;
  font-family: ${({ theme }) => theme.typography.fonts.inter.medium};
  letter-spacing: 0.5px;
  color: ${({ theme, readOnly, disabled }) =>
        readOnly || disabled ? theme.colors.textDisabled : theme.colors.textPrimary};
  padding-vertical: 0;
  ${Platform.select({
            android: {
                paddingVertical: 0,
            },
        })}
`;

const HelperText = styled(Animated.Text) <{ error?: boolean }>`
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
  font-size: ${({ theme }) => fontPixel(theme.typography.sizes.label.large)}px;
  font-family: ${({ theme }) => theme.typography.fonts.poppins.regular};
  color: ${({ theme, error }) =>
        error ? theme.colors.danger : theme.colors.textSecondary};
`;

const DateText = styled(Text)`
  padding: ${verticalScale(12)}px ${horizontalScale(10)}px;
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CodeCell = styled(Text)`
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  line-height: ${verticalScale(28)}px;
  border-width: ${verticalScale(2)}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  border-color: ${({ theme }) => theme.colors.border};
  text-align: center;
  padding: ${verticalScale(4)}px;
  margin: ${verticalScale(4)}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fonts.inter.medium};
  font-size: ${({ theme }) => fontPixel(theme.typography.sizes.title.medium)}px;
  text-align-vertical: center;
`;

const IconButton = styled(Pressable)`
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
  justify-content: center;
  align-items: center;
`;

const RightTextButton = styled(Pressable)`
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  height: 100%;
  justify-content: center;
`;

const ErrorIcon = styled(View)`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

export function Field<T extends FieldValues>({
    control,
    name,
    password,
    helperText,
    required,
    label,
    date,
    defaultDate,
    defaultValue,
    regex,
    regexMessage,
    rules: customRules,
    // NOTE: validate is kept for backwards compatibility, but customRules.validate should be preferred.
    validate,
    code,
    multiline,
    isPhone,
    accessoryRight,
    accessoryLeft,
    disabled,
    readOnly,
    rightText,
    onRightPress,
    containerStyle,
    inputWrapperStyle,
    animated = true,
    shakeOnError = true,
    pulseOnFocus = true,

    // New props
    email = false,
    numeric = false,
    url = false,
    alphanumeric = false,
    uppercase = false,
    lowercase = false,
    showCharacterCount = false,
    maxCharacters,
    formatOnBlur,
    formatOnChange,
    debounceTime = 0,
    ...rest
}: FieldProps<T>) {
    const theme = useTheme();
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const phoneInput = useRef<PhoneInput>(null);

    // Debounce timer ref
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Animation values
    const shakeAnimation = useRef(new Animated.Value(0)).current; // native transform only
    const pulseAnimation = useRef(new Animated.Value(1)).current; // native transform only
    const focusAnimation = useRef(new Animated.Value(0)).current; // JS driver (borderColor)
    const helperOpacity = useRef(new Animated.Value(0)).current; // can be native, but keep consistent

    // Pulse loop instance (so we can stop it reliably)
    const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

    // State
    const [securePassword, toggleSecurePassword] = useToggle(!!password);
    const [focus, setFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const [phoneCountryCode, setPhoneCountryCode] = useState<CountryCode>('FR');
    const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    // Build validation rules
    const buildRules = (): Omit<
        RegisterOptions<T, Path<T>>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    > => {
        const rules: any = {};

        if (required) {
            rules.required = t('ui.form.error.required');
        }

        if (email) {
            rules.pattern = {
                value: Regex.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: regexMessage || t('ui.form.error.invalidEmail'),
            };
        }

        if (url) {
            rules.pattern = {
                value: /^https?:\/\/.+/,
                message: regexMessage || t('ui.form.error.invalidUrl'),
            };
        }

        if (numeric) {
            rules.pattern = {
                value: /^[0-9]*$/,
                message: regexMessage || t('ui.form.error.numericOnly'),
            };
        }

        if (alphanumeric) {
            rules.pattern = {
                value: /^[a-zA-Z0-9]*$/,
                message: regexMessage || t('ui.form.error.alphanumericOnly'),
            };
        }

        // NOTE: setValueAs is excluded by your rules type, so we cannot set it here.
        // If you need uppercase/lowercase transforms, do it in handleChangeText or formatOnChange.
        // We'll implement it in handleChangeText below.

        if (regex) {
            rules.pattern = {
                value: regex,
                message: regexMessage || t('ui.form.error.invalid'),
            };
        }

        if (password) {
            rules.minLength = {
                value: 8,
                message: t('ui.form.error.passwordLength'),
            };
            rules.validate = {
                ...(typeof rules.validate === 'object' ? rules.validate : {}),
                hasUppercase: (value: string) =>
                    /[A-Z]/.test(value) || t('ui.form.error.passwordUppercase'),
                hasLowercase: (value: string) =>
                    /[a-z]/.test(value) || t('ui.form.error.passwordLowercase'),
                hasNumber: (value: string) =>
                    /\d/.test(value) || t('ui.form.error.passwordNumber'),
                hasSpecial: (value: string) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    t('ui.form.error.passwordSpecial'),
            };
        }

        if (customRules) {
            Object.assign(rules, customRules);
        }

        if (validate) {
            rules.validate = validate;
        }

        return rules;
    };

    const { field, fieldState } = useController<T>({
        name,
        control,
        defaultValue: (date ? moment(defaultDate) : defaultValue) as PathValue<
            T,
            Path<T>
        >,
        rules: buildRules(),
    });

    // Update character count
    useEffect(() => {
        const value = field.value ? String(field.value).length : 0;
        setCharacterCount(value);
    }, [field.value]);

    // Cleanup debounce timer + pulse loop
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            pulseLoopRef.current?.stop();
            pulseLoopRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!isPhone) return;

        const v = typeof field.value === 'string' ? field.value : '';
        setPhoneNumber(v);

        if (phoneInput.current && typeof phoneInput.current.setValue === 'function') {
            phoneInput.current.setValue(v);
        }
    }, [isPhone, field.value]);

    // Shake animation on error (native driver OK; applied to InnerTransform only)
    useEffect(() => {
        if (fieldState.error && shakeOnError && animated) {
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -1,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [fieldState.error, shakeOnError, animated, shakeAnimation]);

    // Pulse animation on focus (native driver OK; applied to InnerTransform only)
    useEffect(() => {
        if (focus && pulseOnFocus && animated) {
            pulseLoopRef.current?.stop();

            pulseLoopRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.02,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );

            pulseLoopRef.current.start();
        } else {
            pulseLoopRef.current?.stop();
            pulseLoopRef.current = null;

            Animated.timing(pulseAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }

        return () => {
            pulseLoopRef.current?.stop();
            pulseLoopRef.current = null;
        };
    }, [focus, pulseOnFocus, animated, pulseAnimation]);

    // Focus animation (JS driver, because we animate borderColor on OuterWrapper)
    useEffect(() => {
        Animated.timing(focusAnimation, {
            toValue: focus ? 1 : 0,
            duration: theme.animation.normal,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false, // JS-driven for colors
        }).start();
    }, [focus, focusAnimation, theme.animation.normal]);

    // Helper text animation (opacity can be native; HelperText is Animated.Text)
    useEffect(() => {
        const hasText = !!(helperText || fieldState.error?.message);
        Animated.timing(helperOpacity, {
            toValue: hasText ? 1 : 0,
            duration: theme.animation.normal,
            useNativeDriver: true,
        }).start();
    }, [helperText, fieldState.error?.message, theme.animation.normal, helperOpacity]);

    // Interpolations
    const shakeInterpolate = shakeAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-5, 0, 5],
    });

    // Border color lives on OUTER (JS-driven)
    const borderColor = focusAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            fieldState.error ? theme.colors.danger : theme.colors.border,
            fieldState.error ? theme.colors.danger : theme.colors.primary,
        ],
    });

    const outerAnimatedStyle = {
        borderColor,
    };

    // Transforms live on INNER (native-driven)
    const innerAnimatedStyle = {
        transform: [{ translateX: shakeInterpolate }, { scale: pulseAnimation }],
    };

    /* ------------------------------ HANDLERS ------------------------------ */

    const handleChangeText = (text: string) => {
        if (disabled || readOnly) return;

        let formattedText = text;

        // Apply case transforms here (since setValueAs is excluded from rules typing)
        if (uppercase) formattedText = formattedText.toUpperCase();
        if (lowercase) formattedText = formattedText.toLowerCase();

        // Apply formatOnChange if provided
        if (formatOnChange) {
            formattedText = formatOnChange(formattedText);
        }

        setCharacterCount(formattedText.length);

        if (debounceTime > 0) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            debounceTimer.current = setTimeout(() => {
                field.onChange(formattedText);
            }, debounceTime);
        } else {
            field.onChange(formattedText);
        }

        if (animated) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    };

    const handleBlur = () => {
        setFocus(false);

        if (formatOnBlur && field.value) {
            const formattedValue = formatOnBlur(String(field.value));
            field.onChange(formattedValue);
        }

        field.onBlur();

        if (animated) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    };

    const handleFocus = () => {
        setFocus(true);
        if (animated) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    };

    /* ------------------------------ RENDERERS ------------------------------ */

    const renderLabel = () => {
        if (!label) return null;

        const labelOpacity = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });

        return (
            <LabelWrapper>
                <AnimatedLabel
                    variant="medium"
                    error={fieldState.invalid}
                    style={{ opacity: labelOpacity }}
                >
                    {label}
                    {required && <Text color="danger"> *</Text>}
                </AnimatedLabel>

                {showCharacterCount && maxCharacters ? (
                    <CharacterCount exceeded={characterCount > maxCharacters}>
                        {characterCount}/{maxCharacters}
                    </CharacterCount>
                ) : null}
            </LabelWrapper>
        );
    };

    const renderHelper = () => {
        const text = fieldState.error?.message || helperText;
        if (!text) return null;

        return (
            <HelperText error={!!fieldState.error} style={{ opacity: helperOpacity }}>
                {text}
            </HelperText>
        );
    };

    const renderDatePicker = () => {
        const DatePicker = require('react-native-date-picker').default;

        return (
            <DatePicker
                modal
                open={open}
                mode="date"
                date={field.value ? new Date(field.value) : new Date()}
                locale={getLocales()[0]?.languageCode || 'fr'}
                onConfirm={(d: Date) => {
                    field.onChange(d.getTime());
                    setOpen(false);
                    if (animated) {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    }
                }}
                onCancel={() => setOpen(false)}
                theme={Platform.OS === 'ios' ? 'light' : undefined}
                androidVariant="nativeAndroid"
            />
        );
    };

    const renderStandardField = () => (
        <Pressable
            onPress={() => {
                if (disabled || readOnly) return;
                inputRef.current?.focus();
            }}
        >
            <OuterWrapper
                focus={focus}
                error={fieldState.invalid}
                multiline={multiline}
                disabled={disabled}
                style={[outerAnimatedStyle, inputWrapperStyle]}
            >
                <InnerTransform multiline={multiline} style={innerAnimatedStyle}>
                    <LeftWrapper>
                        {accessoryLeft ? (
                            <SvgIcon
                                name={accessoryLeft}
                                size={15}
                                color={disabled ? colors.gray200 : colors.gray700}
                                style={{ marginRight: horizontalScale(8) }}
                            />
                        ) : null}

                        {date ? (
                            <>
                                <DateText variant="regular">
                                    {field.value ? moment(field.value).format('LL') : ''}
                                </DateText>
                                {renderDatePicker()}
                            </>
                        ) : (
                            <Input
                                {...rest}
                                ref={inputRef}
                                value={`${field.value ?? ''}`}
                                editable={!disabled && !readOnly}
                                readOnly={readOnly}
                                disabled={disabled}
                                secureTextEntry={securePassword}
                                onChangeText={handleChangeText}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholderTextColor={theme.colors.textDisabled}
                                multiline={multiline}
                                maxLength={maxCharacters}
                            />
                        )}
                    </LeftWrapper>

                    {fieldState.error ? (
                        <ErrorIcon>
                            <SvgIcon name="fa-exclamation-circle" size={18} color="danger" />
                        </ErrorIcon>
                    ) : null}

                    {password ? (
                        <IconButton
                            onPress={() => {
                                if (disabled) return;
                                toggleSecurePassword();
                                if (animated) {
                                    LayoutAnimation.configureNext(
                                        LayoutAnimation.Presets.easeInEaseOut
                                    );
                                }
                            }}
                            disabled={disabled}
                        >
                            <SvgIcon
                                name={securePassword ? 'fa-eye' : 'fa-eye-slash'}
                                size={24}
                                color={
                                    disabled
                                        ? colors.gray200
                                        : fieldState.invalid
                                            ? theme.colors.danger
                                            : focus
                                                ? theme.colors.primary
                                                : colors.gray700
                                }
                            />
                        </IconButton>
                    ) : accessoryRight ? (
                        <SvgIcon
                            name={accessoryRight}
                            size={10}
                            color={colors.black}
                            style={{ marginHorizontal: horizontalScale(6) }}
                        />
                    ) : rightText ? (
                        <RightTextButton onPress={onRightPress} disabled={disabled}>
                            <Text variant="medium" color="primary">
                                {rightText}
                            </Text>
                        </RightTextButton>
                    ) : null}
                </InnerTransform>
            </OuterWrapper>
        </Pressable>
    );

    const renderPhoneInput = () => (
        <Pressable
            onPress={() => {
                if (disabled || readOnly) return;
                phoneInput.current?.focus();
            }}
        >
            <OuterWrapper
                focus={focus}
                error={fieldState.invalid}
                disabled={disabled}
                style={[outerAnimatedStyle, inputWrapperStyle]}
            >
                <InnerTransform style={innerAnimatedStyle}>
                    <LeftWrapper style={{ paddingLeft: 0 }}>
                        <PhoneInput
                            ref={phoneInput}
                            initialValue={phoneNumber}
                            initialCountry={phoneCountryCode.toLowerCase()}
                            onPressFlag={() => setShowPhoneCountryPicker(true)}
                            onChangePhoneNumber={(text) => {
                                if (disabled || readOnly) return;
                                setPhoneNumber(text);
                                handleChangeText(text);
                            }}
                            autoFormat
                            textProps={{
                                placeholder: rest.placeholder ?? 'Numéro de téléphone',
                                editable: !disabled && !readOnly,
                                placeholderTextColor: theme.colors.textDisabled,
                                underlineColorAndroid: 'transparent',
                                onFocus: handleFocus,
                                onBlur: handleBlur,
                                ...rest,
                            }}
                            textStyle={{
                                color:
                                    disabled || readOnly
                                        ? theme.colors.textDisabled
                                        : theme.colors.textPrimary,
                                fontSize: fontPixel(14),
                                fontFamily: theme.typography.fonts.inter.medium,
                            }}
                            style={{ paddingHorizontal: horizontalScale(10), width: '100%' }}
                        />
                    </LeftWrapper>

                    {fieldState.error ? (
                        <ErrorIcon>
                            <SvgIcon name="fa-exclamation-circle" size={18} color="danger" />
                        </ErrorIcon>
                    ) : null}

                    <CountryPicker
                        countryCode={phoneCountryCode}
                        visible={showPhoneCountryPicker}
                        onSelect={(country) => {
                            const newPhone = `+${country.callingCode[0]}`;
                            setPhoneCountryCode(country.cca2);
                            setPhoneNumber(newPhone);
                            handleChangeText(newPhone);

                            phoneInput.current?.selectCountry(country.cca2.toLowerCase());
                            phoneInput.current?.setValue(newPhone);

                            setShowPhoneCountryPicker(false);

                            if (animated) {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                );
                            }
                        }}
                        onClose={() => setShowPhoneCountryPicker(false)}
                        withFlagButton={false}
                        withFilter
                        theme={{
                            backgroundColor: theme.colors.white,
                            primaryColor: theme.colors.primary,
                            primaryColorVariant: theme.colors.primaryDark,
                            onBackgroundTextColor: theme.colors.textPrimary,
                        }}
                    />
                </InnerTransform>
            </OuterWrapper>
        </Pressable>
    );

    const renderCodeField = () => {
        const { CodeField: RNCField, Cursor } = require(
            'react-native-confirmation-code-field'
        );

        return (
            <RNCField
                value={field.value}
                onChangeText={handleChangeText}
                cellCount={6}
                renderCell={({ index, symbol, isFocused }: any) => (
                    <CodeCell
                        key={index}
                        variant="medium"
                        style={[
                            isFocused && {
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.primaryLighter,
                            },
                            fieldState.error && {
                                borderColor: theme.colors.danger,
                            },
                        ]}
                    >
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </CodeCell>
                )}
            />
        );
    };

    /* ------------------------------- RETURN ------------------------------- */

    return (
        <FieldWrapper style={containerStyle}>
            {renderLabel()}

            {isPhone ? renderPhoneInput() : code ? renderCodeField() : renderStandardField()}

            {renderHelper()}
        </FieldWrapper>
    );
}

// Create animated variants
export const AnimatedField = React.memo(Field);

// Export validation helper functions
export const FieldValidators = {
    required: (message?: string) => ({
        required: message || 'This field is required',
    }),

    email: (message?: string) => ({
        pattern: {
            value: Regex.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: message || 'Invalid email format',
        },
    }),

    phone: (message?: string) => ({
        pattern: {
            value: /^[+]?[\d\s-]{10,}$/,
            message: message || 'Invalid phone number',
        },
    }),

    password: (message?: string) => ({
        minLength: {
            value: 8,
            message: message || 'Password must be at least 8 characters',
        },
        validate: {
            hasUppercase: (value: string) =>
                /[A-Z]/.test(value) || 'Must contain uppercase letter',
            hasLowercase: (value: string) =>
                /[a-z]/.test(value) || 'Must contain lowercase letter',
            hasNumber: (value: string) => /\d/.test(value) || 'Must contain number',
            hasSpecial: (value: string) =>
                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                'Must contain special character',
        },
    }),

    minLength: (length: number, message?: string) => ({
        minLength: {
            value: length,
            message: message || `Must be at least ${length} characters`,
        },
    }),

    maxLength: (length: number, message?: string) => ({
        maxLength: {
            value: length,
            message: message || `Cannot exceed ${length} characters`,
        },
    }),

    min: (value: number, message?: string) => ({
        min: {
            value,
            message: message || `Must be at least ${value}`,
        },
    }),

    max: (value: number, message?: string) => ({
        max: {
            value,
            message: message || `Cannot exceed ${value}`,
        },
    }),

    numeric: (message?: string) => ({
        pattern: {
            value: /^[0-9]*$/,
            message: message || 'Numbers only',
        },
    }),

    alphanumeric: (message?: string) => ({
        pattern: {
            value: /^[a-zA-Z0-9]*$/,
            message: message || 'Letters and numbers only',
        },
    }),

    url: (message?: string) => ({
        pattern: {
            value: /^https?:\/\/.+/,
            message: message || 'Invalid URL',
        },
    }),

    match: (fieldName: string, message?: string) => ({
        validate: (value: string, formValues: any) =>
            value === formValues[fieldName] || (message || 'Fields do not match'),
    }),

    customPattern: (pattern: RegExp, message: string) => ({
        pattern: {
            value: pattern,
            message,
        },
    }),
};

export default Field;
