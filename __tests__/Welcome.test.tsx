import React from 'react';
import { Animated, Image, View } from 'react-native';
import ReactTestRenderer, { ReactTestInstance } from 'react-test-renderer';
import Welcome from '../src/screens/Welcome';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/core', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, right: 0, bottom: 34, left: 0 }),
}));

jest.mock('@components/index', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    ScreenContainer: ({ children, ...props }: React.ComponentProps<typeof View>) =>
      ReactModule.createElement(NativeView, { ...props, testID: 'screen-container' }, children),
  };
});

jest.mock('@components/Modal/AppSpinner', () => ({ Spinner: () => null }));

jest.mock('@components/Text', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { Text: NativeText } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    __esModule: true,
    default: (props: React.ComponentProps<typeof NativeText>) =>
      ReactModule.createElement(NativeText, props),
  };
});

jest.mock('@assets/svg/logo-mediumPro24.svg', () => {
  const ReactModule = jest.requireActual<typeof React>('react');
  const { View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    __esModule: true,
    default: (props: React.ComponentProps<typeof View>) =>
      ReactModule.createElement(NativeView, { ...props, testID: 'brand-logo' }),
  };
});

const stepAssets = [
  require('../src/assets/images/onboarding-hero-v2.png'),
  require('../src/assets/images/onboarding-match.png'),
  require('../src/assets/images/onboarding-complete.png'),
];

const getText = (node: ReactTestInstance | string): string => {
  if (typeof node === 'string') {
    return node;
  }

  return node.children.map(getText).join('');
};

const expectCopy = (root: ReactTestInstance, title: string, description: string) => {
  expect(root.findAll(node => getText(node) === title).length).toBeGreaterThan(0);
  expect(root.findAll(node => getText(node) === description).length).toBeGreaterThan(0);
};

const expectStep = (
  root: ReactTestInstance,
  step: number,
  title: string,
  description: string,
  actionLabel: 'Suivant' | 'Commencer',
) => {
  expectCopy(root, title, description);
  expect(root.findByType(Image).props.source).toEqual(stepAssets[step - 1]);
  expect(root.findByProps({ accessibilityRole: 'progressbar' }).props.accessibilityValue).toEqual({
    min: 1,
    max: 3,
    now: step,
    text: `Étape ${step} sur 3`,
  });

  for (let index = 1; index <= 3; index += 1) {
    expect(root.findByProps({ testID: `tutorial-progress-dot-${index}` }).props.accessibilityState).toEqual({
      selected: index === step,
    });
  }

  expect(root.findByProps({ testID: 'tutorial-primary-action' }).props.accessibilityLabel).toBe(actionLabel);
};

describe('Welcome onboarding tutorial', () => {
  let timingSpy: jest.SpyInstance;
  let springSpy: jest.SpyInstance;
  let parallelSpy: jest.SpyInstance;
  let setValueSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockReset();

    const noOpAnimation = () => ({
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    });

    timingSpy = jest.spyOn(Animated, 'timing').mockImplementation(noOpAnimation as typeof Animated.timing);
    springSpy = jest.spyOn(Animated, 'spring').mockImplementation(noOpAnimation as typeof Animated.spring);
    parallelSpy = jest.spyOn(Animated, 'parallel').mockImplementation(noOpAnimation as typeof Animated.parallel);
    setValueSpy = jest.spyOn(Animated.Value.prototype, 'setValue');
  });

  afterEach(() => {
    timingSpy.mockRestore();
    springSpy.mockRestore();
    parallelSpy.mockRestore();
    setValueSpy.mockRestore();
    jest.useRealTimers();
  });

  it('resets the transition values when the visible step changes', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Welcome />);
    });

    const primaryAction = renderer!.root.findAll(
      node => typeof node.props.onPress === 'function' && getText(node) === 'Suivant',
    )[0]!;

    await ReactTestRenderer.act(() => {
      primaryAction.props.onPress();
    });

    expect(setValueSpy.mock.calls.filter(([value]) => value === 0)).toHaveLength(2);
    expect(setValueSpy.mock.calls.filter(([value]) => value === 20)).toHaveLength(2);
  });

  it('advances through all steps and opens account type selection at the end', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Welcome />);
    });

    const root = renderer!.root;
    expect(root.findByProps({ testID: 'screen-container' }).props.withTopSafeArea).toBe(false);
    expectStep(
      root,
      1,
      'Décrivez votre besoin',
      "Expliquez-nous ce qu'il faut réparer ou améliorer chez vous.",
      'Suivant',
    );
    expect(setValueSpy.mock.calls.filter(([value]) => value === 0)).toHaveLength(1);
    expect(setValueSpy.mock.calls.filter(([value]) => value === 20)).toHaveLength(1);

    await ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'tutorial-primary-action' }).props.onPress();
    });

    expectStep(
      root,
      2,
      'PRO24HOME choisit votre expert',
      'Nous vous attribuons automatiquement le professionnel le plus adapté à votre besoin et à votre localisation.',
      'Suivant',
    );
    expect(setValueSpy.mock.calls.filter(([value]) => value === 0)).toHaveLength(2);
    expect(setValueSpy.mock.calls.filter(([value]) => value === 20)).toHaveLength(2);

    await ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'tutorial-primary-action' }).props.onPress();
    });

    expectStep(
      root,
      3,
      'Votre intervention est prise en charge',
      "Recevez la confirmation et avancez sereinement jusqu'à la fin de l'intervention.",
      'Commencer',
    );
    expect(setValueSpy.mock.calls.filter(([value]) => value === 0)).toHaveLength(3);
    expect(setValueSpy.mock.calls.filter(([value]) => value === 20)).toHaveLength(3);

    await ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'tutorial-primary-action' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('SignIn', { role: 'client' });
  });

  it('routes Passer and Se connecter to their client destinations', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Welcome />);
    });

    const root = renderer!.root;

    ReactTestRenderer.act(() => {
      root.findByProps({ accessibilityLabel: 'Passer' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenLastCalledWith('SignIn', { role: 'client' });

    ReactTestRenderer.act(() => {
      root.findByProps({ accessibilityLabel: 'Se connecter' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenLastCalledWith('SignIn', { role: 'client' });
  });
});
