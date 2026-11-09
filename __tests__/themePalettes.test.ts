import { darkColors, lightColors } from '@theme';

describe('theme palettes', () => {
  it('exposes complete light and dark palettes with the existing mode values', () => {
    expect(lightColors).toMatchObject({
      background: '#FFFFFF',
      surface: '#FFFFFF',
      textPrimary: '#212121',
      textDisabled: '#BDBDBD',
      border: '#E0E0E0',
    });
    expect(darkColors).toMatchObject({
      background: '#121212',
      surface: '#1E1E1E',
      textPrimary: '#FFFFFF',
      textDisabled: '#666666',
      border: '#404040',
    });
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });
});
