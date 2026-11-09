import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider } from '../src/theme';
import ProfessionalForm from '../src/features/auth/ui/forms/ProfessionalForm';
import '../src/utils/i18n';

const mockDispatch = jest.fn();
jest.mock('@store/hooks', () => ({ useAppDispatch: () => mockDispatch, useAppSelector: () => false }));
jest.mock('@features/auth/api/auth.api', () => ({ useRegisterProfessionalMutation: () => [jest.fn(), { isLoading: false }] }));
jest.mock('@shared/ui', () => ({ Spinner: () => null }));
jest.mock('@shared/ui/button/Button', () => ({ Button: (props: any) => require('react').createElement(require('react-native').Pressable, props) }));
jest.mock('@shared/ui/form/HookFormField', () => ({ __esModule: true, default: (props: any) => require('react').createElement(require('react-native').View, { testID: `field-${props.name}` }) }));
jest.mock('react-native-keyboard-aware-scroll-view', () => ({ KeyboardAwareScrollView: require('react-native').ScrollView }));
jest.mock('../src/features/auth/ui/forms/ListServices', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/features/auth/ui/forms/ServicesSkeleton', () => ({ __esModule: true, default: () => require('react').createElement(require('react-native').View, { testID: 'services-loading' }) }));
jest.mock('@core/notifications/toast', () => ({ Toast: { show: jest.fn() } }));

test('lets a professional begin registration while services load and waits only at the services step', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => { tree = renderer.create(<ThemeProvider><ProfessionalForm services={[]} servicesLoading /></ThemeProvider>); });
    expect(tree.root.findByProps({ testID: 'field-first_name' })).toBeTruthy();
    expect(tree.root.findAllByProps({ testID: 'services-loading' })).toHaveLength(0);
    expect(tree.root.findByProps({ testID: 'professional-form-primary-action' }).props.disabled).toBe(false);
    for (let step = 0; step < 3; step++) {
        await act(async () => { await tree.root.findByProps({ testID: 'professional-form-primary-action' }).props.onPress(); });
    }
    expect(tree.root.findByProps({ testID: 'services-loading' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'professional-form-primary-action' }).props.disabled).toBe(true);
    await act(async () => tree.unmount());
});
