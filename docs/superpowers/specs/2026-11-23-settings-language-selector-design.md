# Add Language Selection in Settings

## Intent

Let users select French or English from Settings, where the current language row is presently non-interactive.

## Goals

- Open a language selector from the Settings language row.
- Offer French and English, the two languages supported by the app translations.
- Apply the selected language immediately and remember it across app launches.
- Fall back to the device language when the user has not saved a preference.

## Non-goals and anti-goals

- Do not add Arabic translations or expose Arabic as a selectable option.
- Do not change the translations or unrelated settings.

## Constraints

- Use the existing i18next resources and `client.settings.languageFrench` / `languageEnglish` labels.
- Use the app's existing AsyncStorage dependency for persistence.
- Preserve device-locale behavior when no preference is saved.

## Approaches

1. **In-app selector with persisted choice (recommended).** The row opens a small modal with French and English. Selection updates i18next immediately and is read at startup. This behaves like a durable Settings preference.
2. **Temporary prompt.** An alert can switch languages for the current session, but the app returns to the device language on relaunch.

The in-app selector with persistence is selected as the default because language settings are expected to remain selected after closing the app.

## Builder decisions

- Keep the language row's value synchronized with `i18n.resolvedLanguage`.
- Store only `fr` or `en`; ignore invalid saved values and fall back to device locale.
- On startup, apply the saved preference before hiding the splash screen, with device locale as fallback if storage fails.
