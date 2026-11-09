# Fondations de l’architecture à rôles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Établir le socle de dossiers, d’alias, de tests, de session, d’API et de primitives UI sans modifier les parcours existants.

**Architecture:** `app` compose les providers et la navigation, `core` porte les préoccupations techniques, et `shared/ui` expose des primitives sans logique métier. RTK Query reste le client réseau ; erreurs, réponses et session sont centralisées hors des écrans et reducers.

**Tech Stack:** React Native 0.83, TypeScript strict, Redux Toolkit/RTK Query, React Navigation 7, styled-components, Jest 29.

**Spec:** `docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md`

## Global Constraints

- Conserver strictement les routes, parcours, rendu, textes et URL/méthodes API existants.
- RTK Query est la source des données serveur ; Redux classique ne garde que l’état UI partagé.
- Aucun reducer Redux ne lit ou n’écrit AsyncStorage.
- Installer avec `npm ci --legacy-peer-deps` jusqu’à résolution du conflit de peer dependencies existant.

---

## Structure livrée

```text
src/
  app/{App.tsx,providers,store}
  core/{api,config,session,maps,notifications,permissions}
  shared/{ui,theme,i18n,utils,types,assets}
```

### Task 1: Ajouter bootstrap, aliases et configuration Jest

**Files:**

- Create: `src/app/App.tsx`
- Create: `src/app/providers/AppProviders.tsx`
- Create: `jest.setup.js`
- Modify: `App.tsx`, `babel.config.js`, `tsconfig.json`, `jest.config.js`
- Test: `__tests__/App.test.tsx`

**Interfaces:** `AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element`; aliases `@app`, `@core`, `@entities`, `@features`, `@roles`, `@shared`; anciens aliases maintenus.

- [x] **Step 1: Write the failing test**

```tsx
import renderer from 'react-test-renderer';
import App from '../App';

it('mounts application providers and navigator', () => {
  expect(() => renderer.create(<App />)).not.toThrow();
});
```

- [x] **Step 2: Verify the failure**

Run: `npm test -- --runInBand __tests__/App.test.tsx`

Expected: FAIL because Jest parses `react-native-splash-screen` as an ES module.

- [x] **Step 3: Implement the boundary**

```tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider>
      <ToastProvider {...toastProviderProps}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ToastProvider>
    </ThemeProvider>
  </Provider>
);
```

Move current provider nesting into `AppProviders`; root `App.tsx` re-exports `src/app/App`. Add Jest mocks for `react-native-splash-screen.hide`, `react-native-onesignal.Debug.setLogLevel` and `react-native-onesignal.initialize` in `jest.setup.js`; load via `setupFilesAfterEnv`.

- [x] **Step 4: Add aliases and verify**

Add the six aliases to TypeScript and Babel. Run: `npm test -- --runInBand __tests__/App.test.tsx`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add App.tsx src/app babel.config.js tsconfig.json jest.config.js jest.setup.js __tests__/App.test.tsx
git commit -m "refactor: add application bootstrap boundary"
```

### Task 2: Centraliser erreurs, réponses et FormData

**Files:**

- Create: `src/core/api/{api-error,form-data,response}.ts`
- Test: `__tests__/coreApiError.test.ts`, `__tests__/coreApiResponse.test.ts`

**Interfaces:** `toApiError(error: unknown): ApiError`; `unwrapData<T>(response: unknown): T`; `unwrapArray<T>(response: unknown): T[]`; `createFormData(data, fileFields?): FormData`.

- [x] **Step 1: Write failing tests**

```ts
expect(
  toApiError({
    status: 422,
    data: { message: 'Invalide', errors: { email: ['Déjà utilisé'] } },
  }),
).toMatchObject({
  status: 422,
  message: 'Invalide',
  fieldErrors: { email: ['Déjà utilisé'] },
});
expect(unwrapData<{ id: number }>({ data: { id: 2 } })).toEqual({ id: 2 });
expect(unwrapArray<number>({ data: [1, 2] })).toEqual([1, 2]);
```

- [x] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/coreApiError.test.ts __tests__/coreApiResponse.test.ts`

