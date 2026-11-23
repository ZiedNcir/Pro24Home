# Normalize Source Formatting and Dimensions

## Intent

Make the TypeScript and React Native source under `src` consistently formatted and responsive by replacing hard-coded UI dimensions with the existing `normalizedCss` helpers, reviewing each file individually.

## Current State

- `src` contains 246 `.ts` and `.tsx` files.
- A scan of those TypeScript files found about 244 literal `px` values and 356 numeric React Native dimension fields. These counts overlap and are discovery estimates, not a migration checklist.
- `.prettierrc.js` defines the project's Prettier conventions.
- `src/utils/normalizedCss.tsx` exports `horizontalScale`, `verticalScale`, `moderateScale`, and `fontPixel`.

## Goals

- Apply Prettier line wrapping and formatting to every `.ts` and `.tsx` source file under `src`.
- Replace hard-coded UI sizes and spacing with the existing normalization helpers, processing and reviewing files individually.
- Preserve UI behavior, app copy, layout relationships, and non-style logic.
- Keep a short exception list for values whose meaning is intentionally fixed or unitless.

## Non-goals and anti-goals

- Do not reformat tests, native Android/iOS files, SVG/image assets, or translation JSON.
- Do not normalize colors, percentages, zero values, unitless values such as `flex` and `opacity`, or non-UI business values.
- Do not change component behavior or redesign layouts as part of this pass.
- Do not convert hairline borders to scaled borders.

## Constraints

- Use only the existing helpers from `src/utils/normalizedCss.tsx`.
- Keep one-pixel hairlines and `StyleSheet.hairlineWidth` unchanged to preserve crisp borders.
- Keep percentage dimensions and unitless React Native values unchanged.
- Use `fontPixel` for literal font sizes and text line heights at raw style boundaries, `horizontalScale` for horizontal dimensions and spacing, `verticalScale` for vertical dimensions and spacing, and `moderateScale` for nondirectional control sizes and corner radii.
- Leave `fontSize` and `lineHeight` passed as props to the shared `Text` component as unscaled design values; `Text` already applies `fontPixel` internally.
- For two-axis shorthands, normalize each axis separately; do not apply one scale to both axes by default.
- Add helper imports only in files that need them, and retain existing imports when still used.

## Approaches

1. **Format all source, then normalize dimensions file by file (selected).** Prettier gives consistent line breaks across `src`; a file-by-file pass applies the correct scale helper and checks that dimensions retain their intended axis and role. This meets the requested project-wide scope, with a broad formatting diff.
2. **Normalize styles only and leave other line formatting unchanged.** This produces smaller diffs, but leaves the requested source-wide line breaks inconsistent.

The user selected approach 1.

## Builder Decisions

- Treat `src/**/*.ts` and `src/**/*.tsx` as the formatting and review scope.
- Preserve intentional fixed-pixel hairlines, zero, percentage values, and unitless fields as exceptions.
- Use `fontPixel` for raw text metrics, matching the shared `Text` component's font size and line height scaling. This keeps text density proportional across screen heights.
- Keep values passed to shared `Text` props as design values because `Text` already normalizes them internally; do not double-scale those props.
- Run formatting first, then make the dimensional conversions file by file so formatting does not obscure individual sizing changes.
- Review each changed file for remaining eligible literal dimensions and confirm that remaining literals fall only under the documented exceptions.
