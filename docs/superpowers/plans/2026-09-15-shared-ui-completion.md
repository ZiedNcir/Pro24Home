# Shared UI Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Retire `src/components`, make `shared/ui` the generic UI owner, and finish the final architecture migration without changing application behaviour.

**Architecture:** Move generic UI implementations under `src/shared/ui` and expose their existing names through its public entry point. Update all consumers to import from that owner, give both bottom-tab navigators the stable `BottomTabBar` component reference, then remove proven-unused aliases and legacy folders.

**Tech Stack:** React Native 0.83, TypeScript 5.8, React Navigation 7, Jest 29, ESLint 8.

**Spec:** `docs/superpowers/specs/2026-09-15-shared-ui-completion-design.md`

## Global Constraints

- Preserve route names, destinations, UI and component prop contracts.
- Retain the existing SMS image-path correction in `src/features/auth/ui/VerifyScreen.tsx`.
- No runtime TypeScript source imports `@components/*` after the change.
- Remove `src/components` only after the import audit is empty.
- Delete only `.DS_Store` files discovered under `src`.
- TypeScript and Jest must pass; `RootNavigator` must have no unstable nested-component lint warnings.

---

### Task 1: Establish migration regression tests

**Files:**
- Modify: `__tests__/sharedUiLayout.test.tsx`

**Interfaces:**
- Consumes: public `@shared/ui` exports and `src/app/navigation/RootNavigator.tsx`.
- Produces: a public-API test that fails while generic primitives remain outside `shared/ui`.

- [x] **Step 1: Add the failing shared UI public-API test**

  Extend `__tests__/sharedUiLayout.test.tsx` with imports and assertions for the migrated API:

  ```ts
  import { AppImage, Spinner, SvgIcon, Text } from '@shared/ui';

  it('exposes generic primitives from the shared UI boundary', () => {
    expect(Text).toBeDefined();
    expect(SvgIcon).toBeDefined();
    expect(AppImage).toBeDefined();
    expect(Spinner).toBeDefined();
  });
  ```

- [x] **Step 2: Run the focused test and confirm the expected red state**

  Run:

  ```bash
  npx jest __tests__/sharedUiLayout.test.tsx --runInBand
  ```

  Expected: the shared API imports fail because the exports do not exist.

### Task 2: Move generic components into the shared owner

**Files:**
- Move: `src/components/Text.tsx` to `src/shared/ui/typography/Text.tsx`
- Move: `src/components/Icon/*` to `src/shared/ui/icon/*`
- Move: `src/components/Image/AppImage.tsx` to `src/shared/ui/image/AppImage.tsx`
- Move: `src/components/Modal/*` to `src/shared/ui/overlay/*`
- Move: `src/components/Toast/ToastConfig.tsx` to `src/shared/ui/toast/ToastConfig.tsx`
- Modify: `src/shared/ui/index.ts`
- Modify: all files returned by `rg -l "@components" src --glob '*.{ts,tsx}'`
- Modify: `src/app/navigation/RootNavigator.tsx`

**Interfaces:**
- Consumes: current default/named exports of `Text`, `Icon`, `SvgIcon`, `IconName`, `AppImage`, `Spinner`, `CustomModal`, `DialogModal`, and `ToastConfig`.
- Produces: identical exports from `@shared/ui` and its subpaths; a stable `BottomTabBar` function reference.

- [x] **Step 1: Move source files without changing component contracts**

  Use `git mv` to retain history. Keep each existing default export and named type exactly as currently declared. Create `index.ts` files where needed so these imports remain available:

  ```ts
  import Text from '@shared/ui/typography/Text';
  import { SvgIcon, type IconName } from '@shared/ui/icon';
  import AppImage from '@shared/ui/image/AppImage';
  import { Spinner } from '@shared/ui/overlay/AppSpinner';
  ```

- [x] **Step 2: Make `shared/ui` the complete public boundary**

  Extend `src/shared/ui/index.ts` with the migration-safe exports:

  ```ts
  export { default as Text } from './typography/Text';
  export { default as AppImage } from './image/AppImage';
  export { default as Icon } from './icon/Icon';
  export { default as SvgIcon } from './icon/SvgIcon';
  export * from './icon';
  export { Spinner } from './overlay/AppSpinner';
  export { default as CustomModal } from './overlay/CustomModal';
  export { default as DialogModal } from './overlay/DialogModal';
  ```

  Preserve any current named exports from moved component index files.