Expected: FAIL because core API modules do not exist.

- [x] **Step 3: Implement focused helpers**

```ts
export type ApiError = {
  status: number;
  message: string;
  fieldErrors: Record<string, string[]>;
  isNetworkError: boolean;
  raw: unknown;
};
export const unwrapData = <T>(response: unknown): T =>
  response && typeof response === 'object' && 'data' in response
    ? (response as { data: T }).data
    : (response as T);
```

Move exact array, boolean, number and React Native file handling from `src/utils/api.helpers.ts` to `createFormData`.

- [x] **Step 4: Verify helpers and current normalizers**

Run: `npm test -- --runInBand __tests__/coreApiError.test.ts __tests__/coreApiResponse.test.ts __tests__/addressResponse.test.ts __tests__/servicesResponse.test.ts __tests__/interventionResponse.test.ts`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/core/api __tests__/coreApiError.test.ts __tests__/coreApiResponse.test.ts
git commit -m "refactor: centralize api response helpers"
```

### Task 3: Isoler session et rendre authSlice pur

**Files:**

- Create: `src/core/session/{session-storage,session-service}.ts`
- Create: `src/app/providers/AuthBootstrap.tsx`
- Modify: `src/store/slices/authSlice.ts`, `src/components/AuthInitializer.tsx`
- Test: `__tests__/sessionStorage.test.ts`, `__tests__/authBootstrap.test.tsx`

**Interfaces:** `readSession(): Promise<StoredSession | null>`; `writeSession(session: StoredSession): Promise<void>`; `clearSession(): Promise<void>`; `AuthBootstrap(): null`.

- [ ] **Step 1: Write failing storage tests**

```ts
await writeSession({
  user,
  token: 'token',
  refreshToken: null,
  lastLoginAt: '2026-09-13T00:00:00.000Z',
  sessionExpiresAt: null,
});
expect(await readSession()).toMatchObject({ token: 'token', user });
await clearSession();
expect(await readSession()).toBeNull();
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/sessionStorage.test.ts __tests__/authBootstrap.test.tsx`

Expected: FAIL because the session modules do not exist.

- [ ] **Step 3: Implement persistence boundary**

```ts
export const clearSession = () =>
  AsyncStorage.multiRemove([
    'auth_token',
    'refresh_token',
    'user',
    'last_login_at',
    'session_expires_at',
  ]);
