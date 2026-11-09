# Theme Module Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the active project theme the sole source of rendered colors while keeping light/dark values and mode behavior unchanged.

**Architecture:** Theme-independent design values live in `theme/tokens`; complete light and dark palettes live in separate `theme/colors` modules. Theme assembly imports one palette plus shared tokens, and UI components obtain colors through the project `useTheme` context.

**Tech Stack:** React Native, TypeScript, styled-components/native, Jest, React Test Renderer.

**Spec:** `docs/superpowers/specs/2026-09-16-theme-module-design.md`

## Global Constraints

- Preserve the public `ThemeProvider`, `useTheme`, `setThemeMode`, and `toggleTheme` behavior.
- Preserve every current light and dark color value.
- Do not leave production UI importing a static `colors` palette.
- Do not keep component-specific duplicated presets in the global theme module.
- Keep `utils.ts` pure: no palette, theme mode, or provider state.

---

### Task 1: Separate shared tokens from complete light and dark palettes

**Files:**
- Create: `src/theme/colors/types.ts`
- Create: `src/theme/colors/light.ts`
- Create: `src/theme/colors/dark.ts`
- Create: `src/theme/tokens/index.ts`
- Modify: `src/theme/themes/lightTheme.ts`
- Modify: `src/theme/themes/darkTheme.ts`
- Modify: `src/theme/index.ts`
- Delete: `src/theme/tokens.ts`
- Delete: `src/theme/constants.ts`
- Test: `__tests__/sharedUiForm.test.tsx`

**Interfaces:**
- Produces: `lightColors` and `darkColors`, each satisfying `ThemeColors`.
- Produces: shared `spacing`, `borderRadius`, `typography`, `elevation`, `animation`, and `zIndex` from `@theme`.
- Produces: `lightTheme` and `darkTheme` from `@theme`, each with the unchanged `DefaultTheme` shape.

- [ ] **Step 1: Extend the dark-mode integration test with the unchanged light values**

```tsx
expect(StyleSheet.flatten(input.props.style)).toMatchObject({
  backgroundColor: '#FFFFFF',
  borderColor: '#E0E0E0',
  color: '#212121',
});
expect(input.props.placeholderTextColor).toBe('#BDBDBD');
```

- [ ] **Step 2: Run the focused test and verify it fails before the public light theme is available**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx`

Expected: FAIL because the new light-theme assertion or public palette export is not yet implemented.

- [ ] **Step 3: Define the palette contract and two full palettes**

```ts
// src/theme/colors/types.ts
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryLighter: string;
  secondary: string;
  secondaryLight: string;
  secondaryLighter: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;
  white: string;
  black: string;
  gray900: string;
  gray800: string;
  gray700: string;
  gray600: string;
  gray500: string;
  gray400: string;
  gray300: string;
  gray200: string;
  gray100: string;
  gray50: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  border: string;
  borderLight: string;
  borderDark: string;
  overlay: string;
  backdrop: string;
  transparent: string;
}
```

Move the exact current light values into `lightColors` and the exact current
dark overrides into a complete `darkColors` object. Do not spread one palette
into the other.

- [ ] **Step 4: Move non-color values into `tokens/index.ts` and build themes from one palette**

```ts
// src/theme/themes/lightTheme.ts
const lightTheme: DefaultTheme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  elevation,
  animation,
  zIndex,
};
```

Use the same composition in `darkTheme.ts`, substituting `darkColors` and the
existing darker elevation values. Keep the styled-components `DefaultTheme`
module augmentation tied to `ThemeColors` in `tokens/index.ts`.

- [ ] **Step 5: Make `@theme` the only public module entry**

Export the provider, hooks, `lightTheme`, `darkTheme`, palette types, and
shared tokens from `src/theme/index.ts`. Remove `constants.ts` only after
confirming no production import references it. Leave `utils.ts` unchanged
except for imports made obsolete by the move.

- [ ] **Step 6: Run the focused test and type check**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx && npx tsc --noEmit`

