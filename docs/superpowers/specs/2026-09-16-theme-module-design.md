# Theme module consolidation

## Objective

Make the active project theme the sole source of UI colors. Light and dark
palettes must be distinct, while non-color design values remain shared.

## Module layout

```
src/theme/
  colors/
    light.ts
    dark.ts
  tokens/
    index.ts
  themes/
    lightTheme.ts
    darkTheme.ts
  provider/
    ThemeProvider.tsx
  hooks/
    index.ts
  utils.ts
  index.ts
```

`tokens/index.ts` owns shared spacing, radii, typography, elevation,
animation and z-index values. It contains no color palette and does not build a
default theme.

`colors/light.ts` and `colors/dark.ts` each define a complete color palette.
Neither imports or overrides the other. `themes/lightTheme.ts` and
`themes/darkTheme.ts` assemble one palette with the shared tokens.

## Public API and consumers

`@theme` remains the only public entry point. It exports the project provider,
`useTheme`, themed utility hooks, color palettes for theme construction, and
shared tokens where needed.

Components must not import a static `colors` object. Any rendered color comes
from `useTheme().theme.colors`, so it updates with `setThemeMode` and
`toggleTheme`. Styled components continue to receive the same active object
through the existing styled-components provider.

`constants.ts` contains component presets and duplicates token concepts. Its
unused exports will be removed; no component-specific theme values remain in
the global theme module. `utils.ts` keeps only pure calculations and responsive
helpers and exports no palette or theme state.

## Compatibility and behavior

The public `ThemeProvider` API, light/dark mode selection, and existing color
values remain unchanged. The refactor changes ownership and imports only.

## Verification

Tests will prove that a shared UI field changes its input, border and
placeholder colors when the project theme changes. A repository search will
confirm that production UI no longer imports a static `colors` palette. The
full test suite, TypeScript check, lint, and whitespace check must pass before
commit.
