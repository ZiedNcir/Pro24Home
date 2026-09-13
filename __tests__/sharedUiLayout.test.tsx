import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { BackHeader, LoadingOverlay } from '@shared/ui';

describe('shared layout primitives', () => {
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
