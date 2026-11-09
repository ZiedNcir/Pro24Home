import React from 'react';
import { TextInput } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { useForm, UseFormReturn } from 'react-hook-form';
import { ThemeProvider } from '../src/theme';
import Field from '../src/shared/ui/form/HookFormField';
import i18n from '../src/utils/i18n';

jest.mock('@shared/ui/icon', () => ({ SvgIcon: () => null }));
jest.mock('react-native-country-picker-modal', () => ({ __esModule: true, default: () => null }));
jest.mock('react-native-phone-input', () => ({ __esModule: true, default: () => null }));
let form: UseFormReturn<{ password: string }>;
function Harness({ enforcePasswordPolicy }: { enforcePasswordPolicy: boolean }) {
    form = useForm({ defaultValues: { password: '' } });
    return <Field name="password" control={form.control} password required showRequiredIndicator={enforcePasswordPolicy} enforcePasswordPolicy={enforcePasswordPolicy} animated={false} shakeOnError={false} pulseOnFocus={false} />;
}
beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('sign-in accepts a non-empty existing password and keeps it hidden', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<ThemeProvider><Harness enforcePasswordPolicy={false} /></ThemeProvider>); });
    expect(tree.root.findByType(TextInput).props.secureTextEntry).toBe(true);
    await act(async () => tree.root.findByProps({ accessibilityLabel: i18n.t('auth.formDesign.showPassword') }).props.onPress());
    expect(tree.root.findByType(TextInput).props.secureTextEntry).toBe(false);
    await act(async () => { form.setValue('password', 'legacy'); });
    let valid = false;
    await act(async () => { valid = await form.trigger(); });
    expect(valid).toBe(true);
    await act(async () => { form.setValue('password', ''); });
    await act(async () => { valid = await form.trigger(); });
    expect(valid).toBe(false);
    await act(async () => tree.unmount());
});
test('registration still requires the password policy', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<ThemeProvider><Harness enforcePasswordPolicy /></ThemeProvider>); });
    await act(async () => { form.setValue('password', 'legacy'); });
    let valid = true;
    await act(async () => { valid = await form.trigger(); });
    expect(valid).toBe(false);
    await act(async () => tree.unmount());
});
