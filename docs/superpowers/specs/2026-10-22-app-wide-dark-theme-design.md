# App Wide Dark Theme Design

## Goal

Make dark mode readable and visually consistent across client and professional flows while preserving the existing layout, component hierarchy, and light theme appearance.

## Current problem

The app has an active theme context and separate light and dark palettes, but color use is inconsistent:

- The compatibility export `colors` from `src/theme/index.ts` always points to `lightColors`.
- Many components use `useTheme()` correctly, but some screens import the static `colors` export.
- Multiple screens contain fixed light colors for card surfaces, selected states, borders, badges, and icons.
- The dark palette currently assigns black to input text and retains pale light-mode accent fills, which can produce poor contrast on dark surfaces.

## Design

### Palette behavior

- Keep the current theme context as the source of the active palette.
- Adjust dark palette values for text, inputs, inverse text, borders, accent fills, and semantic status surfaces so they work on dark backgrounds.
- Preserve light palette values and light-mode appearance.
- Keep semantic colors distinguishable in both modes; do not blindly invert the full palette.

### Component color access

- Migrate runtime UI consumers of the static `colors` compatibility export to `useTheme()` or styled-components theme access.
- Replace hard-coded light colors in UI components when they represent a theme-dependent surface, border, selected state, or text color.
- Keep colors that are intentionally theme-independent, such as brand marks or media artwork, explicit and documented by their context.
- Leave layout, typography, interaction behavior, and theme selection/persistence unchanged.

### Scope

The migration covers shared UI and the client and professional application flows, including home, profile, settings, address management, intervention and payment flows, documents, dashboard, and tracking. Authentication and other features are included wherever they render app-themed surfaces or consume the static palette export.

## Acceptance criteria

1. Dark mode uses the active dark palette for app UI; no runtime consumer relies on the light-only `colors` compatibility export.
2. Theme-dependent fixed light colors are removed or replaced with active theme tokens across in-scope screens.
3. Inputs and their placeholders are readable in dark mode, and text, borders, selected states, and semantic status surfaces remain distinguishable against their backgrounds.
4. Light mode retains its current palette and visual behavior.
5. Theme selection and persistence behavior are unchanged.

## Verification approach

- Search the source for imports of the static `colors` export and for fixed light colors in app UI.
- Review representative client and professional flows in both light and dark modes, including forms, cards, selected states, status notices, overlays, and navigation surfaces.
- Run the repository's existing type and test checks after implementation; add no new tests unless the implementation uncovers a behavior that cannot be covered by existing checks.

## Risks and constraints

- The compatibility export may have many consumers; migration must preserve each screen's intended semantic color rather than perform a mechanical token substitution.
- Some branded illustrations and status colors may be intentionally bright in dark mode and should be judged by context.
- This design does not change the current provider's system-appearance override or persistence behavior.
