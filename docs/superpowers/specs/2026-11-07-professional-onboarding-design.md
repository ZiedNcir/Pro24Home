# Professional account creation and validation

Latest user-approved navigation: professional registration → SignIn → inactive account with a server-provided user and access_token → Documents → after the final successful required upload, ProfessionalVerificationPending. At later sign-ins an inactive professional with completed uploads recorded on the phone opens Pending directly. This supersedes the earlier professional phone-verification step; client verification is unchanged.

Phone metadata is account-scoped (server user ID, with normalized email alias), survives session clearing, and records confirmed document types plus completion. Only successful upload acknowledgments or a complete server dossier can set completion. Completion never activates an account. Server activation opens professional home; an explicit document rejection opens correction even when completion was stored.

Implementation choices: registration remains unauthenticated; SignIn establishes only the user/token actually supplied by the server, including inactive responses. No session is fabricated from the local marker. Pending status updates follow fresh server activation/rejection without depending on storage access. The existing getProfile service remains the refresh source; it is absent from the Postman collection and was not live-tested.

Retain the existing five required document types. Optional source/commercial_id are only supplied through referral context. Optional vehicles, intervention zones and payment remain outside this flow. No live account was created and no document was sent to the server during verification.
