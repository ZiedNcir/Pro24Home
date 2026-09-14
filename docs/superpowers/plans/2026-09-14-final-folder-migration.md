# Final Folder Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove active legacy folder dependencies and make each application module import only its public architectural owner.

**Architecture:** Move legacy Intervention and Home supporting code with the already-migrated screens that consume it. Promote types and normalizers to entities, make `shared/ui` the only generic UI owner, and expose each feature and role through a public `index.ts`. Delete legacy folders only after static import audits are empty.

**Tech Stack:** React Native, TypeScript, Redux Toolkit Query, React Navigation, Jest, ESLint.

**Spec:** `docs/superpowers/specs/2026-09-14-final-folder-migration-design.md`

## Global Constraints

- Preserve current route names, endpoint paths and visible UI behaviour.
- Dependencies flow `app → roles/features → entities → core/shared`.
- `features/*` never imports `@roles/*`.
- Do not duplicate API types, RTK Query endpoints, normalizers or UI implementations.
- Use a TypeScript-supported `ignoreDeprecations` value in `tsconfig.json`.
- Full Jest, TypeScript and ESLint must pass before deleting compatibility folders.

---

### Task 1: Stabilize configuration and the Jest lifecycle

**Files:**
- Modify: `tsconfig.json`
- Modify: `__tests__/ClientForm.test.tsx`
- Modify: `jest.setup.js`
- Test: `__tests__/ClientForm.test.tsx`, `__tests__/sharedUiForm.test.tsx`

**Interfaces:**
- Consumes: TypeScript 5.9 and React Native Jest setup.
- Produces: a valid compiler configuration and test teardown with no pending UI timers.

- [ ] **Step 1: Capture the failing checks**

Run:

```bash
npx tsc --noEmit
npx jest __tests__/ClientForm.test.tsx __tests__/sharedUiForm.test.tsx --runInBand --silent
```

Expected: TypeScript rejects `ignoreDeprecations: "6.0"`; the combined test process exposes the pending ClientForm timer.

- [ ] **Step 2: Make the configuration and test cleanup explicit**

Set `ignoreDeprecations` to `"5.0"` in `tsconfig.json`. In `ClientForm.test.tsx`, retain every fake timer handle created by the component test and call `jest.clearAllTimers()` before `jest.useRealTimers()` in `afterEach`. In `jest.setup.js`, define `window.dispatchEvent = jest.fn()` when it is absent so React test renderer can report errors in the React Native environment.

- [ ] **Step 3: Verify the failing checks are green**

Run:

```bash
npx tsc --noEmit
npx jest __tests__/ClientForm.test.tsx __tests__/sharedUiForm.test.tsx --runInBand --silent
```

