# Internationalisation complète du projet — plan d’implémentation

> **Pour les agents d’implémentation :** exécuter ce plan tâche par tâche avec `superpowers:executing-plans`. Les étapes sont découpées en lots examinables.

**Objectif :** Centraliser dans i18next chaque texte statique contrôlé par Pro24Home et visible dans l’application, en français et en anglais.

**Architecture :** Conserver `i18next` et `react-i18next`, les dictionnaires `fr.json` et `en.json`, et la détection de langue système adaptée à React Native. Migrer les textes par domaines, puis ajouter un scanner TypeScript des emplacements UI, la parité des dictionnaires et une commande `check:i18n` qui s’étend progressivement à tous les fichiers.

**Stack :** React Native 0.83, TypeScript, i18next, react-i18next, react-native-localize, Android resources, iOS `InfoPlist.strings`.

**Spécification :** `docs/superpowers/specs/2026-09-22-project-wide-i18n-design.md`

## Contraintes globales

- Les langues prises en charge sont `fr` et `en`.
- La locale système est normalisée vers une langue prise en charge, avec français en repli.
- Les deux dictionnaires ont les mêmes clés et variables d’interpolation.
- Toutes les chaînes statiques visibles contrôlées par le projet utilisent i18n.
- Les textes dynamiques fournis par l’API, identifiants techniques, journaux et textes des SDK tiers restent hors des dictionnaires.
- Les traductions sont évaluées à l’usage, pas au chargement de modules.
- Le contrôle automatisé couvre d’abord les fichiers migrés, puis tout le projet.

## Points à surveiller

- Les messages des validateurs et callbacks créés hors composant doivent être résolus après initialisation i18n et au moment où ils sont présentés.
- Les contenus d’interventions mêlent labels fixes et données du serveur ; seules les parties fixes sont traduites.
- Les notifications OneSignal locales ne doivent pas être confondues avec le contenu reçu du serveur.
- Les propriétés d’accessibilité sont aussi des textes UI et doivent être incluses au scanner.
- Les descriptions de permissions iOS sont localisées par `InfoPlist.strings`, tandis que les ressources Android personnalisées utilisent les répertoires `values-fr` et `values-en`.

## Priorités de revue

- Locale système régionale ou non prise en charge : sélectionner `fr`/`en` puis retomber sur `fr`.
- Clé ou placeholder absent dans un seul dictionnaire : signaler l’écart avant intégration.
- Texte JSX, attribut d’accessibilité ou paramètre d’alerte : l’inventaire doit le repérer et le contrôle final doit le refuser s’il est encore codé en dur.
- Valeur dynamique API : l’ignorer comme donnée tout en traduisant le label statique qui l’entoure.
- Permission iOS/Android : utiliser le texte du système dans les deux langues avec les mêmes identifiants de ressource.

## Carte des changements

- `src/utils/i18n.ts` : initialisation et résolution de locale React Native.
- `src/translations/fr.json`, `src/translations/en.json` : dictionnaires harmonisés, organisés par domaine.
- `src/globals.d.ts` : types des clés et ressources.
- `scripts/check-i18n.js`, `scripts/i18n-scope.json`, `package.json` : scanner AST, périmètre progressif et commande standard.
- `src/shared/ui/**` et `src/app/navigation/**` : chaînes communes, modales, contrôles, navigation et accessibilité.
- `src/features/auth/**` : authentification, inscription, vérification, formulaires et validations.
- `src/features/address-management/**`, `src/features/intervention-creation/**`, `src/features/intervention-detail/**`, `src/features/intervention-list/**` : parcours client autour des adresses et interventions.
- `src/roles/client/**` : accueil, profil, paramètres, support et paiement.
- `src/features/notification-center/**`, `src/core/notifications/**`, `src/roles/professional/**` : notifications, documents, disponibilité, tableau de bord et suivi du professionnel.
- `src/utils/permissions.ts`, `src/utils/validationMessages.ts`, `src/entities/intervention/model/presentation.ts` : messages ou libellés fournis hors UI.
- `android/app/src/main/res/values/strings.xml`, `values-fr/strings.xml`, `values-en/strings.xml` : chaînes natives Android appartenant à l’app.
- `ios/Pro24Home/Info.plist`, `ios/Pro24Home/fr.lproj/InfoPlist.strings`, `ios/Pro24Home/en.lproj/InfoPlist.strings`, `ios/Pro24Home.xcodeproj/project.pbxproj` : descriptions de permissions localisées.