- [x] **Step 3: Update every consumer to the shared owner**

  Replace every `@components` import under `src` with an equivalent
  `@shared/ui` import. Update moved shared primitives to use sibling shared
  paths, ensuring the shared layer has no dependency on the retired alias.

- [x] **Step 4: Stabilize tab-bar identity**

  In both navigators in `src/app/navigation/RootNavigator.tsx`, replace:

  ```tsx
  tabBar={props => <BottomTabBar {...props} />}
  ```

  with:

  ```tsx
  tabBar={BottomTabBar}
  ```

- [x] **Step 5: Run the focused test and confirm green**

  Run:

  ```bash
  npx jest __tests__/sharedUiLayout.test.tsx --runInBand
  ```

  Expected: the shared UI suite passes with the public exports verified. The
  targeted `RootNavigator` lint result verifies that the stable tab bar removed
  the render-time component warning.

### Task 3: Retire compatibility paths and finish the migration record

**Files:**
- Delete: `src/components`
- Delete: `src/screens` when it contains only `.DS_Store`
- Modify: `babel.config.js`
- Modify: `tsconfig.json`
- Modify: `docs/superpowers/plans/2026-09-14-final-folder-migration.md`
- Modify: `src/features/auth/ui/VerifyScreen.tsx`

**Interfaces:**
- Consumes: all consumers migrated to `@shared/ui` in Task 2.
- Produces: no `@components` or `@screens` runtime compatibility path; an accurate completed migration plan.

- [x] **Step 1: Audit legacy imports before deletion**

  Run:

  ```bash
  rg -n "@components|@screens|src/components|src/screens" src --glob '*.{ts,tsx}'
  ```

  Expected: no runtime import output. Comments that name former paths must be removed or updated in the same task.

- [x] **Step 2: Remove compatibility code and aliases**

  Delete `src/components` and the empty `src/screens` tree only after Step 1
  is empty. Remove `@components` and `@screens` from both the TypeScript paths
  and Babel module-resolver aliases.

- [x] **Step 3: Preserve the already discovered asset correction**

  Keep this source path in `VerifyScreen.tsx`:

  ```tsx
  source={require('../../../assets/images/sms.png')}
  ```

  It is the path relative to the new feature location.

- [x] **Step 4: Remove only known macOS metadata**

  First list the targets with:

  ```bash
  find src -name .DS_Store -print
  ```

  Then delete exactly the returned files and re-run the listing. Expected:
  no output.

- [x] **Step 5: Update the existing final-folder plan**

  Mark Tasks 1–7 and their executed steps complete in
  `docs/superpowers/plans/2026-09-14-final-folder-migration.md`. Add a final
  verification note recording that screens and components were retired and
  that all four checks in Task 4 below were run.

### Task 4: Validate and commit the single change set

**Files:**
- Modify: all files from Tasks 1–3
- Test: all Jest suites

**Interfaces:**
- Consumes: the completed shared UI public boundary and retired compatibility paths.
- Produces: a verifiable architecture migration commit.

- [x] **Step 1: Run static boundary audits**

  Run:

  ```bash
  rg -n "@components|@screens" src --glob '*.{ts,tsx}'
  rg -n "@roles/" src/features --glob '*.{ts,tsx}'
  find src -name .DS_Store -print
  ```

  Expected: all commands produce no output.

- [x] **Step 2: Run the full automated verification**

  Run:

  ```bash
  npx tsc --noEmit
  npm test -- --runInBand
  npm run lint
  git diff --check
  ```

  Expected: TypeScript and Jest pass; lint has no errors and no
  `react/no-unstable-nested-components` warnings for `RootNavigator`; the
  diff check has no output.

- [x] **Step 3: Review the staged change set**

  Run:

  ```bash
  git status --short
  git diff --stat
  git diff -- src/features/auth/ui/VerifyScreen.tsx
  ```

  Confirm that the original SMS image-path correction is included and no
  unrelated user change is staged.

- [x] **Step 4: Commit the lot**

  ```bash
  git add App.tsx babel.config.js tsconfig.json src __tests__ docs
  git commit -m "refactor: complete shared ui migration"
  ```
