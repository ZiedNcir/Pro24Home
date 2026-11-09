# Shared UI Completion Design

## Goal

Finish the architecture migration in one cohesive change set: eliminate runtime
usage of `@components`, make `shared/ui` the single owner of generic UI,
stabilize the tab-bar component identity, remove macOS metadata left by the
previous file moves, and record the completed migration accurately.

## Scope and constraints

- Preserve all existing route names, navigation destinations, visible UI and
  component props.
- Keep the existing local correction to the SMS image path in
  `features/auth/ui/VerifyScreen.tsx`.
- No runtime TypeScript source may import `@components/*` after this change.
- `src/components` is removed after the import audit is empty.
- `app` may compose roles, features and shared UI, but does not own screen UI.
- `RootNavigator` passes a stable tab-bar component reference to React
  Navigation; it must not create tab-bar components during render.
- Delete only discovered `.DS_Store` files inside the repository tree.
- Keep the legacy `@components` TypeScript/Babel aliases only if no source uses
  them; removal of unused aliases is part of the migration cleanup.

## Shared UI ownership

The current `src/components` directory mixes compatibility adapters with
generic implementations. The generic implementations move without changing
their public behaviour:

- `Text`, `Icon`, `Image`, `Modal`, and `Toast` become submodules of
  `src/shared/ui`.
- Existing `shared/ui` primitives import these co-located modules through
  relative paths or the shared public entry, never through `@components`.
- The shared public entry exports the preserved component names and types so
  roles, features, entities and app code have one import owner.
- Every runtime import of `@components` is switched to the corresponding
  `@shared/ui` export or submodule.

This is a move-only boundary change: component signatures, rendering and
application behaviour are not redesigned.

## Navigation stability

`BottomTabBar` already exists at module scope. Both tab navigators will supply
that exact function reference to the `tabBar` option instead of wrapping it in
a render-time arrow function. This preserves the current props supplied by
React Navigation and prevents a new component type from being created on each
parent render.

## Verification

Tests first establish that the public shared UI entry exposes the migrated
primitives and that the navigator configuration uses the stable tab-bar
reference. After the implementation, the repository is checked with:

```sh
rg -n "@components" src --glob '*.{ts,tsx}'
find src -name .DS_Store -print
npx tsc --noEmit
npm test -- --runInBand
npm run lint
```

The import audit and metadata audit must have no output. TypeScript and Jest
must pass. Existing lint policy permits warnings; the two unstable nested
component warnings in `RootNavigator` must be absent.

## Documentation

The existing final-folder-migration plan is updated to mark completed steps
and state that `src/components` and `src/screens` have been retired. It will
also record the final verification commands and their expected results.
