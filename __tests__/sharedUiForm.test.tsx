import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { TextField, Toggle } from '@shared/ui';
import darkTheme from '../src/theme/darkTheme';
import lightTheme from '../src/theme/lightTheme';

describe('shared form primitives', () => {
  it('renders a labelled text field', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <StyledThemeProvider theme={lightTheme}>
          <TextField label="Email" value="a@b.fr" onChangeText={jest.fn()} />
        </StyledThemeProvider>,
      );
    });

    expect(tree.root.findByProps({ accessibilityLabel: 'Email' })).toBeTruthy();
  });

  it('uses readable input and placeholder colors in dark mode', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <StyledThemeProvider theme={darkTheme}>
          <TextField label="Email" placeholder="Adresse e-mail" value="" onChangeText={jest.fn()} />
        </StyledThemeProvider>,
      );
    });

    const input = tree.root.findByType(TextInput);

    expect(StyleSheet.flatten(input.props.style)).toMatchObject({
      backgroundColor: darkTheme.colors.surface,
      borderColor: darkTheme.colors.border,
      color: darkTheme.colors.textPrimary,
    });
    expect(input.props.placeholderTextColor).toBe(darkTheme.colors.textDisabled);
  });

  it('renders a toggle without role-specific dependencies', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<Toggle value onValueChange={jest.fn()} />);
    });

    expect(tree.root.findByProps({ accessibilityRole: 'switch' })).toBeTruthy();
  });
});