Expected: both commands pass.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json __tests__/ClientForm.test.tsx jest.setup.js
git commit -m "fix: stabilize typecheck and ui test teardown"
```

### Task 2: Make Intervention features self-contained

**Files:**
- Move: `src/screens/Intervention/components/new-intervention/*` to `src/features/intervention-creation/ui/*`
- Move: `src/screens/Intervention/components/StepProgress.tsx` to `src/features/intervention-creation/ui/StepProgress.tsx`
- Move: `src/screens/Intervention/utils/addressFlow.ts`, `googlePlaceAddress.ts`, `interventionPayload.ts`, `servicePannes.ts` to `src/features/intervention-creation/model/*`
- Move: `src/screens/Intervention/components/intervention-detail/*` to `src/features/intervention-detail/ui/*`
- Move: `src/screens/Intervention/utils/interventionPresentation.ts` to `src/entities/intervention/model/intervention-presentation.ts`
- Move: `src/screens/Intervention/utils/routePresentation.ts` to `src/roles/professional/intervention-tracking/model/route-presentation.ts`
- Test: `__tests__/interventionPayload.test.ts`, `__tests__/addressFlow.test.ts`, `__tests__/interventionPresentation.test.ts`, `__tests__/routePresentation.test.ts`

**Interfaces:**
- Consumes: existing function exports without signature changes.
- Produces: feature/entity/role-owned UI and model paths; no `@screens/Intervention` imports outside the compatibility audit.

- [ ] **Step 1: Add path-level boundary assertions**

Extend the four existing test files with import assertions for their new owner paths. Preserve the current named exports: `buildInterventionPayload`, `canContinueAddressSelection`, `getInterventionDetailCopy`, and `getRouteFitCoordinates`.

- [ ] **Step 2: Move creation and detail code with imports intact**

Use `git mv` for each listed file. Replace imports in `NewInterventionScreen.tsx` with `@features/intervention-creation/ui/*` and `@features/intervention-creation/model/*`. Replace imports in `InterventionDetailScreen.tsx` with `@features/intervention-detail/ui/*` and `@entities/intervention/model/intervention-presentation`.

- [ ] **Step 3: Move professional route logic**

Replace the tracking screen imports with `@roles/professional/intervention-tracking/model/route-presentation`. Keep `getInterventionAddress` and `getInterventionClientName` in the Intervention entity presentation module because they derive from common intervention data.

- [ ] **Step 4: Verify no feature imports legacy Intervention**

Run:

```bash
rg -n "@screens/Intervention" src/features src/roles
npx jest __tests__/interventionPayload.test.ts __tests__/addressFlow.test.ts __tests__/interventionPresentation.test.ts __tests__/routePresentation.test.ts --runInBand --silent
```

Expected: the search has no output; all focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/intervention-creation src/features/intervention-detail src/entities/intervention src/roles/professional/intervention-tracking src/screens/Intervention __tests__
git commit -m "refactor: move intervention logic to owned modules"
```

### Task 3: Move shared Intervention primitives and remove its legacy directory

**Files:**
- Move: `src/screens/Intervention/components/InterventionHeader.tsx` to `src/shared/ui/navigation/InterventionHeader.tsx`
- Move: `BottomActions.tsx`, `InfoNotice.tsx`, `SelectableCard.tsx` to `src/shared/ui/*`
- Move: `AddressCard.tsx`, `ServiceSummaryCard.tsx`, `PhotoPickerRow.tsx` to entity UI directories matching their data type
- Modify: all consumers returned by `rg -l "@screens/Intervention" src`
- Delete: `src/screens/Intervention`
- Test: `__tests__/sharedUiLayout.test.tsx`, `__tests__/interventionPresentation.test.ts`

**Interfaces:**
- Consumes: existing component props unchanged.
- Produces: imports from `@shared/ui`, `@entities/address/ui`, `@entities/service/ui`, or `@entities/intervention/ui`.

- [ ] **Step 1: Record each existing component’s public props**

Before moving, run `rg -n "interface .*Props|type .*Props|const .*: React" src/screens/Intervention/components` and copy each existing component export unchanged into its target file.

- [ ] **Step 2: Move generic versus domain UI**

Move generic navigation/action components to `shared/ui`; move data-rendering cards to their entity `ui` directories. Update each import using the target alias, for example:

```ts
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import AddressCard from '@entities/address/ui/AddressCard';
```

- [ ] **Step 3: Delete only after an import audit**

Run:

```bash
rg -n "@screens/Intervention|screens/Intervention" src __tests__
```

Expected: no output. Then delete `src/screens/Intervention` and its empty parent entries.

- [ ] **Step 4: Verify**

Run: `npx jest __tests__/sharedUiLayout.test.tsx __tests__/interventionPresentation.test.ts --runInBand --silent`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui src/entities src/features src/roles src/screens __tests__
git commit -m "refactor: retire legacy intervention folder"
```

### Task 4: Move Home ownership and retire its legacy client tree

**Files:**
- Move: `src/screens/Home/client/component/*` to `src/roles/client/home/ui/*`
- Move: `accountPending.ts`, `contactSupport.ts` to `src/roles/client/home/model/*`
- Move: `professionalStatus.ts` to `src/roles/professional/dashboard/model/professional-status.ts`
- Move: `professionalDocuments.ts` to `src/roles/professional/documents/model/professional-documents.ts`
- Modify: `src/screens/Home/client/screens/HomeGate.tsx`, then delete it once navigation owns its routing decision
- Delete: `src/screens/Home`
- Test: `__tests__/accountPending.test.ts`, `__tests__/contactSupport.test.ts`, `__tests__/professionalStatus.test.ts`, `__tests__/professionalDocuments.test.ts`

**Interfaces:**
- Consumes: `ACCOUNT_PENDING_STEPS`, `SUPPORT_TOPICS`, `buildProfessionalStatusPayload`, and `PROFESSIONAL_DOCUMENTS` unchanged.
- Produces: role-owned imports with no path through `screens/Home/client`.

- [ ] **Step 1: Move role-specific UI and models**

Move all client home components and client helpers to `roles/client/home`. Move the two professional helpers to their professional role models. Replace all imports in role screens with their local public paths.

- [ ] **Step 2: Absorb HomeGate in app navigation**

Use the existing auth navigation result to select `Tabs`, `ProfessionnelHome`, or `AccountPendingScreen` in `RootNavigator`; remove `HomeGate.tsx` after no import remains.

- [ ] **Step 3: Audit and verify**

Run:

```bash
rg -n "@screens/Home|screens/Home" src __tests__
npx jest __tests__/accountPending.test.ts __tests__/contactSupport.test.ts __tests__/professionalStatus.test.ts __tests__/professionalDocuments.test.ts --runInBand --silent
```

Expected: no legacy import and all four suites pass.

- [ ] **Step 4: Commit**

```bash
git add src/roles src/app/navigation src/screens/Home __tests__
git commit -m "refactor: retire legacy home folder"
```

### Task 5: Move Auth and Welcome into the auth feature

**Files:**
- Move: `src/screens/Welcome.tsx` to `src/features/auth/ui/WelcomeScreen.tsx`
- Move: `src/screens/Auth/*.tsx` and `src/screens/Auth/component/*` to `src/features/auth/ui/*`
- Modify: `src/app/navigation/RootNavigator.tsx`
- Delete: `src/screens/Auth`, `src/screens/index.ts`
- Test: `__tests__/Welcome.test.tsx`, `__tests__/authNavigation.test.ts`, `__tests__/authActions.test.ts`, `__tests__/registrationWizard.test.tsx`

**Interfaces:**
- Consumes: the existing navigation screen exports and auth API hooks.
- Produces: `@features/auth` public exports for Welcome, sign-in, registration, verification and recovery.

- [ ] **Step 1: Create the auth public entry**

Create `src/features/auth/index.ts` exporting the exact screen names consumed by `RootNavigator`:

```ts
export { default as Welcome } from './ui/WelcomeScreen';
export { default as SignIn } from './ui/SignInScreen';
export { default as RegisterScreen } from './ui/RegisterScreen';
```

- [ ] **Step 2: Move UI and update relative imports**

Move the source files and change component references to `@features/auth/ui/*`. Keep `RegistrationWizard` as the shared registration UI implementation and update imports rather than copying form logic.

- [ ] **Step 3: Update navigation and remove legacy exports**

Replace all `@screens/index` and `@screens/Auth/*` imports in `RootNavigator` with `@features/auth`. Delete the old auth barrel only after `rg -n "@screens/Auth|@screens/index" src __tests__` is empty.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npx jest __tests__/Welcome.test.tsx __tests__/authNavigation.test.ts __tests__/authActions.test.ts __tests__/registrationWizard.test.tsx --runInBand --silent
git add src/features/auth src/app/navigation src/screens __tests__
git commit -m "refactor: move auth ui into auth feature"
```

### Task 6: Replace store API types with entity model exports and finalize public APIs

**Files:**
- Create: `src/entities/*/model/index.ts` and entity type files
- Modify: every import returned by `rg -l "@store/api/(api.types|utils)" src --glob '!store/**'`
- Create: `index.ts` in every feature and role module
- Delete: `src/store/api/api.types.ts` and obsolete compatibility re-exports after audit
- Test: `__tests__/entityTypes.test.ts`, `__tests__/entityApiFacade.test.ts`

**Interfaces:**
- Consumes: existing named type exports such as `UserType`, `Intervention`, `Address`, `Service`, `Document`, `Notification` and `CreateInterventionRequest`.
- Produces: the same names from owning entity model entries.

- [ ] **Step 1: Create entity type re-exports without changing contracts**

Split the current declarations into entity model files and export them through each entity `model/index.ts`. Update one bounded domain at a time, beginning with Intervention and Address, then User/Auth, Service, Payment/Documents, Notification, Quote and Reclamation.

- [ ] **Step 2: Replace source imports**

For each domain, replace imports with its owning alias, for example:

```ts
import type { Intervention, CreateInterventionRequest } from '@entities/intervention/model';
import type { Address } from '@entities/address/model';
```

- [ ] **Step 3: Add module public entries**

Create `index.ts` in every direct feature and role child. Export only its screens, hooks and APIs meant for consumers; `RootNavigator` imports from `@features/<module>` or `@roles/<role>/<module>` rather than internal paths.

- [ ] **Step 4: Remove old type access only after audit**

Run:

```bash
rg -n "@store/api/(api.types|utils)" src --glob '!store/**'
```

Expected: no output. Delete obsolete `store/api` type and normalizer compatibility files only after this succeeds.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npx jest __tests__/entityTypes.test.ts __tests__/entityApiFacade.test.ts --runInBand --silent
git add src/entities src/features src/roles src/store __tests__
git commit -m "refactor: expose entity types through domain models"
```

