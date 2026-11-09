# Final Folder Migration Design

## Goal

Retire the active legacy `src/screens` and `src/components` architecture without changing application behaviour. Every screen, UI component, utility, API type and public import path must have one clear owner in `app`, `shared`, `entities`, `features` or `roles`.

## Dependency rules

Dependencies flow in one direction:

```text
app → roles / features → entities → core / shared
```

- `app` composes navigation and providers; it contains no business UI.
- `shared` contains generic, domain-agnostic UI and utilities.
- `entities` own domain types, normalizers, resource API facades and reusable domain UI.
- `features` own role-neutral user capabilities and workflows.
- `roles` own client- or professional-specific screens, actions and navigation behaviour.
- No `features/*` file may import `@roles/*`.
- No runtime source outside a compatibility adapter may import `@screens/*` or the old `@components` primitives.

## Target ownership

### Intervention legacy tree

`src/screens/Intervention` is split by responsibility:

- `InterventionHeader`, `BottomActions`, `InfoNotice`, `SelectableCard` and generic map/modal primitives move to `shared/ui` when they carry no intervention fields.
- `AddressCard`, `ServiceSummaryCard`, `PhotoPickerRow` and intervention detail display components move to `entities/address/ui`, `entities/service/ui` or `entities/intervention/ui` according to the data they render.
- `new-intervention` steps, address selection, payload construction and service problem selection move under `features/intervention-creation`.
- intervention list and detail presentation helpers move under their respective feature modules.
- client-only price, payment and success screens remain in `roles/client/payment-flow`.
- professional status, tracking and related action helpers remain in their professional role modules.

### Home legacy tree

`src/screens/Home/client` is split by actual audience, not by its former location:

- Client home cards, hero, location header, support and account-pending helpers move to `roles/client/home`.
- Professional availability status helpers move to `roles/professional/dashboard`.
- Professional document metadata helpers move to `roles/professional/documents`.
- `HomeGate` is removed after its remaining navigation responsibility is absorbed by `app/navigation`.

### Authentication and welcome

Welcome, sign-in, sign-up, verification and password recovery screens move to `features/auth/ui`. Auth form components move beside the screens. Registration services and APIs stay in `features/auth`; session persistence stays in `core/session`.

### Types and API boundaries

`src/store/api/api.types.ts` is decomposed into entity model exports:

- user and auth contracts → `entities/user/model`
- address contracts → `entities/address/model`
- service contracts → `entities/service/model`
- intervention contracts → `entities/intervention/model`
- payment, document, notification, quote and reclamation contracts → their owning entities.

`store/api` remains temporarily as an implementation adapter for RTK Query only. Screens, features and roles import types and response normalizers from entities, never from `store/api`.

## Public module APIs

Every direct child of `features`, `roles/client` and `roles/professional` exposes an `index.ts`. Consumers import only from that public module entry, not from `screens`, `components`, `model` or `api` internal paths.

## Compatibility cleanup

`src/components` remains only while its consumers are migrated to `shared/ui`. Once no source imports it, remove its five compatibility adapters. Remove `src/screens` only when static checks confirm no source import, re-export or navigation reference remains.

## Configuration and validation

`tsconfig.json` uses a TypeScript-supported `ignoreDeprecations` value or omits it when unnecessary. The repository must pass:

```bash
npx tsc --noEmit
npm test -- --runInBand --silent
npm run lint
```

The existing `ClientForm` asynchronous timer leak is fixed so the aggregate Jest suite is stable; passing isolated tests is not sufficient for completion.

## Acceptance criteria

- `rg "@screens/" src --glob '!screens/**'` produces no runtime imports.
- `rg "@store/api/(api.types|utils)" src --glob '!store/**'` produces no imports.
- `rg "@roles/" src/features` produces no imports.
- Each feature and role module has a public `index.ts`.
- `src/screens` and compatibility-only `src/components` are removed only after the above checks and the full validation suite is green.
