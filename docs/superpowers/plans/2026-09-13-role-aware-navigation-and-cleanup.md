# Rôles, navigation et nettoyage final Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer les écrans vers fonctionnalités/rôles, découper la navigation, supprimer les doubles sources de vérité et vérifier la refonte complète.

**Architecture:** Les écrans Client et Professionnel composent les entités et fonctionnalités déjà migrées. Le root navigator conserve les noms publics et délègue les onglets aux navigateurs de rôle. Les dossiers historiques disparaissent seulement lorsqu’ils n’ont plus de consommateurs.

**Tech Stack:** React Native 0.83, React Navigation 7, RTK Query, styled-components, Jest 29, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md`

## Global Constraints

- Dépend de `2026-09-13-role-aware-foundation.md` et `2026-09-13-role-aware-domains-and-features.md`.
- Conserver `Tabs`, `ProfessionnelHome`, `NewIntervention`, `InterventionDetail`, `PaymentTravelFee`, `Notifications`, `Documents` et leurs paramètres actuels.
- Ne supprimer un fichier que lorsqu’une recherche `rg` ne retourne plus de consommateur.
- Aucun écran ne peut importer `@store/api/endpoints`, `AsyncStorage`, `fetch`, `Toast.show` ou une clé Google directement.

---

### Task 1: Découper navigation et providers par rôle

**Files:**

- Create: `src/app/navigation/{types,RootNavigator,ClientTabs,ProfessionalTabs}.tsx`
- Create: `src/app/navigation/common/auth-navigation.ts`
- Modify: `src/navigation/{AppNavigator,authNavigation,professionalNavigation}.ts`
- Test: `__tests__/navigationStructure.test.tsx`

**Interfaces:** `RootNavigator()`; `ClientTabs()`; `ProfessionalTabs()`; `getHomeRouteFromAuthResponse(response, fallbackRole)`; une seule source de types de route.

- [ ] **Step 1: Write failing navigation tests**

```ts
expect(getHomeRouteFromAuthResponse({ user: { type: UserType.CLIENT } })).toBe(
  'Tabs',
);
expect(PROFESSIONAL_BOTTOM_TABS.map(tab => tab.route)).toEqual([
  'Home',
  'ListIntervention',
  'SettingPage',
]);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/navigationStructure.test.tsx __tests__/authNavigation.test.ts __tests__/professionalNavigation.test.ts`

Expected: FAIL because the application navigation modules do not exist.

- [ ] **Step 3: Implement route-preserving navigators**

Move the current root stack to `RootNavigator` and tab definitions to their role files. Keep existing navigation files as re-export adapters until import migration finishes. `types.ts` owns all route parameter contracts.

- [ ] **Step 4: Verify navigation and app**

Run: `npm test -- --runInBand __tests__/navigationStructure.test.tsx __tests__/authNavigation.test.ts __tests__/professionalNavigation.test.ts __tests__/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/navigation src/navigation __tests__/navigationStructure.test.tsx
git commit -m "refactor: split navigation by application role"
```

### Task 2: Migrer les parcours communs

**Files:**

- Create: `src/features/profile/screens/ProfileScreen.tsx`
- Create: `src/features/address-management/screens/SavedAddressesScreen.tsx`
- Create: `src/features/intervention-list/screens/InterventionListScreen.tsx`
- Create: `src/features/intervention-detail/screens/InterventionDetailScreen.tsx`
- Create: `src/features/notification-center/screens/NotificationsScreen.tsx`
- Create: `src/entities/address/ui/AddressCard.tsx`
- Create: `src/entities/intervention/ui/InterventionSummary.tsx`
- Create: `src/entities/notification/ui/NotificationCard.tsx`
- Modify: `src/screens/Intervention/screens/{SavedAddresses,InterventionListScreen,InterventionDetailScreen}.tsx`
- Modify: `src/screens/Notification/screen/Notifications.tsx`, `src/screens/Home/client/screens/ProfileScreen.tsx`
- Test: `__tests__/featureScreenImports.test.ts`

**Interfaces:** feature screens import only public APIs from `@entities`, `@features`, `@shared`, `@app`; entity cards do not call endpoints.

- [ ] **Step 1: Write a failing import boundary test**

```ts
expect(
  readFileSync(
    'src/features/intervention-detail/screens/InterventionDetailScreen.tsx',
    'utf8',
  ),
).not.toContain('@store/api/endpoints');
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/featureScreenImports.test.ts`

Expected: FAIL because the feature screen modules do not exist.

- [ ] **Step 3: Move common screen orchestration**

Move profile, address, intervention list/detail and notifications one by one. Use feature hooks, `showSuccess`/`showError`, `BackHeader`, `AppMap`, and entity cards. Preserve every navigation call and visible message.

- [ ] **Step 4: Verify behavior**

Run: `npm test -- --runInBand __tests__/featureScreenImports.test.ts __tests__/addressFlow.test.ts __tests__/interventionPresentation.test.ts __tests__/contactSupport.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features src/entities src/screens __tests__/featureScreenImports.test.ts
git commit -m "refactor: migrate common feature screens"
```

### Task 3: Migrer les parcours Client

**Files:**

- Create: `src/roles/client/home/screens/HomeScreen.tsx`
- Create: `src/roles/client/home/screens/SettingsScreen.tsx`
- Create: `src/roles/client/home/screens/ContactSupportScreen.tsx`
- Create: `src/roles/client/home/screens/AccountPendingScreen.tsx`
- Create: `src/roles/client/payment-flow/screens/PriceEstimationScreen.tsx`
- Create: `src/roles/client/payment-flow/screens/PaymentTravelFeeScreen.tsx`
- Create: `src/roles/client/payment-flow/screens/InterventionSuccessScreen.tsx`
- Create: `src/features/request-intervention/screens/RequestInterventionScreen.tsx`
- Create: `src/features/request-intervention/model/use-request-intervention.ts`
- Create: `src/features/request-intervention/services/build-payload.ts`
- Modify: `src/screens/Home/client/screens/{HomeClient,ClientSettingsScreen,ContactSupportScreen,AccountPendingScreen}.tsx`
- Modify: `src/screens/Intervention/screens/{NewInterventionScreen,PriceEstimationScreen,PaymentTravelFeeScreen,InterventionSuccessScreen}.tsx`
- Test: `__tests__/clientFlow.test.tsx`

**Interfaces:** `RequestInterventionScreen`, `PriceEstimationScreen`, `PaymentTravelFeeScreen` gardent les route params; `useRequestIntervention(): { submit, isSubmitting, error }` ne navigue pas.

- [ ] **Step 1: Write failing client flow tests**

```ts
expect(buildInterventionPayload(input)).toMatchObject({
  service_id: 4,
  address_id: 2,
});
expect(getHomeRouteFromAuthResponse({ user: { type: UserType.CLIENT } })).toBe(
  'Tabs',
);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/clientFlow.test.tsx __tests__/interventionPayload.test.ts __tests__/accountPending.test.ts`

Expected: FAIL because Client role modules do not exist.

- [ ] **Step 3: Move Client-only orchestration**

Move home, settings, support, pending account, payment and success screens to `roles/client`. Put the request wizard in `features/request-intervention`; it uses shared address/service entities. Payment submission remains Client-only.

- [ ] **Step 4: Verify flow**

Run: `npm test -- --runInBand __tests__/clientFlow.test.tsx __tests__/interventionPayload.test.ts __tests__/addressFlow.test.ts __tests__/accountPending.test.ts __tests__/routePresentation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/roles/client src/features/request-intervention src/screens __tests__/clientFlow.test.tsx
git commit -m "refactor: migrate client role flows"
```

### Task 4: Migrer les parcours Professionnel

**Files:**

- Create: `src/roles/professional/dashboard/screens/DashboardScreen.tsx`
- Create: `src/roles/professional/availability/model/use-availability.ts`
- Create: `src/roles/professional/documents/screens/DocumentsScreen.tsx`
- Create: `src/roles/professional/quote-management/ui/ProfessionalActions.tsx`
- Create: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`
- Modify: `src/screens/Home/client/screens/{ProfessionalHomeDashboard,HomeProfessional}.tsx`
- Modify: `src/screens/Intervention/screens/ProfessionalInterventionTrackingScreen.tsx`, `src/screens/Intervention/components/intervention-detail/InterventionDetailSections.tsx`
- Test: `__tests__/professionalFlow.test.tsx`