### Task 1 : Normaliser les locales et harmoniser les ressources

**Fichiers :**
- Modifier : `src/utils/i18n.ts`
- Créer : `src/utils/locale.ts`
- Modifier : `src/translations/fr.json`
- Modifier : `src/translations/en.json`
- Modifier : `src/globals.d.ts`

**Contrat :**
- `resolveSupportedLanguage(locales)` reçoit les locales renvoyées par `react-native-localize` et retourne seulement `'fr' | 'en'`.
- Le code langue `fr`, `fr-CA`, `en`, `en-US` est normalisé ; toute autre valeur retourne `'fr'`.
- Les dictionnaires constituent l’unique source des textes applicatifs.

```ts
export type SupportedLanguage = 'fr' | 'en';
export const resolveSupportedLanguage = (
  locales: readonly { languageCode?: string; languageTag?: string }[],
): SupportedLanguage => {
  for (const locale of locales) {
    const code = (locale.languageCode ?? locale.languageTag ?? '')
      .split(/[-_]/)[0]
      ?.toLowerCase();
    if (code === 'fr' || code === 'en') return code;
  }
  return 'fr';
};
```

- [x] **Étape 1 :** Ajouter dans les deux JSON les namespaces partagés requis par les lots suivants (`common`, `accessibility`, `navigation`, `permissions`) sans encore extraire les écrans.
- [x] **Étape 2 :** Créer `resolveSupportedLanguage` pour normaliser `languageCode`/`languageTag` de `getLocales()` en `fr` ou `en`, en français si aucune locale ne correspond.
- [x] **Étape 3 :** Modifier `src/utils/i18n.ts` pour utiliser `resolveSupportedLanguage(getLocales())`, supprimer `i18next-browser-languagedetector` du pipeline, et garder `fallbackLng: 'fr'`.
- [x] **Étape 4 :** Garder `resources` comme source typée dans `src/globals.d.ts`; aligner les types sur `resources.fr.translation` afin que les clés inconnues soient signalées par TypeScript.
- [x] **Étape 5 :** Comparer les arbres JSON et résoudre les clés ou placeholders déjà divergents sans écraser les traductions existantes correctes.
- [x] **Étape 6 :** Exécuter `npx tsc --noEmit` et `npm run lint`; corriger uniquement les erreurs créées par ce lot.
- [x] **Étape 7 :** Commit : `feat(i18n): normalize supported app locales`.

### Task 2 : Ajouter le contrôle i18n et l’inventaire des textes UI

**Fichiers :**
- Créer : `scripts/check-i18n.js`
- Créer : `scripts/i18n-scope.json`
- Modifier : `package.json`
- Lire : `src/translations/fr.json`, `src/translations/en.json`

**Contrat :**
- `npm run check:i18n` compare récursivement les clés et les variables d’interpolation des locales.
- Le scanner vérifie également les références littérales `t('key')` et `i18n.t('key')`.
- Le périmètre progressif `scripts/i18n-scope.json` contient les chemins migrés ; `--all` analyse tous les fichiers source et ressources natifs.
- `--inventory` imprime les candidats sans échec bloquant ; `--native` contrôle les clés et variantes de ressources Android/iOS ; `--all` inclut les deux modes.
- Les erreurs indiquent le fichier, la ligne et le motif détecté ; toute exception documentée doit préciser son motif.

```json
{
  "sourceFiles": ["src/shared/ui/button/Button.tsx"],
  "exceptions": [{ "file": "src/config/constants.ts", "value": "GET", "reason": "HTTP method; never rendered" }]
}
```

