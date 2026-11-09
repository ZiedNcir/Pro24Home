# Live check: inactive professional sign-in

Date: 7 November 2026. Environment: the app's configured development API, `https://dev.pro24home.com`.

The user explicitly authorized testing their supplied professional credentials. Two login requests were performed: JSON, as sent by the app, and multipart form data, as shown in Postman. Credentials and response tokens were not written to files or printed. No account activation, document upload or logout request was performed.

Both requests returned HTTP 401 with this sanitized response:

```json
{"exist":1,"is_verified":1,"is_active":0,"message":"Votre compte n'est pas actif."}
```

Neither `user` nor `access_token` was returned. This differs from the session-bearing inactive-account response assumed by the upload journey. It is not a JSON/multipart difference. The response does not establish whether password validation occurred before the inactive-account check.

The current sign-in screen therefore remains blocked and displays the server's inactive-account message. A regression test using the exact response shape confirms no authenticated navigation and no session creation. Eight professional sign-in screen tests pass.

Required backend behavior for the desired journey: return an authenticated user and usable token for the verified inactive professional, with authorization to upload required documents and read application status while awaiting activation. The app can then choose Documents or Pending using the account-scoped completion marker. A local completion marker is not an authentication token and does not activate the account.
