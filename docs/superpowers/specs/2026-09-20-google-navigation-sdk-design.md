# Navigation Google intégrée — conception

## Objectif

Offrir aux professionnels une navigation automobile complète, directement dans Pro24Home, avec l'interface Google Navigation sur Android et iOS. L'application doit fournir les instructions virage par virage, la guidance vocale, le recalcul automatique, l'ETA et la détection d'arrivée, sans ouvrir Google Maps ou Plans.

## Décision

Intégrer le Google Navigation SDK natif sur chaque plateforme, derrière un pont React Native commun. Cette option utilise l'interface de navigation Google, plutôt qu'une imitation JavaScript basée sur `react-native-maps-directions`.

L'écran de trajet existant conserve les actions propres à Pro24Home : démarrer le trajet, signaler l'arrivée, démarrer/terminer/refuser l'intervention.

## Architecture

### Contrat JavaScript

Un module `Navigation` exposera :

- `startNavigation(destination, options)` pour initialiser la navigation vers une adresse de l'intervention ;
- `stopNavigation()` pour libérer le navigateur natif ;
- `setVoiceGuidance(enabled)` pour activer ou couper les instructions vocales ;
- des événements `routeReady`, `progress`, `arrival`, `locationError`, `routeError` et `navigationError`.

`destination` contient les coordonnées requises et un `placeId` optionnel. Les coordonnées existantes restent la solution de repli ; un place ID pourra améliorer la précision lorsqu'il sera disponible dans les données d'adresse.

### Android

Le module Android intègre le Navigation SDK, sa vue de navigation et son navigateur. Il initialise la destination, démarre le guidage, transfère les événements à React Native et arrête explicitement la session. La carte utilisée par l'écran de navigation doit être celle du SDK Navigation, et non `react-native-maps`.

### iOS

Le module iOS intègre le Navigation SDK et son contrôleur de navigation. Il configure la destination, la guidance vocale, les écouteurs d'itinéraire/progression/arrivée et expose les mêmes événements que le module Android.

### Écran React Native

L'écran `ProfessionalInterventionTrackingScreen` devient l'orchestrateur : il charge l'intervention, valide la destination, demande l'autorisation de localisation, affiche le conteneur natif et utilise les événements pour garder les actions Pro24Home synchronisées. Il ne calcule ni n'affiche de polyline concurrente.

## Comportements

1. À l'ouverture, l'application demande la localisation au premier plan et vérifie que la destination est exploitable.
2. Au premier usage, le SDK affiche les conditions Google Navigation requises.
3. La navigation affiche le guidage Google, les manœuvres, la caméra, la distance et l'heure d'arrivée.
4. Le SDK recalcule l'itinéraire lorsque le professionnel quitte la route.
5. La voix est activée par défaut et peut être coupée depuis l'écran.
6. À l'arrivée, Pro24Home affiche les actions de statut existantes, sans mettre à jour l'intervention automatiquement.
7. La sortie de l'écran ou la fin de l'intervention arrête la session native et les abonnements d'événements.

## Erreurs et cas limites

- Localisation refusée : message clair et action de réessai ; aucun guidage ne démarre.
- Destination sans coordonnées : état bloquant et retour vers le détail de l'intervention.
- Clé, SDK ou réseau indisponible : erreur de navigation explicite, réessai possible, aucune mise à jour de statut.
- Échec de calcul d'itinéraire : conserver l'intervention ouverte et proposer de relancer.
- Session interrompue : arrêter la navigation native et ne pas laisser de listener GPS actif.

## Configuration et conformité

- Activer Navigation SDK for Android et Navigation SDK for iOS dans le même projet Google Cloud avec facturation.
- Restreindre les clés Android par package/signature et les clés iOS par bundle ID.
- Conserver les autorisations de localisation existantes et ajouter les éléments natifs nécessaires au fonctionnement en premier plan.
- Le module doit respecter les conditions d'utilisation Google Navigation affichées par le SDK.

## Tests et critères d'acceptation

- Les contrats TypeScript valident les commandes et événements du pont.
- Les tests unitaires couvrent l'orchestration : destination, permissions, route prête, arrivée et erreurs.
- Android et iOS compilent avec le SDK Navigation installé.
- Une navigation simulée vers une intervention affiche une instruction, une progression et l'arrivée.
- Les actions Pro24Home de statut restent identiques avant et après la navigation.

## Hors périmètre

- Navigation en arrière-plan avec guidage persistant après fermeture de l'application.
- CarPlay et Android Auto.
- Enregistrement ou historique détaillé des traces GPS.
- Calcul d'optimisation multi-arrêts.