- [x] **Étape 1 :** Créer le parcours AST du script à partir de l’API TypeScript déjà installée, sans ajouter de dépendance.
- [x] **Étape 2 :** Implémenter le comparateur récursif JSON et la comparaison des placeholders `{{...}}`.
- [x] **Étape 3 :** Implémenter la collecte des clés référencées par `t('...')` et `i18n.t('...')`, avec une erreur pour les clés absentes d’une des locales.
- [x] **Étape 4 :** Détecter les littéraux dans JSXText, les enfants texte des composants, les props UI (dont `placeholder`, `title`, `label`, `accessibilityLabel`, `accessibilityHint`, `message`, `description`) et les appels connus à `Alert.alert`, `Toast`, `showMessage` et notifications locales.
- [x] **Étape 5 :** Ajouter une allowlist minimale pour les textes fixes non présentés à l’utilisateur et une liste de chemins migrés initialement vide.
- [x] **Étape 6 :** Ajouter `"check:i18n": "node scripts/check-i18n.js"` et le mode complet `node scripts/check-i18n.js --all` dans `package.json`.
- [x] **Étape 7 :** Lancer `node scripts/check-i18n.js` sur les dictionnaires et le périmètre vide, puis `node scripts/check-i18n.js --inventory` pour sortir les emplacements candidats sans les bloquer et les migrer dans l’ordre ci-dessous.
- [x] **Étape 8 :** Commit : `chore(i18n): add locale parity and raw copy guard`.

### Task 3 : Migrer les composants partagés et les textes d’application

**Fichiers :**
- Modifier : `src/shared/ui/**`
- Modifier : `src/app/navigation/RootNavigator.tsx`
- Modifier : `src/app/providers/AppProviders.tsx`
- Modifier : `src/components/**`
- Modifier : `src/translations/fr.json`, `src/translations/en.json`, `scripts/i18n-scope.json`

**Contrat :** Les composants partagés acceptent toujours les mêmes propriétés. Lorsqu’un texte par défaut est requis, la traduction est obtenue dans le composant au rendu ; un appelant peut toujours fournir un contenu dynamique.

```tsx
const { t } = useTranslation();
return <Text accessibilityLabel={t('accessibility.back')}>{t('common.actions.back')}</Text>;
```

- [x] **Étape 1 :** Migrer boutons, titres, boutons retour et labels dans `shared/ui/button`, `shared/ui/navigation` et les composants texte.
- [x] **Étape 2 :** Migrer les états de chargement/vide/erreur, les actions et confirmations dans `shared/ui/overlay`, `layout`, `selection`, `toast` et `components`.
- [x] **Étape 3 :** Migrer les labels par défaut, placeholders, erreurs et aides dans `shared/ui/form/HookFormField.tsx` et `TextField.tsx`; conserver les textes personnalisés provenant de l’appelant.
- [x] **Étape 4 :** Migrer les labels des tabs, titres d’écrans et autres chaînes de `RootNavigator.tsx` sans modifier les noms de routes.
- [x] **Étape 5 :** Ajouter les deux traductions pour chaque clé, puis ajouter les fichiers partagés traités à `scripts/i18n-scope.json`.
- [x] **Étape 6 :** Exécuter `npm run check:i18n`, `npx tsc --noEmit` et `npm run lint` avec le scope progressif configuré au Task 2.
- [x] **Étape 7 :** Commit : `feat(i18n): localize shared interface components`.

### Task 4 : Migrer l’authentification et l’inscription

**Fichiers :**
- Modifier : `src/features/auth/ui/**`
- Modifier : `src/features/auth/services/registration.ts`
- Modifier : `src/utils/validationMessages.ts`
- Modifier : `src/translations/fr.json`, `src/translations/en.json`, `scripts/i18n-scope.json`

**Contrat :** Les validations et retours d’authentification sont traduits au moment de leur présentation. Les codes/API d’erreur restent interprétés en messages i18n dans l’application.

```tsx
const { t } = useTranslation();
Alert.alert(t('common.error.title'), t('auth.errors.loginFailed'));
```

