# Professional Onboarding Implementation Plan

> Use superpowers:executing-plans for implementation and superpowers:test-driven-development for meaningful contract/scenario changes.

**Goal:** Complete the professional account journey agreed with the user.
**Architecture:** Existing RTK Query endpoints and screens; common helpers for verification context and document submission readiness.
**Spec:** docs/superpowers/specs/2026-11-07-professional-onboarding-design.md

## Constraints
Preserve the unrelated dirty workspace. No live account creation or credential use. No guessed server routes, required referral data, or approval states.

## Tasks
- [x] Add failing tests for multipart professional registration/verification/resend, no premature authentication and business-error handling.
- [x] Align the endpoints and registration callback; carry the phone to verification and allow service-load retry.
- [x] Add failing scenarios for unverified login and document submission readiness; implement shared helpers and route safely.
- [x] Complete Documents progression for pending/rejected/approved states; add refresh and actual logout to the waiting screen.
- [x] Run focused tests, TypeScript, lint, translations and full suite. Request independent review of changed flows and fix important findings.

## Review focus
Registration callback executes once; no authenticated route before phone verification. Missing phone does not submit an empty value. Failed business responses do not claim success. Pending documents allow dossier submission, rejected documents require replacement. Refresh and logout failures do not send the user into an invalid authenticated destination.


## Verification
- 35 focused tests passed across 8 suites, including real SignIn screen cases and multipart request contracts.
- Full suite: 179 passed, 18 failed across 54 suites (43 passed, the same 11 previously failing suites).
- TypeScript without incremental caching, scoped ESLint, translations and whitespace checks passed.
- Independent review found a fulfilled-login-without-token navigation flaw. A real SignIn test reproduced it, the screen/API guard was fixed, and the test passed.
- No live registration, SMS resend, file upload or account-status request was made. Device walkthrough remains to be performed.
- The existing GET /api/profile service is reused for dossier refresh, although that route remains absent from the supplied collection. No server route was invented.

## Implementation decisions
- Retain the existing verification → sign-in → documents journey; do not retain a registration token as an authenticated session.
- Treat source/commercial_id as optional referral context. Zone selection and optional vehicles remain outside the confirmed signup/verification/documents scope.
- Use the latest upload timestamp to resolve a replaced rejected document. Without upload dates, keep unresolved rejections visible instead of guessing their order.
- Keep unrelated workspace changes and existing test failures untouched. No commit or external change was made.

## Existing failing suites
- `__tests__/AccountTypeScreen.test.tsx`
- `__tests__/ClientForm.test.tsx`
- `__tests__/Welcome.test.tsx`
- `__tests__/contactSupport.test.ts`
- `__tests__/interventionPresentation.test.ts`
- `__tests__/interventionsResponse.test.ts`
- `__tests__/professionalNavigation.test.ts`
- `__tests__/registrationPayload.test.ts`
- `__tests__/routePresentation.test.ts`
- `__tests__/servicesResponse.test.ts`
- `__tests__/sharedUiForm.test.tsx`


## Navigation follow-up requested by the user

Professional registration now goes directly to SignIn. Inactive login responses may establish a restricted session only with the real user/access_token supplied by the server (confirmed by the user). Pending/partial upload metadata is persisted per account on the phone, separately from session keys. The last confirmed required upload persists completion and immediately opens ProfessionalVerificationPending; later inactive sign-ins skip upload when this account's marker exists, including when login omits document metadata. Server activation/rejection takes precedence.

Verification: 43 focused tests passed (7 suites), covering real sign-in/upload/pending screens and persistence across logout. Full suite: 195 passed, 18 pre-existing failures (46 suites passed, the same 11 suites failed; 57 total). TypeScript without incremental caching, scoped lint, translations and whitespace checks passed. Independent review identified a local-read gate on server activation/rejection and an inactive-response credentials bypass; both were reproduced with failing UI tests and corrected. No device/server walkthrough was performed.
