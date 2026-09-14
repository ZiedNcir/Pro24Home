# Refonte architecturale à rôles — Conception

**Date :** 13 septembre 2026  
**Statut :** validé pour planification  
**Objectif :** restructurer intégralement le code TypeScript de Pro24Home sans modifier les écrans, les parcours utilisateur, les routes de navigation ni les contrats API existants.

## Contexte

L’application React Native distingue deux rôles : Client et Professionnel. Son organisation actuelle mélange les écrans, les composants UI, les appels RTK Query, le stockage de session et la logique métier. Plusieurs données serveur existent aussi dans des slices Redux, ce qui crée une double source de vérité.

La refonte doit réduire les doublons sans tenter de rendre artificiellement identiques les comportements propres à chaque rôle.

## Principes

1. Une donnée métier est définie une seule fois dans son entité.
2. Une action commune est définie une seule fois dans une fonctionnalité.
3. Un parcours ou une règle propre au rôle reste dans son espace de rôle.
4. RTK Query est la seule source des données provenant du serveur.
5. Redux classique ne conserve que l’état local d’interface réellement partagé.
6. Les écrans composent des hooks et composants ; ils ne connaissent ni la mécanique HTTP ni AsyncStorage.
7. La migration garde les routes, les textes, le rendu et les requêtes existantes.

## Arborescence cible

```text
src/
  app/
    App.tsx
    navigation/
      common/
      client/
      professional/
    providers/
    store/

  core/
    api/
      base-api.ts
      api-error.ts
      response-normalizers.ts
      tags.ts
    config/
    session/
      session-storage.ts
      session-service.ts
    maps/
    notifications/
    permissions/

  entities/
    user/
      api/
      model/
      ui/
    service/
    address/
    intervention/
    quote/
    payment/
    notification/

  features/
    auth/
    profile/
    address-management/
    intervention-list/
    intervention-detail/
    request-intervention/
    rating/

  roles/
    client/
      home/
      payment-flow/
    professional/
      dashboard/
      availability/
      documents/
      quote-management/
      intervention-tracking/

  shared/
    ui/
    theme/
    i18n/
    utils/
    types/
    assets/
```

Chaque entité expose ses types, ses normaliseurs, ses sélecteurs et les endpoints de lecture liés à cette donnée. Chaque fonctionnalité expose uniquement son API publique via `index.ts`. Les dossiers `roles/client` et `roles/professional` ne contiennent que les actions et écrans qui diffèrent réellement selon le rôle. Les dépendances suivent la direction `app → roles/features → entities/core/shared` : une feature ne dépend jamais d’un module de rôle, tandis qu’un module de rôle peut consommer une feature seulement lorsque cette dernière est neutre vis-à-vis du rôle.

## Modèle de rôles

`User` reste un type discriminé par son rôle. Les attributs et règles communs vivent dans `entities/user`; les informations spécifiques existent dans les spécialisations Client et Professionnel déjà reflétées par l’API.

Les écrans d’intervention utilisent une représentation commune de l’intervention. Les panneaux d’action, permissions et enchaînements diffèrent par rôle : demande et paiement côté Client, disponibilité, devis et suivi côté Professionnel. Cette séparation évite la copie des types, cartes, réponses API et présentations communes.

## UI

### Composants partagés

`shared/ui` contient les primitives génériques : texte, bouton, champ, case à cocher, radio, interrupteur, image, icône, écran, toast, modale et chargement. Les gros composants actuels sont découpés sans modifier leur rendu :

- `Field` devient des champs ciblés (`TextField`, `PasswordField`, `PhoneField`, `DateField`, `CodeField`).
- Les modales partagent une base et exposent dialogue, feuille inférieure et chargement.
- La configuration de carte commune devient `AppMap`.
- `InterventionHeader` devient une en-tête générique de retour.

### UI métier et UI de rôle

- `entities/*/ui` : carte d’adresse, carte de notification, carte de service, résumé d’intervention.
- `features/*/ui` : assistant d’inscription, sélection d’adresse, demande d’intervention, notation et filtres.
- `roles/*` : accueil Client, paiement Client, tableau de bord Professionnel, documents, disponibilité, devis et suivi.

Les deux formulaires d’inscription utilisent un assistant commun. Les étapes supplémentaires du Professionnel (entreprise, SIRET, services) sont injectées comme étapes spécifiques, sans dupliquer validation, progression, boutons, soumission ni gestion d’erreur.

## Données, appels et session

### RTK Query

`core/api/base-api.ts` contient l’URL de base, l’authentification, les règles de reprise réseau, la conversion des erreurs et les tags. Les endpoints seront rangés par entité ou fonctionnalité plutôt que par rôle quand les données sont partagées.

Les réponses sont transformées par des normaliseurs uniques. Les répétitions de `response.data || response` sont supprimées. Les tags sont précis par collection et identifiant afin que les mutations invalident uniquement les données concernées.

Les écrans ne consomment pas directement les endpoints : un hook de fonctionnalité orchestre requête, chargement, message utilisateur et navigation. Les appels Google Places et géocodage sont des clients dédiés dans `core/maps`.

### État Redux et session

Les slices qui dupliquent les données déjà mises en cache par RTK Query sont retirés progressivement. Les thunks fictifs de profil et d’intervention sont supprimés.

La session est gérée par `core/session` : lecture initiale, écriture, mise à jour et nettoyage. Aucun reducer Redux n’écrit dans AsyncStorage. Une réponse 401 exécute un nettoyage unique et ramène l’application au flux d’authentification.

## Erreurs

`ApiError` porte un statut, un message affichable, les erreurs de champs et un type de cause. Chaque endpoint et service la produit par l’intermédiaire de l’adaptateur commun. Les hooks de fonctionnalité conservent les messages français affichés aujourd’hui et choisissent toast ou dialogue selon le parcours existant.

## Migration

1. Mettre en place les alias, providers, socle API, session, erreurs et primitives UI.
2. Migrer les entités communes : utilisateur, service, adresse, intervention, devis, paiement et notification.
3. Migrer les fonctionnalités communes : authentification, profil, gestion d’adresse, liste/détail d’intervention, demande et notation.
4. Migrer les parcours Client, puis Professionnel.
5. Remplacer tous les imports restants et supprimer les fichiers historiques uniquement une fois sans consommateur.
6. Déplacer et compléter les tests parallèlement à chaque migration.

Les fichiers iOS et Android sont hors périmètre, sauf correction nécessaire de la configuration de test ou d’un import.

## Tests et critères d’acceptation

- Les tests de logique existants restent verts après leur déplacement.
- Chaque normaliseur, service de payload et règle de visibilité d’action est couvert par un test unitaire.
- Les flux Client et Professionnel gardent leurs routes et leurs données de navigation actuelles.
- Les mutations invalident les caches attendus sans `refetch()` manuel inutile.
- Une session restaurée, une déconnexion explicite et une réponse 401 suivent le même nettoyage.
- La suite Jest doit démarrer sans erreur de transformation ; `react-native-splash-screen` est mocké ou configuré dans les tests.

## État de référence

Dans la branche isolée, 21 suites et 59 tests passent. `__tests__/App.test.tsx` échoue avant toute refonte parce que Jest ne transforme pas `react-native-splash-screen`. `ClientForm` produit également un avertissement `act(...)` existant. L’installation requiert actuellement `npm ci --legacy-peer-deps` à cause d’un conflit de peer dependencies entre `react-native-maps` et `react-native-country-picker-modal`.
