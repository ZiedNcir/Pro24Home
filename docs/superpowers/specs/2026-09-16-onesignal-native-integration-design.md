# OneSignal Native Integration Design

## Goal

Make the OneSignal push subscription reliable on iOS and Android, and keep the backend's required `onesignal_key` synchronized with the current device subscription.

## Scope and constraints

- The iOS bundle identifier is `com.pro24home`, matching the Android `applicationId`.
- Keep the existing OneSignal App ID and React Native SDK.
- Android remains configured through the React Native OneSignal autolinked SDK and declares `POST_NOTIFICATIONS`.
- iOS receives the required Push Notifications capability, `remote-notification` background mode, App Group `group.com.pro24home.onesignal`, and a Notification Service Extension.
- A real OneSignal subscription ID is non-empty and does not start with `local-`.
- No notification permission is requested on application launch.

## Native configuration

### Android

`android/app/src/main/AndroidManifest.xml` retains `POST_NOTIFICATIONS`. No Google Services Gradle plugin or `google-services.json` is added because OneSignal manages FCM registration.

### iOS

The main `Pro24Home` target uses `com.pro24home`, references an entitlements file with `aps-environment` and the shared App Group, and declares `remote-notification` in its Info.plist.

A `OneSignalNotificationServiceExtension` target uses the same App Group. Its `NotificationService.swift` passes requests to `OneSignalExtension`. The Podfile defines the extension target with the existing OneSignal pod, and the project embeds the generated `.appex` in the main app.

## OneSignal lifecycle

`src/core/notifications` owns all SDK calls. It initializes the SDK, installs one persistent push-subscription observer, immediately checks the current ID, and exposes the current real ID to registration flows.

When the observer receives a real ID, it updates registered users with `PUT /api/profile/notification-token`. The ID is also persisted in the auth store only after the API accepts it. Registration continues to require a real `onesignal_key`; the form waits for the service's shared subscription promise rather than creating a short-lived listener itself.

## Error handling

If OneSignal cannot provide a server-assigned ID, registration explains that device notifications are not ready rather than submitting an empty or `local-` placeholder. A denied notification permission does not erase an already assigned subscription ID. API synchronization failures are logged and retried on the next subscription change or authenticated bootstrap.

## Verification

- Unit tests cover filtering `local-` IDs, waiting for a server ID, and token synchronization only for authenticated users.
- TypeScript compilation and focused Jest tests must pass.
- Native project files are checked for the iOS target, matching App Group, bundle identifier, and Android notification permission.
- A physical device test confirms the dashboard receives one server-assigned subscription and the API receives its ID.
