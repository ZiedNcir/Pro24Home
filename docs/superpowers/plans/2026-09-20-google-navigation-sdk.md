# Google Integrated Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current React Native polyline route with Google Navigation SDK turn-by-turn guidance embedded in Pro24Home on Android and iOS.

**Architecture:** A small TypeScript navigation service owns the cross-platform contract and the tracking screen owns intervention/status orchestration. Native Android and iOS modules expose a navigation view plus imperative commands/events; Google Navigation owns route calculation, camera, maneuvers, voice guidance, rerouting, and arrival.

**Tech Stack:** React Native 0.83.1, TypeScript, Kotlin, Swift, Google Navigation SDK for Android/iOS, React Native Native Modules, Jest, Gradle, CocoaPods/Swift Package Manager.

**Spec:** `docs/superpowers/specs/2026-09-20-google-navigation-sdk-design.md`

## Global Constraints

- Support Android and iOS in the same delivery.
- Use the Google-provided navigation experience; do not recreate turn-by-turn guidance in JavaScript.
- Keep existing Pro24Home status actions and intervention lifecycle unchanged.
- Stop native navigation and remove listeners when the screen unmounts or the trip ends.
- Use existing coordinates as the required destination and accept an optional `placeId`.
- Preserve the existing location permission explanation and provide a retry path after denial.
- Do not stage or alter the existing unrelated iOS OneSignal changes.
- Enable and restrict Google Navigation SDK credentials per platform before device testing.

## Review Focus

- Permission denied or revoked while the screen is visible must show a retry state and never start guidance.
- An intervention without valid latitude/longitude must not invoke the native SDK and must show a recoverable destination error.
- Native route/API/network errors must not update intervention status or leave a stale navigation listener.
- Re-entering the tracking screen must create one native session and one event subscription, not duplicates.
- Arrival and back navigation must stop guidance even when the status mutation fails.

### Task 1: Define the cross-platform navigation contract

**Files:**
- Create: `src/core/navigation/types.ts`
- Create: `src/core/navigation/native-navigation.ts`
- Create: `src/core/navigation/navigation-state.ts`
- Test: `__tests__/navigationState.test.ts`

**Interfaces:**
- Produces `NavigationDestination = { latitude: number; longitude: number; placeId?: string; label?: string }`.
- Produces `NavigationOptions = { voiceGuidance: boolean }`.
- Produces `NavigationEvent = { type: 'routeReady' | 'progress' | 'arrival' | 'locationError' | 'routeError' | 'navigationError'; etaMinutes?: number; distanceKm?: number; instruction?: string; errorCode?: string }`.
- Produces `NativeNavigationModule` with `startNavigation(destination, options): Promise<void>`, `stopNavigation(): Promise<void>`, `setVoiceGuidance(enabled): Promise<void>`, and `addListener(listener): { remove(): void }`.
- Produces pure `getNavigationState(event, previous)` and `getNavigationDestination(address)` helpers for the screen.

- [ ] **Step 1: Write the failing state tests**

```ts
it('moves from starting to active when a route is ready', () => {
  expect(getNavigationState({ type: 'routeReady', etaMinutes: 18, distanceKm: 7.4 }, { status: 'starting' }))
    .toEqual({ status: 'active', etaMinutes: 18, distanceKm: 7.4, errorCode: undefined });
});

it('returns an invalid destination when coordinates are not finite', () => {
  expect(getNavigationDestination({ latitude: 'bad', longitude: 2 } as any)).toBeNull();
});

it('stops active guidance at arrival', () => {
  expect(getNavigationState({ type: 'arrival' }, { status: 'active', etaMinutes: 1, distanceKm: 0.1 }))
    .toMatchObject({ status: 'arrived' });
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- --runInBand __tests__/navigationState.test.ts`

Expected: FAIL because the navigation contract and state helpers do not exist.

- [ ] **Step 3: Implement the minimal types, native module wrapper, destination guard, and state reducer**

Use `NativeModules.Pro24HomeNavigation` and `NativeEventEmitter` when available; expose a no-op rejected-safe adapter when the native module is absent so the JavaScript test environment can load the service.

- [ ] **Step 4: Run focused tests and TypeScript**

Run: `npm test -- --runInBand __tests__/navigationState.test.ts && npx tsc --noEmit`

