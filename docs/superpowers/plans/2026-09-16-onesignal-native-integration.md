# OneSignal Native Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reliably register a OneSignal device subscription on iOS and Android and synchronize its `onesignal_key` with the API.

**Architecture:** `src/core/notifications/oneSignalSubscription.ts` becomes the only JavaScript SDK boundary. It initializes the SDK, retains one observer and exposes valid server-assigned IDs. An authenticated provider sends ID changes through the existing RTK Query mutation. Native iOS configuration supplies APNs, App Group, and OneSignal extension support.

**Tech Stack:** React Native, TypeScript, Jest, RTK Query, `react-native-onesignal` 5.2.16, CocoaPods, Swift.

**Spec:** `docs/superpowers/specs/2026-09-16-onesignal-native-integration-design.md`

## Global Constraints

- Bundle ID: `com.pro24home`; App Group: `group.com.pro24home.onesignal`.
- Do not send empty or `local-` IDs to the backend.
- Do not request notification permission during bootstrap.
- Keep Android `POST_NOTIFICATIONS`; do not add Firebase Gradle configuration.

---

### Task 1: Persistent OneSignal lifecycle

**Files:**
- Modify: `src/core/notifications/oneSignalSubscription.ts`, `src/app/App.tsx`, `jest.setup.js`
- Test: `__tests__/oneSignalSubscription.test.ts`

**Interfaces:**
- Produce `initializeOneSignal(): void` and `subscribeToOneSignalSubscription(listener: (id: string) => void): () => void`.
- `getOneSignalSubscriptionId(): Promise<string>` waits on the shared state.

- [ ] Write tests that prove a `local-pending` event is ignored and a server ID emitted by the persistent observer resolves `getOneSignalSubscriptionId`.
- [ ] Run `npm test -- --runInBand __tests__/oneSignalSubscription.test.ts`; expect failure because the lifecycle exports do not exist.
- [ ] Implement a module-level set of listeners, cached valid ID and one `pushSubscription.change` listener created immediately after `OneSignal.initialize`. Query `getIdAsync()` immediately after registering the listener; filter every value through `id.length > 0 && !id.startsWith('local-')`.
- [ ] Replace the direct OneSignal initialization in `src/app/App.tsx` with `initializeOneSignal()`.
- [ ] Extend the OneSignal Jest mock to expose `Notifications` and `User.pushSubscription` APIs plus a test event emitter.
- [ ] Run `npm test -- --runInBand __tests__/oneSignalSubscription.test.ts && npx tsc --noEmit`; expect success.
- [ ] Commit: `git add src/core/notifications/oneSignalSubscription.ts src/app/App.tsx jest.setup.js __tests__/oneSignalSubscription.test.ts && git commit -m "feat: centralize onesignal lifecycle"`.

### Task 2: Authenticated key synchronization

**Files:**
- Create: `src/app/providers/OneSignalSubscriptionSync.tsx`
- Modify: `src/app/App.tsx`
- Test: `__tests__/oneSignalSubscriptionSync.test.tsx`

**Interfaces:**
- Consume `subscribeToOneSignalSubscription`, current auth user selector and `useUpdateNotificationTokenMutation()`.
- Call `updateNotificationToken({ onesignal_key: id })` once for each distinct valid ID while authenticated.

- [ ] Write tests for a signed-in user receiving an ID and an anonymous user receiving the same event.
- [ ] Run `npm test -- --runInBand __tests__/oneSignalSubscriptionSync.test.tsx`; expect failure because the provider does not exist.
- [ ] Implement a no-render component with `useEffect`, `useRef<string | null>` and the subscription cleanup function. Skip API calls if no user, if the user already has the ID, or if the ID was already submitted during this mount.
- [ ] Render it alongside `AuthBootstrap` inside `AppProviders`.
- [ ] Run `npm test -- --runInBand __tests__/oneSignalSubscriptionSync.test.tsx __tests__/oneSignalSubscription.test.ts && npx tsc --noEmit`; expect success.
- [ ] Commit: `git add src/app/providers/OneSignalSubscriptionSync.tsx src/app/App.tsx __tests__/oneSignalSubscriptionSync.test.tsx && git commit -m "feat: sync onesignal key after authentication"`.

### Task 3: iOS APNs and OneSignal extension

**Files:**
- Create: `ios/Pro24Home/Pro24Home.entitlements`, `ios/OneSignalNotificationServiceExtension/NotificationService.swift`, `ios/OneSignalNotificationServiceExtension/Info.plist`, `ios/OneSignalNotificationServiceExtension/OneSignalNotificationServiceExtension.entitlements`
- Modify: `ios/Pro24Home/Info.plist`, `ios/Pro24Home.xcodeproj/project.pbxproj`, `ios/Podfile`

- [ ] Create a configuration check that fails until both entitlement files contain `group.com.pro24home.onesignal`, the extension source exists, and the project contains `com.pro24home`.
- [ ] Main entitlement: `aps-environment` = `development` and the shared App Group. Extension entitlement: the same App Group.
- [ ] Main plist: add `UIBackgroundModes` with `remote-notification`.
- [ ] Extension source forwards `didReceive` and expiry handling to `OneSignalExtension`; configure its NSE Info.plist.
- [ ] Add an extension target to the PBX project, set both main target bundle identifiers to `com.pro24home`, set entitlements paths, add the target dependency and `Embed Foundation Extensions` phase.
- [ ] Add `target 'OneSignalNotificationServiceExtension'` to the Podfile with `pod 'OneSignalXCFramework/OneSignal', '5.2.15'`, then run `cd ios && pod install`.
- [ ] Validate with `plutil -lint ios/Pro24Home/Info.plist ios/OneSignalNotificationServiceExtension/Info.plist && xcodebuild -list -workspace ios/Pro24Home.xcworkspace`.
- [ ] Commit: `git add ios && git commit -m "feat: configure ios onesignal notifications"`.

### Task 4: Android and full verification

**Files:**
- Verify: `android/app/src/main/AndroidManifest.xml`
- Test: `__tests__/oneSignalSubscription.test.ts`, `__tests__/oneSignalSubscriptionSync.test.tsx`, `__tests__/registrationPayload.test.ts`

- [ ] Assert one `android.permission.POST_NOTIFICATIONS` declaration remains in the manifest.
- [ ] Verify no Google services plugin or `android/app/google-services.json` has been added.
- [ ] Run `npm test -- --runInBand __tests__/oneSignalSubscription.test.ts __tests__/oneSignalSubscriptionSync.test.tsx __tests__/registrationPayload.test.ts && npx tsc --noEmit && git diff --check`.
- [ ] Push `refactor/feature-architecture` after the checks succeed.