- [x] **Étape 1 :** Migrer bienvenue, connexion, oubli de mot de passe, inscription, choix de type de compte et vérification.
- [x] **Étape 2 :** Migrer les champs client et professionnel, sélection des services, squelettes, contraintes de mot de passe et messages de validation.
- [x] **Étape 3 :** Remplacer les chaînes d’erreur de `registration.ts` par des clés ou par des messages résolus depuis la couche UI, sans traduire les erreurs brutes envoyées par le serveur.
- [x] **Étape 4 :** Migrer les messages vers `auth.*` et `ui.form.*` dans les deux langues et étendre le périmètre de scan aux fichiers terminés.
- [x] **Étape 5 :** Exécuter le contrôle i18n, `npx tsc --noEmit` et `npm run lint`.
- [x] **Étape 6 :** Commit : `feat(i18n): localize authentication and registration`.

### Task 5 : Migrer adresses, création, liste et détails des interventions

**Fichiers :**
- Modifier : `src/features/address-management/**`
- Modifier : `src/features/intervention-creation/**`
- Modifier : `src/features/intervention-detail/**`
- Modifier : `src/features/intervention-list/**`
- Modifier : `src/entities/intervention/model/presentation.ts`
- Modifier : `src/translations/fr.json`, `src/translations/en.json`, `scripts/i18n-scope.json`

**Contrat :** Les états et labels d’interface sont traduits ; les adresses, noms, descriptions, prix et valeurs servis par l’API restent inchangés.

```tsx
const { t } = useTranslation();
<Text>{t('intervention.detail.addressLabel')}: {intervention.address}</Text>
```

- [x] **Étape 1 :** Migrer création/édition d’adresse, sélecteurs, modales de carte et erreurs de localisation.
- [x] **Étape 2 :** Migrer les étapes de création d’intervention, photos, horaire, services, résumé et validations.
- [x] **Étape 3 :** Migrer la liste d’interventions, les états vides, chargements, erreurs, détails et évaluation client.
- [x] **Étape 4 :** Remplacer les labels statiques des modèles de présentation par des clés/descripteurs sémantiques, puis résoudre la traduction dans l’interface.
- [x] **Étape 5 :** Ajouter les traductions et enregistrer les chemins migrés dans le scope du scanner.
- [x] **Étape 6 :** Exécuter le contrôle i18n, `npx tsc --noEmit` et `npm run lint`.
- [x] **Étape 7 :** Commit : `feat(i18n): localize address and intervention flows`.

### Task 6 : Migrer les parcours client et paiement

**Fichiers :**
- Modifier : `src/roles/client/home/**`
- Modifier : `src/roles/client/profile/**`
- Modifier : `src/roles/client/payment-flow/**`
- Modifier : `src/translations/fr.json`, `src/translations/en.json`, `scripts/i18n-scope.json`

- [x] **Étape 1 :** Migrer accueil client, catégories, paramètres, compte en attente et support.
- [x] **Étape 2 :** Migrer profil, estimation de prix, frais de déplacement, paiement et confirmation de succès.
- [x] **Étape 3 :** Conserver valeurs utilisateur/API et chaînes formatées comme données ; utiliser les interpolations i18next pour les nombres et montants inclus dans une phrase.
- [x] **Étape 4 :** Ajouter les traductions et étendre le scope au domaine client.
- [x] **Étape 5 :** Exécuter le contrôle i18n, `npx tsc --noEmit` et `npm run lint`.
- [x] **Étape 6 :** Commit : `feat(i18n): localize client and payment journeys`.

### Task 7 : Migrer notifications et parcours professionnel

**Fichiers :**
- Modifier : `src/features/notification-center/**`
- Modifier : `src/core/notifications/**`
- Modifier : `src/roles/professional/**`
- Modifier : `src/utils/permissions.ts`
- Modifier : `src/translations/fr.json`, `src/translations/en.json`, `scripts/i18n-scope.json`

**Contrat :** Les messages locaux de l’application sont traduits à leur génération ; les champs `title` et `message` reçus du serveur restent les données originales du serveur.

```ts
const title = i18n.t('notifications.local.title');
const serverMessage = notification.data.message;
```