Expected: PASS; switching to dark mode still yields `#1E1E1E`, `#404040`,
`#FFFFFF`, and `#666666` for the field background, border, text, and
placeholder.

- [ ] **Step 7: Commit the foundation**

```bash
git add src/theme __tests__/sharedUiForm.test.tsx
git commit -m "refactor: separate theme palettes and tokens"
```

### Task 2: Migrate shared UI and entity components to the active theme

**Files:**
- Modify: `src/shared/ui/action/BottomActions.tsx`
- Modify: `src/shared/ui/action/InfoNotice.tsx`
- Modify: `src/shared/ui/form/HookFormField.tsx`
- Modify: `src/shared/ui/form/TextField.tsx`
- Modify: `src/shared/ui/icon/SvgIcon.tsx`
- Modify: `src/shared/ui/layout/ScreenContainer.tsx`
- Modify: `src/shared/ui/navigation/NavigationHeader.tsx`
- Modify: `src/shared/ui/selection/SelectableCard.tsx`
- Modify: `src/entities/address/ui/AddressCard.tsx`
- Modify: `src/entities/service/ui/CardService.tsx`
- Modify: `src/entities/service/ui/ServiceSummaryCard.tsx`
- Test: `__tests__/sharedUiForm.test.tsx`

**Interfaces:**
- Consumes: `{ theme } = useTheme()` from `@theme`.
- Produces: shared and entity UI whose rendered colors derive from
  `theme.colors`.

- [ ] **Step 1: Add a dark-mode assertion for one shared component that previously imported `colors`**

```tsx
await act(async () => setThemeMode('dark'));
expect(StyleSheet.flatten(sharedComponent.props.style).color).toBe('#FFFFFF');
```

- [ ] **Step 2: Run the focused test and verify the static palette prevents the expected dark color**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx`

Expected: FAIL until the selected shared component reads the project context.

- [ ] **Step 3: Replace static palette imports in each listed component**

```tsx
import { useTheme } from '@theme';

export const Component = () => {
  const { theme } = useTheme();
  return <View style={{ borderColor: theme.colors.border }} />;
};
```

Replace every `colors.<name>` in the listed files with
`theme.colors.<name>`. Do not call hooks in style module scope; move dependent
style objects into the component or merge a dynamic style after static styles.

- [ ] **Step 4: Run shared UI tests and TypeScript**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx __tests__/sharedUiLayout.test.tsx && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 5: Commit the shared UI migration**

```bash
git add src/shared/ui src/entities __tests__/sharedUiForm.test.tsx
git commit -m "refactor: read shared UI colors from active theme"
```

### Task 3: Migrate feature, role, and navigation UI to the active theme

**Files:**
- Modify: `src/app/navigation/RootNavigator.tsx`
- Modify: `src/features/address-management/screens/AddAddressScreen.tsx`
- Modify: `src/features/address-management/screens/SavedAddressesScreen.tsx`
- Modify: `src/features/auth/ui/WelcomeScreen.tsx`
- Modify: `src/features/auth/ui/forms/ProfessionalForm.tsx`
- Modify: `src/features/auth/ui/forms/ServicesSkeleton.tsx`
- Modify: `src/features/intervention-creation/ui/PhotoPickerRow.tsx`
- Modify: `src/features/intervention-creation/ui/StepProgress.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/AddressModal.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/AddressStep.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/DetailsStep.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/FullscreenMapModal.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/ServiceSelectionModal.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/SummaryStep.tsx`
- Modify: `src/features/intervention-detail/screens/InterventionDetailScreen.tsx`
- Modify: `src/features/intervention-detail/ui/intervention-detail/ClientRatingModal.tsx`
- Modify: `src/features/intervention-detail/ui/intervention-detail/InterventionDetailSections.tsx`
- Modify: `src/features/intervention-detail/ui/intervention-detail/InterventionDetailSkeleton.tsx`
- Modify: `src/features/intervention-list/screens/InterventionListScreen.tsx`
- Modify: `src/features/notification-center/components/NotificationCard.tsx`
- Modify: `src/features/notification-center/components/NotificationEmptyState.tsx`
- Modify: `src/features/notification-center/components/NotificationFilters.tsx`
- Modify: `src/features/notification-center/components/NotificationHeader.tsx`
- Modify: `src/roles/client/home/screens/AccountPendingScreen.tsx`
- Modify: `src/roles/client/home/screens/ContactSupportScreen.tsx`
- Modify: `src/roles/client/home/ui/ClientHomeHeader.tsx`
- Modify: `src/roles/client/home/ui/FeatureHighlights.tsx`
- Modify: `src/roles/client/home/ui/HeaderLocation.tsx`
- Modify: `src/roles/client/home/ui/HeroBanner.tsx`
- Modify: `src/roles/client/payment-flow/screens/InterventionSuccessScreen.tsx`
- Modify: `src/roles/client/payment-flow/screens/PaymentTravelFeeScreen.tsx`
- Modify: `src/roles/client/profile/screens/ProfileScreen.tsx`
- Modify: `src/roles/professional/dashboard/screens/DashboardScreen.tsx`
- Modify: `src/roles/professional/documents/screens/DocumentsScreen.tsx`
- Modify: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`
- Test: `__tests__/App.test.tsx`

