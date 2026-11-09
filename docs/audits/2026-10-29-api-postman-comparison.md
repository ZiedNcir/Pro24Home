# Comparaison des services API avec la collection Postman

Date : 29 octobre 2026.

Source : [Pro24Home.postman_collection.json](/Users/ziedncir/Downloads/Pro24Home.postman_collection.json).

Analyse statique des huit modules de `src/store/api/endpoints`, des réexports métier, des appels depuis les écrans, du transport HTTP commun et du stockage local de la photo de profil. Les services Google Maps et le stockage local ne sont pas des API serveur Pro24Home et sont exclus des décomptes. Aucun appel au serveur, aucune modification des services applicatifs, aucun test réseau effectué. Les exemples de valeurs Postman ne sont pas considérés comme des règles métier obligatoires.

## Résultat global

| Indicateur | Résultat |
|---|---:|
| Requêtes dans Postman | 52 |
| Couples méthode + route distincts dans Postman | 49 |
| Endpoints HTTP définis dans le projet | 60 |
| Endpoints projet présents dans Postman avec même méthode et route | 48 |
| Endpoints projet absents de Postman | 12 |
| Requêtes Postman retrouvées dans le projet | 51 sur 52 |
| Route Postman sans équivalent exact dans le projet | 1 |
| Exemples de réponses enregistrés dans Postman | 0 |

Les identifiants d’exemple (`20`, `115`, `rib`, etc.) ont été comparés aux paramètres dynamiques du projet. Les requêtes client/pro de liste et détail d’intervention sont mutualisées dans le projet. La requête Postman « capture Payment » reprend la route de création : sa présence dans les correspondances ne valide donc pas la capture du paiement.

Une correspondance signifie ici **méthode et URL alignées**, pas une conformité complète des réponses, de l’authentification ou des règles métier. Une route absente de Postman n’est pas forcément absente du serveur.

## Écarts et points prioritaires

### 1. Mise à jour OneSignal : route différente et route Postman non implémentée

- Postman : `POST /api/update-oneSignal_id`, champ `onesignal_key`.
- Projet : `PUT /api/profile/notification-token`, même champ, dans [auth.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/auth.ts:240).
- Le hook du projet est exporté mais aucune invocation depuis les écrans ou les services actifs n’a été trouvée. La clé est toutefois envoyée lors de l’inscription.

Conséquence : la mise à jour ultérieure d’une clé OneSignal n’est pas raccordée à la route documentée. Priorité : aligner la mutation sur la route documentée et la déclencher lors d’un changement de souscription, en conservant la clé d’inscription.

### 2. Vérification de compte : téléphone vide alors que Postman utilise le téléphone

Postman montre `code` et `phone_number` actifs, avec `email` désactivé. Le service autorise les trois champs mais [VerifyScreen.tsx](/Users/ziedncir/workspace/Pro24Home/src/features/auth/ui/VerifyScreen.tsx:124) envoie l’email et `phone_number: ''`.

Conséquence possible : échec si le serveur attend l’identification par téléphone illustrée dans Postman. À confirmer côté serveur : prise en charge éventuelle de la vérification par email. Si le téléphone est requis, il faut le transmettre depuis l’inscription jusqu’à la vérification.

### 3. Capture du paiement : contradiction dans la collection

- La requête Postman « create PaymentIntent » appelle `POST /api/create-payment-intent`.
- La requête Postman « capture Payment » appelle **la même URL**, avec `intervention_id`.
- Le projet distingue création et capture et utilise `POST /api/capture-payment` pour la capture, dans [payment.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/payment.ts:42).
- La validation est alignée : `POST /api/valide-payment` avec `payment_intent_id`.

Il est impossible de conclure à une erreur du projet à partir de cette contradiction. Confirmer la véritable route de capture avant toute correction.

Indépendamment de cet écart documentaire, [PaymentTravelFeeScreen.tsx](/Users/ziedncir/workspace/Pro24Home/src/roles/client/payment-flow/screens/PaymentTravelFeeScreen.tsx:58) vérifie la disponibilité puis crée l’intervention ; il ne déclenche pas la création, la capture ou la validation du paiement. Aucun consommateur de ces trois hooks de paiement n’a été trouvé hors de leurs définitions/réexports. Le parcours de paiement reste donc à raccorder aux services définis.