- [x] **Étape 1 :** Migrer la liste de notifications, les états vides, les erreurs de chargement et les actions de carte.
- [x] **Étape 2 :** Migrer permission/refus/réessai de localisation et notification, sans traduire les erreurs natives brutes ou le contenu OneSignal reçu.
- [x] **Étape 3 :** Migrer disponibilité, tableau de bord, documents professionnels et suivi/navigation intégrée, dont actions de statut et labels accessibles.
- [x] **Étape 4 :** Ajouter les traductions et étendre le scanner à ces parcours.
- [x] **Étape 5 :** Exécuter le contrôle i18n, `npx tsc --noEmit` et `npm run lint`.
- [x] **Étape 6 :** Commit : `feat(i18n): localize notifications and professional journeys`.

### Task 8 : Localiser les chaînes système natives

**Fichiers :**
- Modifier : `ios/Pro24Home/Info.plist`
- Créer : `ios/Pro24Home/fr.lproj/InfoPlist.strings`
- Créer : `ios/Pro24Home/en.lproj/InfoPlist.strings`
- Modifier : `ios/Pro24Home.xcodeproj/project.pbxproj` si les fichiers localisés ne sont pas inclus par la structure existante
- Modifier : `android/app/src/main/res/values/strings.xml`
- Créer : `android/app/src/main/res/values-fr/strings.xml`
- Créer : `android/app/src/main/res/values-en/strings.xml`

- [x] **Étape 1 :** Identifier les descriptions de permission affichées par iOS (`NSLocation*UsageDescription`, caméra, photothèque, mouvement) et garder une valeur par défaut lisible dans `Info.plist` pour les installations sans variante localisée.
- [x] **Étape 2 :** Ajouter dans `fr.lproj/InfoPlist.strings` et `en.lproj/InfoPlist.strings` la traduction de chaque clé de permission présente dans `Info.plist`.

```strings
"NSLocationWhenInUseUsageDescription" = "Your location helps find nearby professionals and track your intervention.";
```

- [x] **Étape 3 :** Ajouter `app_name` et les autres chaînes Android personnalisées détectées dans `values/strings.xml`, `values-fr/strings.xml` et `values-en/strings.xml`.
- [x] **Étape 4 :** Garder identiques les noms de ressources Android, les clés Info.plist et les placeholders des deux langues.
- [x] **Étape 5 :** Vérifier la résolution des ressources via Gradle et le projet Xcode; exécuter `node scripts/check-i18n.js --native`.
- [x] **Étape 6 :** Commit : `feat(i18n): localize native permission prompts`.

### Task 9 : Fermer le périmètre et activer le garde-fou complet

**Fichiers :**
- Modifier : tous chemins restants émis par `node scripts/check-i18n.js --all`
- Modifier : `scripts/i18n-scope.json`
- Modifier : `package.json`
- Modifier : `docs/superpowers/specs/2026-09-22-project-wide-i18n-design.md` si une décision pratique de migration doit y être précisée

- [x] **Étape 1 :** Exécuter le scanner en mode complet et migrer tous les littéraux visibles restants du projet, y compris ceux hors des domaines principaux.
- [x] **Étape 2 :** Réduire les exceptions jusqu’à ne garder que les chaînes réellement techniques ou invisibles, avec justification.
- [x] **Étape 3 :** Remplacer le scope temporaire par un contrôle global par défaut et conserver `--all` comme alias documenté.
- [x] **Étape 4 :** Exécuter `npm run check:i18n`, `npx tsc --noEmit`, `npm run lint` et `git diff --check`.
- [x] **Étape 5 :** Examiner les différences de locales, les usages `t()` hors composants et tous les contenus serveur pour confirmer que seuls les textes statiques du projet ont changé.
- [x] **Étape 6 :** Commit : `chore(i18n): enforce complete project localization`.

## Auto-revue

- Couverture : détection, typage, parité, scan TSX, interfaces partagées, parcours métier, notifications locales, accessibilité et ressources Android/iOS ont chacun une tâche.
- Hors périmètre : aucun texte serveur ou SDK tiers n’est ajouté aux dictionnaires.
- Cohérence : les ressources, la fonction de résolution et les chemins du scanner sont définis avant les lots de migration.
- Limite du scanner : il doit analyser des contextes connus et afficher fichier/ligne pour éviter des remplacements aveugles ; les cas ambigus sont examinés manuellement.