Expected: PASS and exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/core/navigation/types.ts src/core/navigation/native-navigation.ts src/core/navigation/navigation-state.ts __tests__/navigationState.test.ts
git commit -m "feat: define native navigation contract"
```

### Task 2: Add Android Navigation SDK integration

**Files:**
- Modify: `android/build.gradle`
- Modify: `android/app/build.gradle`
- Modify: `android/app/src/main/AndroidManifest.xml`
- Modify: `android/app/src/main/java/com/pro24home/MainApplication.kt`
- Create: `android/app/src/main/java/com/pro24home/navigation/NavigationPackage.kt`
- Create: `android/app/src/main/java/com/pro24home/navigation/NavigationModule.kt`
- Create: `android/app/src/main/java/com/pro24home/navigation/NavigationViewManager.kt`
- Test: `__tests__/androidNavigationContract.test.ts`

**Interfaces:**
- Consumes the Task 1 destination/options/event contract.
- Produces a `Pro24HomeNavigation` module and `Pro24HomeNavigationView` native component with matching command/event names.

- [ ] **Step 1: Add a failing contract test for Android command/event names**

Assert the JS adapter calls `startNavigation` with `{ latitude, longitude, placeId, voiceGuidance }` and maps Android event payloads into `NavigationEvent` without changing error codes.

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npm test -- --runInBand __tests__/androidNavigationContract.test.ts`

Expected: FAIL until the native-facing adapter contract is implemented.

- [ ] **Step 3: Add the pinned Google Navigation dependency and remove Android Maps duplication**

Use the current Google Maven Navigation artifact compatible with the repository’s Gradle/AGP toolchain, exclude transitive `com.google.android.gms:play-services-maps` copies where required, keep the API key in the existing Android manifest resource, and add required navigation attribution resources.

- [ ] **Step 4: Implement the Kotlin module**

Initialize `NavigationApi`, create the `Navigator`, set a `Waypoint` from `placeId` or lat/lng, configure voice guidance, start/stop guidance, and emit route/progress/arrival/error events. The view manager must release the navigator and listeners in `onDropViewInstance`.

- [ ] **Step 5: Register the package and native view**

Add `NavigationPackage()` to `MainApplication` and expose the view through `requireNativeComponent('Pro24HomeNavigationView')` in the TypeScript wrapper.

- [ ] **Step 6: Verify Android build and tests**

Run: `npm test -- --runInBand __tests__/androidNavigationContract.test.ts && npx tsc --noEmit && cd android && ./gradlew assembleDebug`

Expected: focused test, TypeScript, and debug APK build pass.

- [ ] **Step 7: Commit**

```bash
git add android src/core/navigation __tests__/androidNavigationContract.test.ts
git commit -m "feat: add android google navigation bridge"
```

### Task 3: Add iOS Navigation SDK integration

**Files:**
- Modify: `ios/Podfile` or the Xcode Swift Package configuration, using one dependency mechanism consistently.
- Modify: `ios/Pro24Home/AppDelegate.swift`
- Create: `ios/Pro24Home/Navigation/NavigationModule.swift`
- Create: `ios/Pro24Home/Navigation/NavigationViewManager.swift`
- Create: `ios/Pro24Home/Navigation/NavigationBridge.m`
- Test: `__tests__/iosNavigationContract.test.ts`

**Interfaces:**
- Consumes the Task 1 destination/options/event contract.
- Produces the same `Pro24HomeNavigation` commands/events and `Pro24HomeNavigationView` name as Android.

- [ ] **Step 1: Add a failing contract test for iOS event normalization**

Cover route ready, progress, arrival, permission/location failure, and route failure using the same event literals as Task 2.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --runInBand __tests__/iosNavigationContract.test.ts`

Expected: FAIL before the iOS bridge is present.

- [ ] **Step 3: Add the Google Navigation SDK dependency and API key bootstrap**

Use the supported Swift Package Manager package `https://github.com/googlemaps/ios-navigation-sdk`, configure Maps/Navigation API keys through the existing iOS build settings, and keep the current uncommitted OneSignal files untouched.

- [ ] **Step 4: Implement the Swift module and view manager**

Create the navigator/controller, accept a `GMSNavigationWaypoint` from place ID or coordinates, configure voice guidance, forward navigation events, and stop/remove delegates on invalidation. Export the module using the React Native bridge file.

- [ ] **Step 5: Verify iOS build and tests**

Run: `npm test -- --runInBand __tests__/iosNavigationContract.test.ts && npx tsc --noEmit && cd ios && bundle exec pod install && xcodebuild -workspace Pro24Home.xcworkspace -scheme Pro24Home -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' build`

