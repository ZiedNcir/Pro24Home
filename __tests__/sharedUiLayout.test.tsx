import React from 'react';
import renderer, { act } from 'react-test-renderer';

import {
  AppImage,
  BackHeader,
  LoadingOverlay,
  Spinner,
  SvgIcon,
  Text,
} from '@shared/ui';

describe('shared layout primitives', () => {
  it('exposes generic primitives from the shared UI boundary', () => {
    expect(Text).toBeDefined();
    expect(SvgIcon).toBeDefined();
    expect(AppImage).toBeDefined();
    expect(Spinner).toBeDefined();
  });

  it('renders a standalone back header', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<BackHeader title="Retour" onBack={jest.fn()} />);
    });

    expect(tree.root.findByProps({ accessibilityLabel: 'Retour' })).toBeTruthy();
  });

  it('renders a visible loading overlay', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<LoadingOverlay visible message="Chargement" />);
    });

    expect(tree.root.findByProps({ testID: 'loading-overlay' })).toBeTruthy();
  });
});
