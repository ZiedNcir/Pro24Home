import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import renderer, { act } from 'react-test-renderer';

jest.mock('@theme/ThemeProvider', () => {
  const darkTheme = require('../src/theme/darkTheme').default;

  return {
    useTheme: () => ({ theme: darkTheme }),
  };
});

import { TextField } from '../src/shared/ui/form/TextField';
import darkTheme from '../src/theme/darkTheme';

describe('TextField project theme integration', () => {
  it('uses the project theme context for its input colors', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <TextField label="Email" placeholder="Adresse e-mail" value="" onChangeText={jest.fn()} />,
      );
    });

    const input = tree.root.findByType(TextInput);

    expect(StyleSheet.flatten(input.props.style)).toMatchObject({
      color: darkTheme.colors.textPrimary,
    });
  });
});
