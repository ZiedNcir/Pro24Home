# Unavailable interventions

Approved behavior: when submission reports no professional available, retain the request on the phone for the signed-in account. Show it in Mes interventions as Aucun professionnel disponible; tapping opens all submitted details with Payer. Payer returns to the existing submission/payment screen and retries. Preserve the request through sign-out and app restart, isolate accounts, and remove it only after successful submission.

Approaches: server persistence would allow cross-device recovery but requires backend changes outside this repository. Account-scoped AsyncStorage uses the existing phone storage and meets the requested same-phone recovery; this is the accepted approach. Do not interpret general network/authentication/validation errors as unavailable professionals. No new payment gateway is introduced: existing payment UI submits requests only.

Implementation choices: store a snapshot of service, address, schedule, photos and original payload; use a local identifier distinct from server IDs. Availability errors are classified conservatively using explicit codes or messages. A retry updates the same local record. Show saved records even when fetching remote interventions fails. Storage failures must remain visible and must not claim saving succeeded.
