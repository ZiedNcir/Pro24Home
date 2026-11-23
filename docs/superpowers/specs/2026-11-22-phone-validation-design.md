# Signup phone validation design

## Intent

Reject invalid phone numbers before client or professional account registration, and submit valid international numbers without formatting spaces so the API can persist a normalized value.

## Goals

- Validate the number specifically for the selected country using the already-installed `google-libphonenumber` metadata.
- Apply the same validation to both client and professional signup forms.
- Preserve the selected country when the user moves between signup steps.
- Send each accepted phone number in canonical E.164 form, without spaces or other formatting characters, before either API mutation is called.
- Reuse the existing localized invalid-phone message. Declare `google-libphonenumber` as a direct dependency; it is already installed transitively through the phone input package.
- Preserve leading zeroes that are significant in some countries, including Italy.
- Show the selected country in the phone field even when the typed number has a different calling code.

## Non-goals and constraints

- Do not change the phone number shown while the user edits the form.
- Do not change verification or password recovery API routes; pass the same canonical signup phone to account verification.
- The mobile app can ensure the API receives a normalized number; database persistence ultimately depends on backend behavior.

## Approaches

- Use `PhoneNumberUtil.isValidNumberForRegion()` with the selected ISO country. This distinguishes regions that share a calling code and uses metadata already present in the lockfile. **Chosen.**
- Use a generic international-number regex. This would not validate country-specific numbering rules and could accept truncated numbers.
- Add a separate phone-number package. This adds dependency and metadata duplication despite the existing component already providing validation.

## Implementation outline

Add an opt-in country-aware field validation to the shared phone input, using the explicit selected region and preserving significant leading zeroes. Keep the selected ISO code in each signup form so it survives step unmounts. Enable validation for both forms, declare the existing phone metadata package directly, and canonicalize valid values to E.164 in `prepareRegistrationPayload` before constructing either client or professional payload. Keep the existing API field name.
