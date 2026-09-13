# Domaines et fonctionnalités à rôles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer types, endpoints, règles métier et UI commune vers les entités et fonctionnalités, sans recopier le code Client et Professionnel.

**Architecture:** Les données vivent dans `entities`, les actions dans `features`, et les rôles injectent uniquement leurs politiques et panneaux d’actions. Les écrans historiques restent des adaptateurs jusqu’au plan navigation.

**Tech Stack:** React Native 0.83, TypeScript strict, RTK Query, React Hook Form, Jest 29.

**Spec:** `docs/superpowers/specs/2026-09-13-role-aware-architecture-refactor-design.md`

## Global Constraints

- Dépend de `2026-09-13-role-aware-foundation.md`.
- Préserver URL, verbes HTTP, payloads, messages français et paramètres de route.
- Les appels de même forme partagent un builder ; le rôle ne choisit que le chemin API.
- Aucun écran n’importe directement un endpoint RTK Query.

---

### Task 1: Découper les types API par entité sans modifier leur forme

**Files:**

- Create: `src/entities/{user,service,address,intervention,quote,payment,notification,reclamation}/model/types.ts`
- Create: `src/entities/index.ts`
- Modify: `src/store/api/api.types.ts`
- Test: `__tests__/entityTypes.test.ts`

**Interfaces:** les exports existants `User`, `UserType`, `Service`, `Address`, `Intervention`, `Devis`, `Payment`, `Notification`, `Reclamation` et leurs request types restent identiques; l’ancien fichier ré-exporte uniquement.

- [ ] **Step 1: Write failing type fixture test**

```ts
const intervention: Intervention = {
  id: 1,
  address_id: 2,
  title: 'Fuite',
  status: 'pending',
  images: [],
} as Intervention;
expect(intervention.id).toBe(1);
expect(UserType.CLIENT).toBe('client');
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/entityTypes.test.ts`

Expected: FAIL because `@entities` has no model exports.

- [ ] **Step 3: Move declarations and re-export compatibility**

Move each declaration out of `api.types.ts` by entity, preserving optionality and backend spellings such as `adresse_id`. Make `api.types.ts` a type re-export facade; do not duplicate interfaces.

- [ ] **Step 4: Verify type safety**

Run: `npx tsc --noEmit && npm test -- --runInBand __tests__/entityTypes.test.ts __tests__/interventionPresentation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities src/store/api/api.types.ts __tests__/entityTypes.test.ts
git commit -m "refactor: split api types by entity"
```

### Task 2: Migrer utilisateur, auth et catalogue de services

**Files:**

- Create: `src/entities/user/api/user.api.ts`, `src/entities/service/api/service.api.ts`
- Create: `src/features/auth/{api/auth.api.ts,model/use-auth-actions.ts,services/registration.ts}`
- Modify: `src/store/api/endpoints/auth.ts`, `src/services/authService.ts`
- Test: `__tests__/authActions.test.ts`

**Interfaces:** `useLogin`, `useRegisterClient`, `useRegisterProfessional`, `useLogout`; `useGetProfileQuery`; `useGetServicesQuery`; `toHomeRoute(response): HomeRoute`.

- [ ] **Step 1: Write failing action tests**

```ts
expect(
  toHomeRoute({ user: { type: UserType.PROFESSIONAL }, is_active: 1 }),
).toBe('ProfessionnelHome');
expect(toHomeRoute({ user: { type: UserType.CLIENT }, is_active: 0 })).toBe(
  'AccountPendingScreen',
);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/authActions.test.ts __tests__/authNavigation.test.ts`

Expected: FAIL because feature auth does not exist.

- [ ] **Step 3: Implement APIs and orchestration**

Keep all current endpoints/payloads. Feature hooks persist credentials through `core/session`, dispatch pure auth actions, and invalidate `User`. Move validation and payload preparation into `features/auth/services/registration.ts`. Profile and service queries leave the auth endpoint module.

- [ ] **Step 4: Verify auth behavior**

Run: `npm test -- --runInBand __tests__/authActions.test.ts __tests__/authNavigation.test.ts __tests__/servicesResponse.test.ts __tests__/ClientForm.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/user src/entities/service src/features/auth src/store/api/endpoints/auth.ts src/services/authService.ts __tests__/authActions.test.ts
git commit -m "refactor: separate auth user and service domains"
```

