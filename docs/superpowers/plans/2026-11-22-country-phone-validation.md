# Country-Aware Signup Phone Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reject invalid phone numbers during client and professional signup and send valid numbers in canonical E.164 form.

**Architecture:** Extend the shared phone field with an opt-in validator that calls `PhoneNumberUtil.isValidNumberForRegion()` with the selected ISO region. Keep the selected country in each parent signup form across step unmounts, preserve significant leading zeroes in the widget, render the selected-country flag, and canonicalize accepted numbers in the shared registration payload builder.

**Tech Stack:** React Native, TypeScript, react-hook-form, `react-native-phone-input`.

**Spec:** `docs/superpowers/specs/2026-11-22-phone-validation-design.md`

## Global Constraints

- Validate against the explicit selected ISO country, including countries sharing a calling code.
- Declare the already-installed `google-libphonenumber` package as a direct dependency; do not add a new package version.
- Preserve significant leading zeroes while country-specific validation is enabled.
- Keep country selection in the parent signup form so it survives step navigation.
- Canonicalize accepted numbers to E.164 before sending the signup request.
- Keep the displayed phone formatting unchanged.
- Remove whitespace from `phone_number` before sending client and professional signup payloads.
- Do not change verification or password recovery API routes; pass the canonical signup phone to verification so it matches the registered account.
- The app normalizes the API request; backend persistence behavior is outside this repository.
- Do not add or run automated tests unless requested.

## Review Focus

- An incomplete number or whitespace-only value must block signup before the API mutation.
- A valid number for the selected country must remain accepted.
- A number valid only for another region must be rejected, including shared calling-code cases.
- Changing the country selector must affect validation.
- Significant leading zeroes, including Italian fixed-line numbers, must be preserved.
- Formatting whitespace and punctuation must be removed from outgoing payloads while preserving the canonical `+` prefix and significant digits.
- Both client and professional signup must use the same rules.
- Returning to the phone step must retain the selected country and display its flag.

---

### Task 1: Add opt-in country-aware phone validation to the shared field

**Files:**
- Modify: `src/shared/ui/form/HookFormField.tsx`
- Create: `src/utils/phone-number.ts` for region validation and E.164 normalization.
- Modify: `package.json` and `package-lock.json` to declare the already-locked metadata package directly.

**Interfaces:**
- Add optional `validatePhoneByCountry?: boolean` to `FieldProps`.
- When enabled, append a `rules.validate` check that returns true only for the empty string (so `required` keeps its existing message), otherwise validate the form value with `PhoneNumberUtil.isValidNumberForRegion(parsed, selectedCountry)` and return the localized invalid-phone message on failure.
- Enable `allowZeroAfterCountryCode` only when this opt-in validation is enabled.

- [ ] Add the opt-in property and merge the validator with any existing custom validation rules.
- [ ] Keep the validator disabled by default so unrelated phone fields retain current behavior.

### Task 2: Enable validation on both signup forms

**Files:**
- Modify: `src/features/auth/ui/forms/ClientForm.tsx`
- Modify: `src/features/auth/ui/forms/ProfessionalForm.tsx`

**Interfaces:**
- Pass `validatePhoneByCountry={true}` to each registration phone field and remove the permissive length-only regex rule.
- Keep a country-code state in each parent form and pass it to the field, so it survives step unmounts.
- Pass the same country code to `prepareRegistrationPayload` for canonical E.164 serialization.

- [ ] Enable the same selected-country validation for both signup forms.
- [ ] Preserve each field's existing required message and registration flow.

### Task 3: Normalize signup payloads

**Files:**
- Modify: `src/features/auth/services/registration.ts`

**Interfaces:**
- In `prepareRegistrationPayload`, canonicalize valid `phone_number` with the selected country to E.164; if parsing fails, return the compact input (the form validator should block invalid submissions).

- [ ] Normalize the phone once in the shared payload builder so both client and professional requests send the same compact value.

### Task 4: Verify the touched files

**Files:**
- No additional files.

- [ ] Run ESLint on the modified TypeScript files.
- [ ] Review the diff to confirm country-aware validation is opt-in and payload normalization affects only signup.