Expected: focused test, TypeScript, dependency resolution, and simulator build pass. If the host lacks CocoaPods/Xcode tooling, record the exact blocked command without modifying unrelated files.

- [ ] **Step 6: Commit**

```bash
git add ios/Podfile ios/Pro24Home/AppDelegate.swift ios/Pro24Home/Navigation __tests__/iosNavigationContract.test.ts
git commit -m "feat: add ios google navigation bridge"
```

### Task 4: Replace the tracking screen polyline with the native navigation view

**Files:**
- Modify: `src/roles/professional/intervention-tracking/screens/InterventionTrackingScreen.tsx`
- Modify: `src/roles/professional/intervention-tracking/model/route-presentation.ts`
- Test: `__tests__/routePresentation.test.ts`

**Interfaces:**
- Consumes `NavigationDestination`, `NavigationEvent`, `startNavigation`, `stopNavigation`, `setVoiceGuidance`, and `addListener` from Task 1.
- Consumes the Android/iOS native view from Tasks 2–3.

- [ ] **Step 1: Add failing route-orchestration tests**

Cover invalid address, route-ready panel values, route error retry state, arrival state, and one cleanup call on unmount/back.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- --runInBand __tests__/routePresentation.test.ts`

Expected: FAIL for the new orchestration behaviors.

- [ ] **Step 3: Replace `MapViewDirections`, manual markers, and polling camera logic**

Render `Pro24HomeNavigationView` when the destination is valid, start one session after intervention data and permissions are ready, subscribe once to normalized events, and remove the subscription plus call `stopNavigation()` in cleanup.

- [ ] **Step 4: Preserve Pro24Home status controls**

Keep existing start/in-progress/arrival modal actions; navigation events only update display state. On arrival, show the current arrival actions without automatically mutating backend status.

- [ ] **Step 5: Add voice and retry controls**

Expose a voice toggle that calls `setVoiceGuidance`, and a retry action that clears the error and starts a fresh native session.

- [ ] **Step 6: Verify route tests and full JavaScript suite**

Run: `npm test -- --runInBand __tests__/routePresentation.test.ts && npm test -- --runInBand && npx tsc --noEmit && npm run lint`

Expected: all tests, TypeScript, and lint pass.

- [ ] **Step 7: Commit**

```bash
git add src/roles/professional/intervention-tracking src/core/navigation __tests__/routePresentation.test.ts
git commit -m "feat: use integrated google navigation in tracking"
```

### Task 5: Platform/device acceptance and cleanup

**Files:**
- Modify only the platform credential/resource files required by the Google setup.
- Test: `__tests__/navigationState.test.ts`, `__tests__/routePresentation.test.ts`, and Android/iOS device builds.

- [ ] **Step 1: Verify credential restrictions and required Google APIs**

Confirm Android package/signing restrictions, iOS bundle-ID restriction, Navigation SDK enablement, billing, Maps API enablement where required, and Google attribution/legal resources.

- [ ] **Step 2: Run platform acceptance checks**

On Android and iOS devices, verify: permission prompt, Google terms prompt, route start, voice toggle, off-route recalculation, arrival event, retry after network error, back navigation cleanup, and unchanged status actions.

- [ ] **Step 3: Run the final verification suite**

Run: `npm test -- --runInBand && npx tsc --noEmit && npm run lint && git diff --check`

Expected: 0 test failures, 0 TypeScript errors, 0 lint errors, and clean diff checks.

- [ ] **Step 4: Commit only intended files**

```bash
git status --short
git diff --name-only HEAD~5
```

Confirm the existing OneSignal iOS modifications are not staged, then commit any final acceptance-only changes with `chore: finalize integrated navigation`.

## Self-review checklist

- Spec coverage: Tasks 1–4 cover the JS contract, both native SDKs, screen orchestration, permissions, voice, events, errors, and existing status actions; Task 5 covers credentials, legal resources, and real-device acceptance.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation step is used; SDK version selection is tied to the repository’s Gradle/AGP compatibility check.
- Type consistency: both native modules expose the exact Task 1 names and payloads; the tracking screen consumes only that contract.
- Review focus coverage: invalid destination and permission errors are covered in Tasks 1/4; native errors and cleanup in Tasks 2–4; duplicate sessions in Task 4; arrival cleanup in Task 4.
