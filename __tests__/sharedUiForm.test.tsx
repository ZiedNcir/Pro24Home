import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { TextField, Toggle } from '@shared/ui';
import { darkTheme, ThemeProvider, useTheme } from '@theme';

let setThemeMode!: (mode: 'light' | 'dark') => void;

const ThemeModeControl = ({ children }: { children: React.ReactNode }) => {
  const { setThemeMode: setMode } = useTheme();
  setThemeMode = setMode;
  return <>{children}</>;
};

describe('shared form primitives', () => {
  it('renders a labelled text field', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <ThemeProvider initialTheme="light">
          <TextField label="Email" value="a@b.fr" onChangeText={jest.fn()} />
        </ThemeProvider>,
      );
    });

    expect(tree.root.findByProps({ accessibilityLabel: 'Email' })).toBeTruthy();
  });

  it('uses readable input and placeholder colors in dark mode', async () => {
    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <ThemeProvider initialTheme="light">
          <ThemeModeControl>
            <TextField label="Email" placeholder="Adresse e-mail" value="" onChangeText={jest.fn()} />
          </ThemeModeControl>
        </ThemeProvider>,
      );
    });

    await act(async () => {
      setThemeMode('dark');
    });

    const input = tree.root.findByType(TextInput);

    expect(StyleSheet.flatten(input.props.style)).toMatchObject({
      backgroundColor: darkTheme.colors.surface,
      borderColor: darkTheme.colors.border,
      color: '#000000',
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
