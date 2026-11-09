# Unavailable Interventions Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep requests with no available professional on the same phone across logout, with full details and a Payer retry action.

**Architecture:** Account-scoped AsyncStorage records hold submission payloads and display snapshots. RTK Query local endpoints expose records to existing list and detail screens. Payment submission distinguishes availability rejection from unrelated failures.

**Tech Stack:** React Native, TypeScript, RTK Query, AsyncStorage, Jest.

**Spec:** docs/superpowers/specs/2026-10-27-unavailable-interventions-design.md

## Global Constraints
- Preserve existing uncommitted workspace changes.
- No backend or payment gateway changes.
- Never expose another account's saved records.
- Keep local records until submission succeeds.

## Review Focus
- Account switching and sign-out preserve storage without leaking records.
- Network, authentication and validation failures are not availability failures.
- Repeated unavailable retries retain one record.
- Failed storage reads/writes do not silently destroy data.
- Local records remain visible without remote data.

### Task 1: Storage and submission classification
**Files:** Create `src/entities/intervention/model/local-interventions.ts`, `__tests__/localInterventions.test.ts`.
**Interfaces:** `readLocalInterventions(userId)`, `saveLocalIntervention(userId, record)`, `removeLocalIntervention(userId, id)`, `isNoProfessionalResponse(value)`.
- [x] Write tests for account isolation, round-trip details, repeated saves, removal, malformed storage and explicit availability classification.
- [x] Run targeted Jest; expect failure for missing implementation.
- [x] Implement serialized per-account persistence, validation and conservative classification.
- [x] Run targeted Jest; expect passing tests.

### Task 2: List, details and retry flow
**Files:** Create local RTK endpoints; modify creation, estimation, payment, list, detail, navigation types and translations.
**Interfaces:** Local endpoints consume Task 1 functions; routes carry display snapshot and optional local record ID.
- [x] Add flow tests for unavailable rejection, unrelated failures, retry deduplication and successful removal.
- [x] Run tests to confirm missing flow behavior.
- [x] Wire account-scoped local queries into client list and details, preserve snapshots and implement retry submission.
- [x] Verify targeted tests, entire Jest suite, TypeScript and changed-file lint.


## Execution and verification

Implemented in the existing working directory to preserve the user's prior uncommitted changes. No commits or external changes were made.

- Local records use an account-specific index plus separate record keys, keeping photo-heavy requests below Android's per-item storage limit.
- Photos use size-limited embedded image data instead of temporary picker paths. React Native's installed iOS DataRequestHandler and Android RequestBodyUtil support data URI uploads.
- A successful server submission gets an account-specific confirmation marker before best-effort cleanup. A cleanup failure cannot re-enable submission for that record.
- Independent review identified cleanup retry duplication and temporary photo references; both were fixed with regression tests.
- Feature and payload tests: 26 passed.
- Full Jest run: 129 passed, 18 failed, across 44 suites (33 passed, 11 failed).
- TypeScript, changed-source ESLint, translation checks and whitespace checks passed.
- Device/simulator verification was not performed.

### Existing test failures

The pristine HEAD baseline reproduced 10 failing suites (17 failing tests). The remaining `sharedUiForm` failure was also reproduced in that baseline after copying only the user's pre-existing shared UI/theme changes; no feature code was included.

Failing suites:
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


## Interface follow-up

Updated the unavailable intervention detail view with a dedicated status panel, saved-request confirmation, service summary, existing request/address/map details, photo gallery, and a payment summary with Payer. At the user’s request, Mes interventions keeps its original card structure (icon, request details, status and chevron); only the detail screen receives the new presentation. Theme tokens support both light and dark modes. Existing retry and persistence behavior is unchanged. No simulator was booted, so visual device verification was not performed.