### Task 3: Migrer adresse et Google Maps

**Files:**

- Create: `src/entities/address/{api/address.api.ts,model/normalizers.ts}`
- Create: `src/features/address-management/{model/use-address-management.ts,services/address-form.ts,ui/AddressPicker.tsx}`
- Create: `src/core/maps/{google-places-client,google-geocoding-client}.ts`
- Modify: `src/store/api/endpoints/client.ts`, `src/services/googlePlacesService.ts`
- Test: `__tests__/addressManagement.test.ts`

**Interfaces:** `useGetAddressesQuery`, `useAddAddressMutation`, `useDeleteAddressMutation`; `lookupPlace(placeId)`; `reverseGeocode(latitude, longitude)`; `useAddressManagement()`.

- [ ] **Step 1: Write failing service tests**

```ts
await expect(reverseGeocode(36.8, 10.18)).resolves.toBe('Tunis');
await expect(lookupPlace('missing')).rejects.toThrow(
  'Impossible de récupérer cette adresse.',
);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/addressManagement.test.ts __tests__/addressResponse.test.ts __tests__/googlePlaceAddress.test.ts`

Expected: FAIL because address modules do not exist.

- [ ] **Step 3: Implement the reusable address boundary**

Move recursive address normalization into the entity and use `createFormData` for creation. Move direct `fetch` calls into core map clients retaining exact error text. `AddressPicker` composes `AppMap`, place lookup and selection but has no endpoint call. Keep `googlePlacesService.ts` as a re-export adapter.

- [ ] **Step 4: Verify address behavior**

Run: `npm test -- --runInBand __tests__/addressManagement.test.ts __tests__/addressResponse.test.ts __tests__/googlePlaceAddress.test.ts __tests__/googlePlacesConfig.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/address src/features/address-management src/core/maps src/store/api/endpoints/client.ts src/services/googlePlacesService.ts __tests__/addressManagement.test.ts
git commit -m "refactor: centralize address and maps domain"
```

### Task 4: Migrer intervention et devis autour d’un affichage commun

**Files:**

- Create: `src/entities/intervention/{api/intervention.api.ts,model/normalizers.ts,model/presentation.ts}`
- Create: `src/entities/quote/api/quote.api.ts`
- Create: `src/features/intervention-list/model/use-intervention-list.ts`
- Create: `src/features/intervention-detail/ui/{InterventionDetails,ClientActions,ProfessionalActions}.tsx`
- Modify: `src/store/api/endpoints/{intervention,pro,client}.ts`, `src/screens/Intervention/utils/{interventionPresentation,interventionPayload}.ts`
- Test: `__tests__/interventionEntity.test.ts`

**Interfaces:** `useGetInterventionsQuery({ type, status })`; `useGetInterventionQuery(id)`; `ClientActions({ interventionId, status, price })`; `ProfessionalActions({ intervention, onOpenTracking })`; `buildInterventionPayload(input)`.

- [ ] **Step 1: Write failing behavior tests**

```ts
expect(
  normalizeInterventionResponse({ data: { adresse_id: 5, images: [] } })
    .address_id,
).toBe(5);
expect(shouldShowClientDevisActions(40, 'pending', 3)).toBe(true);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/interventionEntity.test.ts __tests__/interventionResponse.test.ts __tests__/interventionPresentation.test.ts __tests__/interventionPayload.test.ts`

Expected: FAIL because entity intervention does not exist.

- [ ] **Step 3: Implement shared display and role actions**

Move response/presentation rules to the entity. Move accept/revise devis API to quote API and keep their GET methods. `InterventionDetails` renders description, address, date, photos and map only. Client/Professional action components own their mutation and message; eligibility text/logic remains unchanged.

- [ ] **Step 4: Verify intervention behavior**