### 4. Photo de profil : synchronisation serveur non documentée

Ni les requêtes de modification de profil client/professionnel, ni les autres requêtes de la collection ne fournissent de champ ou de route de photo de profil. Les fichiers d’intervention et les justificatifs professionnels ont des finalités différentes.

Le sélecteur d’image du profil utilise actuellement [profile-photo.ts](/Users/ziedncir/workspace/Pro24Home/src/entities/user/model/profile-photo.ts) pour enregistrer la photo par compte dans AsyncStorage. Il n’envoie pas la photo au serveur. Le modèle `User` ne définit pas non plus de champ de photo.

Informations nécessaires : méthode, URL, nom du champ fichier, emplacement de l’URL de photo dans la réponse et dans les données de connexion/profil. Ne pas inventer un champ `avatar`, `photo` ou `image`.

### 5. Routes supplémentaires : certaines sont déjà utilisées par l’interface

Les 12 routes supplémentaires sont listées plus bas. Deux sont effectivement invoquées par des écrans :

- `GET /api/profile` : [DocumentsScreen.tsx](/Users/ziedncir/workspace/Pro24Home/src/roles/professional/documents/screens/DocumentsScreen.tsx:37).
- `GET /api/notifications/unread-count` : [DashboardScreen.tsx](/Users/ziedncir/workspace/Pro24Home/src/roles/professional/dashboard/screens/DashboardScreen.tsx:51).

Il faut documenter ou confirmer ces routes : leur absence de la collection ne justifie pas de les supprimer.

## Paramètres et encodages

### Alignements constatés

- Profil client : `first_name`, `last_name`, `address`, `postal_code`, `onesignal_key` ; multipart comme Postman.
- Profil professionnel : champs d’identité, adresse, entreprise, zone et services. Le tableau `services` est sérialisé en `services[]` par le constructeur FormData commun.
- Création d’intervention : `address_id` côté application devient bien `adresse_id` côté serveur ; `service_id`, `title`, `description`, `price`, `image_1`, `image_2`, `image_3` sont pris en charge. Le prix n’est pas envoyé s’il est nul ou indéfini.
- Adresses : champs de localisation, coordonnées, téléphone, type et précisions présents dans le service de création.
- Réclamations client/pro : `intervention_id`, `motif`, `description` et pièces jointes `files[1]`, `files[2]`, etc.
- Documents professionnels : `file`, `type`, `name` ; véhicules : corps JSON `vehicles`.
- Statut professionnel : orthographe `onligne`, avec latitude et longitude, respectée.
- Devis : `price` ; changement de statut d’intervention : `status` ; notation : `intervention_id`, `rating`, commentaire facultatif.

Ces constats portent sur les paramètres prévus dans les services. Ils ne prouvent pas que tous les écrans les renseignent correctement.

### Différences de format à confirmer

Postman emploie multipart, tandis que le projet envoie du JSON pour : connexion, inscriptions client/pro, vérification, renvoi du code, mot de passe oublié, changement de mot de passe, statut professionnel et proposition de devis.

Ce n’est pas un échec démontré : le serveur peut accepter les deux formats. L’inscription pro envoie `services` comme tableau JSON, correspondant fonctionnellement aux champs multipart `services[]` de Postman. Il faut confirmer le format accepté avant de modifier ces appels.

Pour la recherche de professionnels par zone, Postman place `latitude`, `longitude`, `distance` dans un corps multipart de requête GET ; le projet les envoie en paramètres d’URL. Le projet évite ainsi un corps GET souvent ignoré par les clients HTTP. La collection devrait préciser le contrat attendu.

Le projet ajoute `lang` aux requêtes dans le transport commun et transmet le jeton Bearer. Ces paramètres transversaux ne doivent pas être comptés comme des champs métier manquants.

## Intégrations d’écran incomplètes relevées