```

Remove every `AsyncStorage` call from `authSlice.ts`. `AuthBootstrap` reads storage and dispatches `restoreSession`, without calling the current fake profile thunk. Keep `AuthInitializer` as a re-export adapter until imports move.

- [ ] **Step 4: Verify behavior**

Run: `npm test -- --runInBand __tests__/sessionStorage.test.ts __tests__/authBootstrap.test.tsx __tests__/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/session src/app/providers/AuthBootstrap.tsx src/store/slices/authSlice.ts src/components/AuthInitializer.tsx __tests__/sessionStorage.test.ts __tests__/authBootstrap.test.tsx
git commit -m "refactor: isolate session persistence"
```

### Task 4: Construire le client RTK Query central et ses tags

**Files:**

- Create: `src/core/api/{base-api,tags}.ts`
- Modify: `src/store/index.ts`, `src/store/api/baseApi.ts`
- Test: `__tests__/baseApi.test.ts`

**Interfaces:** `api`; `providesList(tag)`; `invalidatesEntity(tag, id)`; une seule gestion 401 qui exécute `clearSession()` puis `dispatch(logout())`.

- [ ] **Step 1: Write failing tag tests**

```ts
expect(providesList('Addresses')).toEqual([{ type: 'Addresses', id: 'LIST' }]);
expect(invalidatesEntity('Interventions', 7)).toEqual([
  { type: 'Interventions', id: 7 },
  { type: 'Interventions', id: 'LIST' },
]);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/baseApi.test.ts`

Expected: FAIL because `@core/api/tags` does not exist.

- [ ] **Step 3: Implement and switch the store**

Create `base-api.ts` from current code; token comes from Redux first, then `readSession()`. Do not set `Content-Type` for FormData. Preserve retries and current tag names. Point store reducer/middleware to this API and keep legacy base API as a re-export adapter.

- [ ] **Step 4: Verify focused API behavior**

Run: `npm test -- --runInBand __tests__/baseApi.test.ts __tests__/apiConfig.test.ts __tests__/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/api/base-api.ts src/core/api/tags.ts src/store/index.ts src/store/api/baseApi.ts __tests__/baseApi.test.ts
git commit -m "refactor: centralize rtk query client"
```

### Task 5: Extraire les primitives de formulaire et sélection

**Files:**

- Create: `src/shared/ui/button/Button.tsx`
- Create: `src/shared/ui/form/{TextField,PasswordField,PhoneField,DateField,CodeField}.tsx`
- Create: `src/shared/ui/selection/{Checkbox,Radio,Toggle}.tsx`
- Create: `src/shared/ui/index.ts`
- Modify: `src/components/{Button/Button,Field/Field,CheckBox/CheckBox}.tsx`
- Test: `__tests__/sharedUiForm.test.tsx`

**Interfaces:** role-neutral components; temporary compatibility exports `Field`, `Button`, `CheckBox`, `RadioButton`, `ToggleSwitch`.

- [ ] **Step 1: Write failing primitive tests**

```tsx
const tree = renderer.create(
  <TextField label="Email" value="a@b.fr" onChangeText={jest.fn()} />,
);
expect(tree.root.findByProps({ accessibilityLabel: 'Email' })).toBeTruthy();
expect(() =>
  renderer.create(<Toggle value onValueChange={jest.fn()} />),
).not.toThrow();
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx`

Expected: FAIL because shared primitives do not exist.

- [ ] **Step 3: Implement primitives and adapters**

Extract exact styling from `Field`, `Button` and `CheckBox` into focused components. Keep old files as adapters that select a matching shared control. Do not migrate screens in this task.

- [ ] **Step 4: Verify form behavior**

Run: `npm test -- --runInBand __tests__/sharedUiForm.test.tsx __tests__/ClientForm.test.tsx __tests__/AccountTypeScreen.test.tsx`

Expected: PASS with the asynchronous `act(...)` warning removed.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui src/components/Button src/components/Field src/components/CheckBox __tests__/sharedUiForm.test.tsx __tests__/ClientForm.test.tsx
git commit -m "refactor: extract shared form primitives"
```

### Task 6: Unifier layout, overlays, toasts et carte de base

**Files:**

- Create: `src/shared/ui/{layout/Screen,navigation/BackHeader,overlay/Dialog,overlay/BottomSheet,overlay/LoadingOverlay,map/AppMap}.tsx`
- Create: `src/core/notifications/show-message.ts`
- Modify: `src/components/{ScreenContainer,NavigationHeader}.tsx`, `src/components/Modal/{AppSpinner,CustomModal,DialogModal}.tsx`
- Test: `__tests__/sharedUiLayout.test.tsx`

**Interfaces:** `AppMap` applique le provider Android en interne; `showSuccess`, `showError`, `showWarning`; adapters d’import historiques.

- [ ] **Step 1: Write failing layout tests**

```tsx
expect(() =>
  renderer.create(<BackHeader title="Retour" onBack={jest.fn()} />),
).not.toThrow();
expect(() =>
  renderer.create(<LoadingOverlay visible message="Chargement" />),
).not.toThrow();
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/sharedUiLayout.test.tsx`

Expected: FAIL because shared layout modules do not exist.

- [ ] **Step 3: Implement boundaries**

Extract only display behavior. `AppMap` receives normal `MapViewProps`, renders children unchanged, and owns `PROVIDER_GOOGLE`. `BackHeader` accepts `title`, `onBack`, `rightAction`. Address markers/search remain domain code.

- [ ] **Step 4: Verify layout and app**

Run: `npm test -- --runInBand __tests__/sharedUiLayout.test.tsx __tests__/App.test.tsx __tests__/Welcome.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/ui src/core/notifications src/components __tests__/sharedUiLayout.test.tsx
git commit -m "refactor: centralize shared layout primitives"
```