### Task 7: Final compatibility removal and full verification

**Files:**
- Delete: `src/components` compatibility adapters after consumer audit
- Delete: any remaining `src/screens` directory
- Modify: `docs/superpowers/specs/2026-09-14-final-folder-migration-design.md`
- Test: all Jest suites

**Interfaces:**
- Consumes: completed public feature and role entries.
- Produces: no legacy screen or component import paths.

- [ ] **Step 1: Run final static audits**

Run:

```bash
rg -n "@screens/|screens/" src __tests__
rg -n "@components/(Button|Field|ScreenContainer|NavigationHeader|CheckBox)" src __tests__
rg -n "@store/api/(api.types|utils)" src --glob '!store/**'
rg -n "@roles/" src/features
```

Expected: each command has no output except declarations inside configured compatibility tests.

- [ ] **Step 2: Delete compatibility folders and update documentation**

Delete only the adapters and folders proven unused by Step 1. Update the design document to mark the legacy trees retired.

- [ ] **Step 3: Run the full verification suite**

Run:

```bash
npx tsc --noEmit
npm test -- --runInBand --silent
npm run lint
git diff --check
```

Expected: all commands complete with zero errors.

- [ ] **Step 4: Commit**

```bash
git add src docs __tests__ tsconfig.json jest.setup.js
git commit -m "refactor: complete legacy folder migration"
```
