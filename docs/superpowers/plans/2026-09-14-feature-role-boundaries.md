# Feature and Role Boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `features` role-neutral and put client/professional workflows behind their respective `roles` boundaries.

**Architecture:** Shared resource reads, presentation helpers and reusable UI remain in `entities` and `features`. Role-specific mutations, navigation actions and screens live under `roles/client` or `roles/professional`; the app navigation layer composes the appropriate role screen. The feature layer must never import a role module.

**Tech Stack:** React Native, TypeScript, React Navigation, Redux Toolkit Query, Jest.

**Spec:** `docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md`

## Global Constraints

- Preserve the current visual behaviour and navigation route names.
- Do not duplicate intervention DTOs, normalizers or RTK Query endpoint implementations.
- `features/*` must not import `@roles/*`.
- Keep `src/components` as a compatibility layer while `src/shared/ui` remains canonical.
- Verify with TypeScript, Jest and ESLint before committing.

---

### Task 1: Move the client-only profile workflow to the client role

**Files:**
- Move: `src/features/profile/screens/ProfileScreen.tsx` to `src/roles/client/profile/screens/ProfileScreen.tsx`
- Modify: `src/app/navigation/RootNavigator.tsx`
- Test: `__tests__/entityApiFacade.test.ts`

**Interfaces:**
- Consumes: `useUpdateClientProfileMutation`, `selectUser`, and the existing `Profile` route.
- Produces: `@roles/client/profile/screens/ProfileScreen` as the only client profile screen import.

- [ ] **Step 1: Add a boundary assertion**

Add an assertion that the client profile implementation imports `useUpdateClientProfileMutation` from the user entity API, while the removed feature path is not required by `RootNavigator`.

- [ ] **Step 2: Run the focused test**

Run: `npx jest __tests__/entityApiFacade.test.ts --runInBand --silent`

Expected: PASS before moving the file because the entity API contract is unchanged.

- [ ] **Step 3: Move the screen and update composition**

Move `ProfileScreen.tsx` to `roles/client/profile/screens`. Replace the navigator import with:

```ts
import ProfileScreen from '@roles/client/profile/screens/ProfileScreen';
```

Leave entity API usage inside the moved role screen; do not create a role-to-feature adapter.

- [ ] **Step 4: Verify the boundary**

Run: `rg -n "@features/profile|features/profile" src`

Expected: no runtime imports remain.

- [ ] **Step 5: Commit**

```bash
git add src/roles/client/profile src/features/profile src/app/navigation/RootNavigator.tsx
git commit -m "refactor: place client profile in client role"
```

### Task 2: Remove the feature-to-professional dependency from intervention detail

**Files:**
- Create: `src/roles/professional/intervention-detail/api/intervention-actions.api.ts`
- Create: `src/roles/professional/intervention-detail/model/use-professional-intervention-actions.ts`
- Create: `src/roles/client/intervention-detail/model/use-client-intervention-rating.ts`
- Modify: `src/features/intervention-detail/screens/InterventionDetailScreen.tsx`
- Modify: `src/app/navigation/RootNavigator.tsx`
- Test: `__tests__/interventionPresentation.test.ts`

**Interfaces:**
- Consumes: `useAcceptInterventionMutation`, `useReviseInterventionMutation`, `useAddRatingMutation`, and `AppStackType`.
- Produces: role-specific action hooks that accept an intervention id and navigation callback; the feature screen receives no import from `@roles`.

- [ ] **Step 1: Add failing boundary tests**

Create tests that assert the feature screen source has no `@roles/` import and that each role action hook exposes `accept`, `refuse`, or `submitRating` functions returning the existing RTK Query promise.

- [ ] **Step 2: Run the focused tests**

Run: `npx jest __tests__/interventionPresentation.test.ts --runInBand --silent`

Expected: existing presentation tests pass; new boundary tests fail until the hooks exist.

- [ ] **Step 3: Extract role action hooks**

Implement professional actions over `useAcceptInterventionMutation` and `useReviseInterventionMutation`. Implement client rating over `useAddRatingMutation`. Keep all response and mutation types from the existing entity APIs.

- [ ] **Step 4: Compose role actions in app navigation**

Create a role-aware intervention detail entry in `app/navigation` that selects the client or professional action controller based on `selectIsProfessional`; pass callbacks and loading states to the feature presentation screen.

- [ ] **Step 5: Verify dependency direction**

Run: `rg -n "@roles/" src/features`

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/features/intervention-detail src/roles/client/intervention-detail src/roles/professional/intervention-detail src/app/navigation
git commit -m "refactor: isolate intervention actions by role"
```

### Task 3: Document and verify the final module rules

**Files:**
- Modify: `docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md`
- Test: `__tests__/entityApiFacade.test.ts`, `__tests__/interventionPresentation.test.ts`

**Interfaces:**
- Consumes: final source tree and the role-neutral feature rule.
- Produces: explicit documented dependency rule: `app -> roles/features -> entities/core/shared`, with no `features -> roles` edge.

- [ ] **Step 1: Add the dependency rule to the design document**

Add: `features must not import roles; role modules may consume feature APIs only when the feature is role-neutral.`

- [ ] **Step 2: Run static boundary checks**

Run:

```bash
rg -n "@roles/" src/features
rg -n "@features/" src/roles
```

Expected: first command has no output; second command contains only `@features/auth/api/auth.api` from the client settings workflow.

- [ ] **Step 3: Run verification**

Run:

```bash
npx tsc --noEmit --ignoreDeprecations 5.0
npm test -- --runInBand --silent
npm run lint
```

Expected: TypeScript and lint have no errors. If the known ClientForm timer makes the aggregate Jest run flaky, run `ClientForm.test.tsx` and `sharedUiForm.test.tsx` separately and report the aggregate limitation.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md
git commit -m "docs: define feature and role dependency rules"
```

## Execution adjustment

The existing intervention detail screen is a shared presentation surface with role-conditional actions, and rewriting it into two route controllers would duplicate its data loading and presentation. The implemented boundary is therefore narrower and preserves that shared screen: `useAcceptInterventionMutation` and `useReviseInterventionMutation` are exposed through `entities/intervention/api/intervention-actions.api.ts`. This removes the forbidden `features → roles` dependency without duplicating the intervention detail workflow. Role-only navigation and tracking remain under `roles/professional`.
