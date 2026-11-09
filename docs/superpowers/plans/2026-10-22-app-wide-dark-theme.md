# App Wide Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make app UI colors follow the active palette and make dark mode readable and consistent while preserving light mode.

**Architecture:** Keep `ThemeProvider` as the active palette source. Correct the dark semantic palette, migrate runtime consumers of the static `colors` export to `useTheme()` or styled-components theme access, then replace theme-dependent fixed light colors across app flows.

**Tech Stack:** React Native, TypeScript, styled-components/native, React Context.

**Spec:** `docs/superpowers/specs/2026-10-22-app-wide-dark-theme-design.md`

## Global Constraints

- Preserve light palette values and light-mode appearance.
- Keep the existing theme context as the source of the active palette.
- Leave layout, typography, interaction behavior, theme selection, and persistence unchanged.
- Keep intentional theme-independent brand colors and media artwork explicit.
- Do not mechanically substitute colors; retain each color's semantic purpose.
- Do not add or run tests unless the user asks; verify with source checks and visual review in both modes.

## Review Focus

- Dark input text and placeholders must contrast with dark input surfaces; review shared form fields and address/intervention forms.
- Orange selected and primary states must remain legible on dark surfaces; review selection cards, buttons, and badges.
- Semantic success, warning, error, and info fills must remain distinct from the background and their labels/icons readable; review notices and payment/status flows.
- Overlays and sheets must retain clear separation from content while using active surface colors; review dialogs, modals, and bottom sheets.
- Client and professional screens must both use the active palette; review representative screens from each role and the home flows.

---

## File map

- `src/theme/colors/dark.ts`, `src/theme/colors/light.ts`, and `src/theme/colors/types.ts`: semantic palette values and color shape.
- `src/theme/index.ts`: legacy static palette compatibility export; retain the export for compatibility but migrate runtime UI consumers away from it.
- `src/shared/ui/**`: reusable controls and overlays that must work for every consumer.
- `src/roles/**` and `src/features/**`: screens and feature components with role-specific surfaces, status fills, and selection states.
- `src/theme/provider/ThemeProvider.tsx`: unchanged; it continues to expose the selected theme.

## Task 1: Correct semantic palette values

**Files:**
- Modify: `src/theme/colors/dark.ts`
- Review: `src/theme/colors/light.ts`, `src/theme/colors/types.ts`

- [ ] Review all dark palette entries against their use: text/input, inverse text, neutral surfaces, borders, primary/accent fills, and semantic status fills.
- [ ] Update only dark values needed for readable foreground/background pairings; use dark-tinted semantic fills for `primaryLighter`, `successLight`, `warningLight`, `dangerLight`, and `infoLight` where these are used as dark-mode surfaces.
- [ ] Keep the palette shape unchanged and preserve all light palette values.
- [ ] Visually review text, form, selection, and status examples in dark mode, then confirm light mode is visually unchanged.

## Task 2: Migrate shared UI and notification components

**Files:**
- Modify: `src/shared/ui/form/HookFormField.tsx`
- Modify: `src/shared/ui/typography/Text.tsx`
- Modify: `src/shared/ui/button/Button.tsx`
- Modify: `src/shared/ui/overlay/AppSpinner.tsx`, `CustomModal.tsx`
- Modify: `src/features/notification-center/components/NotificationCard.tsx`
- Modify: `src/entities/intervention/model/presentation.ts` for theme-aware status fills/foregrounds

- [ ] Replace static palette reads in shared controls with `useTheme()` inside components or styled-components' `theme` in styled declarations.
- [ ] Replace fixed pressed, disabled, backdrop, or card colors when they represent the active app theme; preserve intentional semantic danger/success colors.
- [ ] Check the five review-focus cases owned by these controls in both modes, especially input text/placeholders, button states, overlays, and notifications.

## Task 3: Migrate client home, profile, and address flows

**Files:**
- Modify: `src/roles/client/home/screens/ContactSupportScreen.tsx`, `SettingsScreen.tsx`, `AccountPendingScreen.tsx`
- Modify: `src/roles/client/home/ui/HeroBanner.tsx`, `ClientHomeHeader.tsx`, `HeaderLocation.tsx`, `FeatureHighlights.tsx`
- Modify: `src/roles/client/profile/screens/ProfileScreen.tsx`
- Modify: `src/features/address-management/screens/SavedAddressesScreen.tsx`, `AddAddressScreen.tsx`

- [ ] Replace static palette access with the active theme in these components.
- [ ] Replace hard-coded light surfaces, dividers, borders, and selected fills with semantic active-theme tokens; keep brand illustration colors unchanged.
- [ ] Review home, profile, settings, support, and address screens in both modes for background, text, row, and form contrast.

## Task 4: Migrate client intervention, payment, and detail flows

**Files:**
- Modify: `src/roles/client/payment-flow/screens/PaymentTravelFeeScreen.tsx`, `InterventionSuccessScreen.tsx`, `PriceEstimationScreen.tsx`
- Modify: `src/features/intervention-creation/ui/PhotoPickerRow.tsx`
- Modify: `src/features/intervention-creation/ui/new-intervention/AddressModal.tsx`, `AddressStep.tsx`, `ServiceSelectionModal.tsx`, `SummaryStep.tsx`, `FullscreenMapModal.tsx`
- Modify: `src/features/intervention-list/screens/InterventionListScreen.tsx`
- Modify: `src/features/intervention-detail/screens/InterventionDetailScreen.tsx`
- Modify: `src/features/intervention-detail/ui/intervention-detail/ClientRatingModal.tsx`, `InterventionDetailSections.tsx`, `InterventionDetailSkeleton.tsx`

- [ ] Replace static palette reads with the active theme, including colors captured in module-scope styled declarations.
- [ ] Replace fixed light card, selected, divider, and status colors with semantic theme tokens while preserving map-provider and payment-brand requirements.
- [ ] Review creation, list/detail, travel fee, estimate, rating, and success states in both modes.

## Task 5: Migrate professional and authentication flows

**Files:**
- Modify: `src/roles/professional/dashboard/screens/DashboardScreen.tsx`
- Modify: `src/roles/professional/documents/screens/DocumentsScreen.tsx`
- Modify: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`
- Modify: `src/features/auth/ui/WelcomeScreen.tsx`
- Modify: `src/features/auth/ui/forms/ServicesSkeleton.tsx`

- [ ] Replace static palette reads with the active theme.
- [ ] Replace fixed light cards, badges, prompts, and empty/status surfaces with theme-aware values, retaining intentional state colors.
- [ ] Review professional dashboard, document status, tracking, and authentication entry screens in both modes.

## Task 6: Source audit and cross-flow review

**Files:**
- Review: all `src/` runtime consumers of `@theme` and fixed color literals in themed UI.
- Modify: `src/theme/index.ts` only if needed to clarify the retained compatibility export.

- [ ] Search `src/` for imports of `{ colors }` from `@theme`; resolve every remaining runtime UI use or document why it is intentionally theme-independent.
- [ ] Search themed UI for fixed light surface, border, and text colors; resolve each remaining use by context.
- [ ] Review client and professional representative flows in light and dark modes, including the five review-focus cases.
- [ ] Confirm `ThemeProvider` selection behavior and theme-related Redux state remain outside this change.