**Interfaces:**
- Consumes: `{ theme } = useTheme()` from `@theme`.
- Produces: feature, role, and navigation styles that react to a theme-mode
  change without altering navigation or screen behavior.

- [ ] **Step 1: Add an integration assertion through the application provider tree**

```tsx
expect(tree.root.findByProps({ testID: 'root-navigator' })).toBeTruthy();
```

Keep the existing navigation behavior assertion and add a selected themed
element assertion after switching the project mode to dark.

- [ ] **Step 2: Run the application test and verify the selected static color does not change**

Run: `npm test -- --runInBand __tests__/App.test.tsx`

Expected: FAIL until the selected screen or navigator consumes `useTheme()`.

- [ ] **Step 3: Replace static `colors` imports in the listed files**

For each function component, import `useTheme` from `@theme`, destructure the
active `theme`, and substitute `theme.colors` at render time. Existing files
that already call `useTheme` must reuse that value rather than adding another
hook call.

- [ ] **Step 4: Confirm no production static palette imports remain**

Run: `rg -n "import \{ colors \} from ['\"]@theme['\"]" src`

Expected: no output.

- [ ] **Step 5: Run app-focused tests and TypeScript**

Run: `npm test -- --runInBand __tests__/App.test.tsx __tests__/authNavigation.test.ts __tests__/bottomTabBar.test.tsx && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit the feature and role migration**

```bash
git add src/app src/features src/roles __tests__/App.test.tsx
git commit -m "refactor: use active theme colors across screens"
```

### Task 4: Verify and document the consolidated theme boundary

**Files:**
- Modify: `docs/superpowers/plans/2026-09-16-theme-module-consolidation.md`

**Interfaces:**
- Consumes: the completed module boundary and migrated UI.
- Produces: a verified migration with no static UI palette dependency.

- [ ] **Step 1: Run the complete validation suite**

Run: `npm test -- --runInBand && npx tsc --noEmit && npm run lint && git diff --check`

Expected: all tests pass, TypeScript exits successfully, lint has no errors,
and the whitespace check emits no output.

- [ ] **Step 2: Inspect the final theme boundary**

Run: `find src/theme -maxdepth 3 -type f | sort && rg -n "@theme/(index|tokens|colors|themes|provider)" src`

Expected: the public `@theme` entry is the only production import path into
the theme module.

- [ ] **Step 3: Mark completed plan items and commit documentation**

```bash
git add docs/superpowers/plans/2026-09-16-theme-module-consolidation.md
git commit -m "docs: record theme module migration"
```