- Le bouton de notification des paramètres modifie seulement un état local (`notificationsEnabled`), alors qu’une mutation professionnelle `POST /api/professional/notifications` existe. Aucune route équivalente client n’est documentée dans Postman.
- La photo de profil est locale ; aucun contrat serveur disponible.
- Les mutations de paiement sont définies mais non appelées par le parcours de paiement actuel.

Ces points sont distincts de la couverture des services : définir un endpoint ne signifie pas que son écran est connecté.

## Risque du transport commun

Le transport utilise `retry(..., { maxRetries: 3 })` globalement, y compris pour des mutations de création. Après une réponse perdue ou une coupure réseau, une création d’intervention ou un paiement pourrait être renvoyé alors que le serveur l’a déjà traité. Vérifier l’idempotence côté serveur et restreindre les reprises automatiques pour les opérations concernées. Ce risque découle du code ; la collection ne documente pas de garantie d’idempotence.

## Routes projet non documentées dans la collection

| Service | Méthode | Route | Source |
|---|---|---|---|
| `resetPassword` | POST | `/api/reset-password` | [auth.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/auth.ts:173) |
| `getProfile` | GET | `/api/profile` | [auth.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/auth.ts:196) |
| `updateProfile` | PUT | `/api/profile` | [auth.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/auth.ts:216) |
| `updateNotificationToken` | PUT | `/api/profile/notification-token` | [auth.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/auth.ts:240) |
| `getAppConfig` | GET | `/api/config` | [common.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/common.ts:15) |
| `uploadFile` | POST | `/api/upload` | [common.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/common.ts:26) |
| `getInterventionDevis` | GET | `/api/interventions/${interventionId}/devis` | [intervention.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/intervention.ts:53) |
| `markAllNotificationsAsRead` | POST | `/api/notifications/mark-all-read` | [notification.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/notification.ts:56) |
| `getUnreadNotificationCount` | GET | `/api/notifications/unread-count` | [notification.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/notification.ts:65) |
| `capturePayment` | POST | `/api/capture-payment` | [payment.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/payment.ts:42) |
| `getPaymentHistory` | GET | `/api/payments/history` | [payment.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/payment.ts:62) |
| `getPaymentDetails` | GET | `/api/payments/${id}` | [payment.ts](/Users/ziedncir/workspace/Pro24Home/src/store/api/endpoints/payment.ts:77) |

## Inventaire complet des endpoints projet

« Présent » signifie même méthode + route dans la collection, après normalisation des identifiants. Les réserves de paramètres, d’encodage et d’intégration ci-dessus restent applicables.

