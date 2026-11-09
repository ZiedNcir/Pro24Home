# OneSignal API update — 7 November 2026

The `updateNotificationToken` mutation now sends authenticated `POST /api/update-oneSignal_id` requests with the multipart field `onesignal_key` (the OneSignal subscription ID), matching the supplied Postman collection.

App startup attaches the existing OneSignal subscription observer and the Redux session observer. A registered subscription is synchronized after authentication/restoration, on subscription changes, and for a new account/session. Placeholder IDs and duplicate updates are ignored. Updates are serialized. Failed updates retry when the app returns to the foreground. Automatic HTTP retries are disabled for this mutation; pending requests are cancelled when their account/session changes or the observer stops. An acknowledgment only updates the originating account's locally persisted token.

Validation: 17 OneSignal tests passed; TypeScript without incremental caching, scoped ESLint and whitespace checks passed. Full suite: 142 tests passed, 18 failed, across 47 suites (36 passed, the same 11 previously failing suites). No live server request or device push-delivery test was performed. Review found no important defects; direct adapter listener/cancellation integration coverage remains a test gap.
