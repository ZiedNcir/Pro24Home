# Settings Language Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users select French or English in Settings, apply it immediately, and keep it selected after app relaunch.

**Architecture:** Add a small AsyncStorage helper for validated `fr`/`en` preferences. The Settings language row opens an in-app selector and updates i18next. App startup loads the saved preference before hiding the splash screen, leaving the existing device-locale initialization as fallback.

**Tech Stack:** React Native, TypeScript, i18next, AsyncStorage.

**Spec:** `docs/superpowers/specs/2026-11-23-settings-language-selector-design.md`

## Global Constraints

- Use the existing i18next resources and `client.settings.languageFrench` / `languageEnglish` labels.
- Use the app's existing AsyncStorage dependency for persistence.
- Preserve device-locale behavior when no preference is saved.
- Store only `fr` or `en`; ignore invalid saved values.
- Do not add Arabic translations or expose Arabic as a selectable option.

## Review Focus

- Selecting French changes visible strings immediately.
- Selecting English changes visible strings immediately.
- The selected language remains after app restart.
- Missing, invalid, or unreadable saved preference falls back to device locale.
- The Settings row displays the active language and opens the selector.

---

### Task 1: Add validated language preference storage

**Files:**
- Create: `src/utils/language-preference.ts`
- Use: `src/utils/locale.ts`

**Interfaces:**
- Consumes: `SupportedLanguage` (`'fr' | 'en'`) from `src/utils/locale.ts` and the installed AsyncStorage module.
- Produces: `readLanguagePreference(): Promise<SupportedLanguage | null>` and `saveLanguagePreference(language: SupportedLanguage): Promise<void>`.

- [x] Read a single documented AsyncStorage key and return only `fr` or `en`; return `null` for missing or invalid values.
- [x] Save the selected supported language under the same key.

### Task 2: Make Settings language selection interactive

**Files:**
- Modify: `src/roles/client/home/screens/SettingsScreen.tsx`

**Interfaces:**
- Consumes: The language preference helper, `i18n.changeLanguage`, and existing translated language labels.
- Produces: A Settings row that opens a French / English selector, applies the selected language immediately, and displays the active choice.

- [x] Open a small modal selector when the language row is pressed; show French and English using the existing translation labels and indicate the active choice.
- [x] On selection, change i18next language, persist the choice, and close the selector.

### Task 3: Restore saved preference before app startup completes

**Files:**
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `readLanguagePreference()` and the initialized i18next instance.
- Produces: Startup that applies a valid saved language before hiding the splash screen, with existing device-locale initialization as fallback.

- [x] Load and apply the saved preference during startup; handle storage read failure by retaining the current device-locale language.
- [x] Hide the splash screen after preference loading settles and gate `RootNavigator` until the saved or device language is ready; preserve OneSignal initialization and cleanup behavior.
- [x] Review the focused diff and run `git diff --check` for changed files; do not alter unrelated workspace edits.