| Service | Méthode | Route projet | Postman |
|---|---|---|---|
| `login` | POST | `/api/login` | Présent |
| `registerClient` | POST | `/api/register-client` | Présent |
| `registerProfessional` | POST | `/api/register-professional` | Présent |
| `logout` | GET | `/api/logout` | Présent |
| `verifyAccount` | POST | `/api/register-verification` | Présent |
| `resendVerification` | POST | `/api/resend-verification` | Présent |
| `forgotPassword` | POST | `/api/forgot-password` | Présent |
| `resetPassword` | POST | `/api/reset-password` | Absent |
| `changePassword` | POST | `/api/change-password` | Présent |
| `getProfile` | GET | `/api/profile` | Absent |
| `updateProfile` | PUT | `/api/profile` | Absent |
| `updateNotificationToken` | PUT | `/api/profile/notification-token` | Absent |
| `getServices` | GET | `/api/get-services` | Présent |
| `updateClientProfile` | POST | `/api/client/update-profil` | Présent |
| `addAddress` | POST | `/api/client/address` | Présent |
| `getAddresses` | GET | `/api/client/address` | Présent |
| `deleteAddress` | DELETE | `/api/client/address/${id}` | Présent |
| `findProfessionalsByAddress` | POST | `/api/client/professionels/adress` | Présent |
| `findProfessionalsByZone` | GET | `/api/client/professionels/zone/${zoneId}` | Présent |
| `addRating` | POST | `/api/client/rating` | Présent |
| `addIntervention` | POST | `/api/client/interventions` | Présent |
| `cancelIntervention` | POST | `/api/client/interventions/${id}/cancel` | Présent |
| `deleteIntervention` | DELETE | `/api/client/interventions/${id}/delete` | Présent |
| `getZones` | GET | `/api/get-zones` | Présent |
| `getAppConfig` | GET | `/api/config` | Absent |
| `uploadFile` | POST | `/api/upload` | Absent |
| `getInterventions` | GET | `/api/get-interventions` | Présent |
| `getIntervention` | GET | `/api/get-intervention/${id}` | Présent |
| `acceptDevis` | GET | `/api/client/devis/${id}/accept` | Présent |
| `reviseDevis` | GET | `/api/client/devis/${id}/revise` | Présent |
| `getInterventionDevis` | GET | `/api/interventions/${interventionId}/devis` | Absent |
| `getNotifications` | GET | `/api/get-notifications` | Présent |
| `readNotification` | GET | `/api/notifications/read/${id}` | Présent |
| `markAllNotificationsAsRead` | POST | `/api/notifications/mark-all-read` | Absent |
| `getUnreadNotificationCount` | GET | `/api/notifications/unread-count` | Absent |
| `getInterventionPrice` | GET | `/api/get-intervention-price` | Présent |
| `createPaymentIntent` | POST | `/api/create-payment-intent` | Présent |
| `capturePayment` | POST | `/api/capture-payment` | Absent |
| `validatePayment` | POST | `/api/valide-payment` | Présent |
| `getPaymentHistory` | GET | `/api/payments/history` | Absent |
| `getPaymentDetails` | GET | `/api/payments/${id}` | Absent |
| `uploadDocument` | POST | `/api/professional/upload-document` | Présent |
| `downloadDocument` | GET | `/api/professional/download-document/${name}` | Présent |
| `updateVehicle` | POST | `/api/professional/upload-vehicle` | Présent |
| `updateProProfile` | POST | `/api/professional/update-profil` | Présent |
| `updateZone` | POST | `/api/professional/zone-professional` | Présent |
| `updateNotifications` | POST | `/api/professional/notifications` | Présent |
| `updateStatus` | POST | `/api/professional/update-status` | Présent |
| `acceptIntervention` | GET | `/api/professional/interventions/${id}/accept` | Présent |
| `reviseIntervention` | GET | `/api/professional/interventions/${id}/revise` | Présent |
| `addDevis` | POST | `/api/professional/interventions/add-devis/${interventionId}` | Présent |
| `updateInterventionStatus` | POST | `/api/professional/interventions/${interventionId}/update-status` | Présent |
| `addClientReclamation` | POST | `/api/client/reclamations` | Présent |
| `addProfessionalReclamation` | POST | `/api/professional/reclamations` | Présent |
| `getClientReclamations` | GET | `/api/client/reclamations` | Présent |
| `getProfessionalReclamations` | GET | `/api/professional/reclamations` | Présent |
| `updateClientReclamation` | POST | `/api/client/reclamations/${id}` | Présent |
| `updateProfessionalReclamation` | POST | `/api/professional/reclamations/${id}` | Présent |
| `deleteClientReclamation` | DELETE | `/api/client/reclamations/${id}/delete` | Présent |
| `deleteProfessionalReclamation` | DELETE | `/api/professional/reclamations/${id}/delete` | Présent |

## Ordre de correction proposé

1. Confirmer le mode de vérification de compte et la route de capture du paiement.
2. Aligner et raccorder la mise à jour OneSignal.
3. Documenter les routes supplémentaires réellement utilisées et fournir le contrat de photo de profil.
4. Raccorder les écrans aux mutations de paiement et aux préférences de notification prises en charge.
5. Ajouter des tests de contrat et des exemples de réponses Postman, puis vérifier les scénarios réels sur un environnement de test.

Sans exemples de réponses dans la collection, les structures `AuthResponse`, `User`, les enveloppes `data` et les normaliseurs du projet ne peuvent pas être validés par cette comparaison. L’analyse ne démontre pas qu’un appel est opérationnel sur le serveur.