**Interfaces:** `useAvailability(): { updateAvailability, isUpdating }`; tracking uses `AppMap`; document/quote panels consume entity props rather than refetching intervention data.

- [ ] **Step 1: Write failing professional flow tests**

```ts
expect(
  buildProfessionalStatusPayload(true, { latitude: 36.8, longitude: 10.18 }),
).toEqual({ onligne: 1, latitude: 36.8, longitude: 10.18 });
expect(
  getDocumentProgress([{ name: 'kbis', status: 'approved' } as Document]),
).toEqual({ completed: 1, total: 5 });
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/professionalFlow.test.tsx __tests__/professionalStatus.test.ts __tests__/professionalDocuments.test.ts`

Expected: FAIL because Professional role modules do not exist.

- [ ] **Step 3: Move Professional-only orchestration**

Move dashboard, availability, document upload, quote proposal and tracking to `roles/professional`. Reuse shared intervention display and supply only `ProfessionalActions`. Preserve Directions key, route drawing and API payload; `AppMap` owns provider configuration.

- [ ] **Step 4: Verify flow**

Run: `npm test -- --runInBand __tests__/professionalFlow.test.tsx __tests__/professionalStatus.test.ts __tests__/professionalDocuments.test.ts __tests__/interventionPresentation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/roles/professional src/screens __tests__/professionalFlow.test.tsx
git commit -m "refactor: migrate professional role flows"
```

### Task 5: Retirer adaptateurs et doubles sources de vérité

**Files:**

- Delete: `src/store/slices/user.slice.ts`, `src/store/slices/intervention.slice.ts`
- Delete: anciens endpoints, anciens écrans et services uniquement après migration complète
- Modify: `src/store/index.ts`, `src/components/index.ts`
- Test: `__tests__/architectureBoundaries.test.ts`

**Interfaces:** store limité à RTK Query, auth pur et UI local; pas d’import historique; pas d’écran important endpoint, stockage, fetch, toast ou clé Google.

- [ ] **Step 1: Write failing boundary tests**

```ts
import { execFileSync } from 'node:child_process';
const search = (pattern: string) =>
  execFileSync('rg', ['-l', pattern, 'src'], { encoding: 'utf8' });

expect(search('@store/api/endpoints')).toBe('');
expect(search('response.data || response')).toBe('');
expect(search('AsyncStorage')).toMatch(/^src\/core\/session\//m);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/architectureBoundaries.test.ts`

Expected: FAIL while historical imports remain.

- [ ] **Step 3: Delete only verified-unused modules**

For each candidate run `rg -n "<module path or export name>" src __tests__`; delete only at zero consumers. Remove fake thunks/reducers after the corresponding RTK Query test passes. Expose public barrel APIs only.

- [ ] **Step 4: Run final verification**

Run: `npx tsc --noEmit && npm test -- --runInBand && npm run lint`

Expected: TypeScript and lint PASS; all Jest suites PASS including `App.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove legacy architecture adapters"
```