Run: `npm test -- --runInBand __tests__/interventionEntity.test.ts __tests__/interventionResponse.test.ts __tests__/interventionsResponse.test.ts __tests__/interventionPresentation.test.ts __tests__/interventionPayload.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities/intervention src/entities/quote src/features/intervention-list src/features/intervention-detail src/store/api/endpoints src/screens/Intervention/utils __tests__/interventionEntity.test.ts
git commit -m "refactor: separate intervention display and role actions"
```

### Task 5: Migrer paiements, notifications, réclamations et documents

**Files:**

- Create: `src/entities/{payment,notification,reclamation}/api/*.ts`
- Create: `src/entities/notification/model/presentation.ts`
- Create: `src/features/notification-center/model/use-notification-center.ts`, `src/features/complaint/services/complaint-request.ts`
- Create: `src/roles/professional/documents/api/documents.api.ts`
- Modify: `src/store/api/endpoints/{payment,notification,reclamation,pro,common}.ts`, `src/utils/notificationHelpers.ts`
- Test: `__tests__/notificationPresentation.test.ts`, `__tests__/complaintRequest.test.ts`

**Interfaces:** `toNotificationItem(notification)`; `buildComplaintRequest(data)`; `rolePath(role, resource)`; document upload API scoped to the Professional role.

- [ ] **Step 1: Write failing shared-role tests**

```ts
expect(rolePath('client', 'reclamations')).toBe('/api/client/reclamations');
expect(rolePath('professional', 'reclamations')).toBe(
  '/api/professional/reclamations',
);
expect(toNotificationItem(notification).id).toBe(notification.id);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/notificationPresentation.test.ts __tests__/complaintRequest.test.ts`

Expected: FAIL because shared domain helpers do not exist.

- [ ] **Step 3: Implement entity APIs and request builders**

Move payment transforms into payment model code. Reuse a single complaint FormData builder and select only role prefix through `rolePath`, preserving suffixes and HTTP verbs. Move notification UI type from `NotificationCard` into entity model. Keep optimistic notification read update keyed by its exact query args.

- [ ] **Step 4: Verify domain behavior**

Run: `npm test -- --runInBand __tests__/notificationPresentation.test.ts __tests__/complaintRequest.test.ts __tests__/professionalDocuments.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entities src/features/notification-center src/features/complaint src/roles/professional/documents src/store/api/endpoints src/utils/notificationHelpers.ts __tests__/notificationPresentation.test.ts __tests__/complaintRequest.test.ts
git commit -m "refactor: centralize shared role domain APIs"
```

### Task 6: Créer l’assistant d’inscription commun

**Files:**

- Create: `src/features/auth/ui/{RegistrationWizard,PersonalStep,SecurityStep,ProfessionalCompanyStep,ProfessionalServicesStep}.tsx`
- Create: `src/features/auth/model/registration-steps.ts`
- Modify: `src/screens/Auth/component/{ClientForm,ProfessionalForm,ListServices}.tsx`
- Test: `__tests__/registrationWizard.test.tsx`

**Interfaces:** `RegistrationWizard<T>({ steps, onSubmit, isSubmitting })`; `createClientRegistrationSteps()`; `createProfessionalRegistrationSteps(services)`.

- [ ] **Step 1: Write failing wizard tests**

```tsx
expect(createClientRegistrationSteps()).toHaveLength(2);
expect(createProfessionalRegistrationSteps([])).toHaveLength(4);
```

- [ ] **Step 2: Verify failure**

Run: `npm test -- --runInBand __tests__/registrationWizard.test.tsx __tests__/ClientForm.test.tsx`

Expected: FAIL because wizard modules do not exist.

- [ ] **Step 3: Implement common registration flow**

Move progress, navigation, validation trigger, submit state, error display and toast dispatch into `RegistrationWizard`. Client supplies personal/security steps; Professional adds company/services while using the same first two definitions. Keep old forms as small adapters.

- [ ] **Step 4: Verify form behavior**

Run: `npm test -- --runInBand __tests__/registrationWizard.test.tsx __tests__/ClientForm.test.tsx __tests__/AccountTypeScreen.test.tsx`

Expected: PASS with no `act(...)` warning.

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/ui src/features/auth/model src/screens/Auth/component __tests__/registrationWizard.test.tsx __tests__/ClientForm.test.tsx
git commit -m "refactor: share role-aware registration wizard"
```
