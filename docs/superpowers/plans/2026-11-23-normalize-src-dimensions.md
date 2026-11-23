# Normalize Source Formatting and Dimensions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Format every TypeScript/React Native source file under `src` and replace fixed UI dimensions with the existing responsive scale helpers, reviewing files individually.

**Architecture:** First run the repository's Prettier configuration over all `src/**/*.ts` and `src/**/*.tsx`. Then inspect each file's object-based styles and styled-component templates, converting dimensions according to the property's axis and role. Finish with a per-file audit for remaining eligible literals and documented exceptions.

**Tech Stack:** TypeScript, React Native, styled-components, Prettier, `src/utils/normalizedCss.tsx`.

**Spec:** `docs/superpowers/specs/2026-11-23-normalize-src-dimensions-design.md`

## Global Constraints

- Process all `.ts` and `.tsx` files under `src` (246 files at planning time).
- Use only the existing helpers from `src/utils/normalizedCss.tsx`.
- Use `fontPixel` for raw style font sizes and text line heights; leave values passed through the shared `Text` component as unscaled design values because it applies `fontPixel` internally.
- Use `horizontalScale` for horizontal dimensions and spacing, and `verticalScale` for vertical dimensions and spacing.
- Use `moderateScale` for nondirectional control sizes and corner radii.
- For two-axis shorthands, normalize each axis separately.
- Leave one-pixel hairlines, `StyleSheet.hairlineWidth`, zero, percentages, unitless values, colors, SVG/image assets, and non-UI business values unchanged.
- Preserve all UI behavior and layout relationships.

## Review Focus

- Horizontal values use `horizontalScale`; vertical values use `verticalScale`.
- Raw style font sizes and line heights use `fontPixel` together, preserving their ratio; shared `Text` props are not double-scaled.
- Control sizes and radii use `moderateScale` where no axis is implied.
- One-pixel border widths remain crisp and unchanged.
- Two-axis CSS shorthands do not accidentally use one scale for both axes.
- Remaining numeric values are intentional exceptions, not missed UI dimensions.

---

### Task 1: Format all TypeScript and React Native source files

**Files:**
- Modify: `src/**/*.ts`
- Modify: `src/**/*.tsx`

**Interfaces:**
- Consumes: `.prettierrc.js`.
- Produces: Consistent project line breaks and formatting across the full TypeScript source scope.

- [x] Run `./node_modules/.bin/prettier --write 'src/**/*.ts' 'src/**/*.tsx'` using the repository configuration.
- [x] Run `./node_modules/.bin/prettier --check 'src/**/*.ts' 'src/**/*.tsx'`; require all files to be formatted.

### Task 2: Normalize object-based React Native style dimensions

**Files:**
- Modify: TypeScript/TSX files under `src` containing numeric `StyleSheet`, inline, or component style dimensions.

**Interfaces:**
- Consumes: Existing scale helpers from `@utils/normalizedCss`.
- Produces: Object-based UI dimensions expressed through the helper appropriate to the property and axis.

- [x] Review each matching file individually; convert width/left/right/horizontal spacing with `horizontalScale`, height/top/bottom/vertical spacing with `verticalScale`, nondirectional control sizes/radii with `moderateScale`, and raw style font size/line height with `fontPixel`.
- [x] Add `@utils/normalizedCss` imports only where needed; preserve non-style numbers, unitless values, percentages, zero, and one-pixel hairlines.

### Task 3: Normalize styled-component CSS dimensions and audit the full source

**Files:**
- Modify: TypeScript/TSX files under `src` containing styled-component CSS dimensions.

**Interfaces:**
- Consumes: Existing scale helpers from `@utils/normalizedCss` and the results of Tasks 1 and 2.
- Produces: Styled CSS dimensions expressed through the same property-to-helper mapping, with only documented fixed-value exceptions remaining.

- [x] Review each matching file individually; replace eligible literal pixel dimensions with CSS interpolations such as `${horizontalScale(16)}px`, `${verticalScale(20)}px`, `${moderateScale(12)}px`, or `${fontPixel(14)}px` according to the property.
- [x] For dynamic values and shorthand spacing, normalize each axis separately and retain unitless or percentage values.
- [x] Scan all `src/**/*.ts` and `src/**/*.tsx` for remaining fixed UI dimensions; inspect each match and retain only documented exceptions.
- [x] Run `./node_modules/.bin/prettier --check 'src/**/*.ts' 'src/**/*.tsx'` and `git diff --check`; do not add or run tests unless requested.
