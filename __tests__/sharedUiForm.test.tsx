import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { TextField, Toggle } from '@shared/ui';

describe('shared form primitives', () => {
  it('renders a labelled text field', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <TextField label="Email" value="a@b.fr" onChangeText={jest.fn()} />,
      );
    });

    expect(tree.root.findByProps({ accessibilityLabel: 'Email' })).toBeTruthy();
  });

  it('renders a toggle without role-specific dependencies', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<Toggle value onValueChange={jest.fn()} />);
    });

    expect(tree.root.findByProps({ accessibilityRole: 'switch' })).toBeTruthy();
  });
});
