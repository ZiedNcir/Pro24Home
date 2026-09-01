# Nouvelle intervention Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Découper `NewInterventionScreen` en composants ciblés sans modifier le comportement du flux de création d’intervention.

**Architecture:** Le screen parent conservera la navigation entre les quatre étapes et délèguera l’affichage à quatre composants d’étape. Un hook dédié portera l’état et les actions métier, tandis que le modal d’adresse et la carte plein écran seront des composants contrôlés par props.

**Tech Stack:** React Native, TypeScript, styled-components/native, React Navigation, RTK Query, react-native-google-places-autocomplete, react-native-maps, Jest.

**Spec:** `docs/superpowers/specs/2026-09-01-new-intervention-components-design.md`

## Global Constraints

- Préserver les intégrations Google Places API (New), géocodage inverse et sauvegarde API.
- Ne pas modifier les endpoints API ni la navigation globale.
- La liste d’adresses reste normalisée et limitée aux quatre premières adresses affichées.
- Le bouton « Continuer » est visible uniquement avec une adresse sélectionnée et un modal fermé.
- Préserver les changements non liés déjà présents dans la branche.
- Vérifier TypeScript ciblé, ESLint ciblé et les tests du flux adresse après chaque extraction.

---

### Task 1: Préparer les contrats partagés du flux

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/types.ts`
- Create: `src/screens/Intervention/components/new-intervention/index.ts`
- Modify: `src/screens/Intervention/screens/types.ts`
- Test: `__tests__/addressFlow.test.ts`

**Interfaces:**
- Produces `NewInterventionStepProps`, `AddressStepProps`, `AddressModalProps` and `FullscreenMapModalProps` for later components.
- Reuses `InterventionStep` and the existing `Address`, `Service` and selected-location types.

- [ ] **Step 1: Définir les types sans changer le rendu**

  Créer les props explicites pour chaque étape et les callbacks `onNext`, `onPrevious`, `onSelectAddress`, `onOpenAddressModal`, `onSaveAddress` et `onSelectMapLocation`.

- [ ] **Step 2: Exporter les contrats depuis le barrel**

  Ajouter les exports de types dans `components/new-intervention/index.ts` afin que les étapes importent une interface stable.

- [ ] **Step 3: Vérifier les tests existants**

  Run: `npm test -- --runInBand __tests__/addressFlow.test.ts`

  Expected: les tests existants passent sans modification de comportement.

- [ ] **Step 4: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention src/screens/Intervention/screens/types.ts __tests__/addressFlow.test.ts && git commit -m "refactor: define new intervention component contracts"`

### Task 2: Extraire l’étape Type de service

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/ServiceStep.tsx`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`
- Test: `__tests__/interventionServicePannes.test.ts`

**Interfaces:**
- Consumes `selectedService`, `problemTypes`, `servicesLoading`, `selectedProblem` and `onSelectProblem`.
- Produces a presentational step component rendering `ServiceSummaryCard`, `SelectableCard`, `InfoNotice` and its `BottomActions`.

- [ ] **Step 1: Extraire le JSX du step 1 à comportement identique**

  Déplacer le bloc `step === 1` dans `ServiceStep` et remplacer les valeurs capturées par des props typées.

- [ ] **Step 2: Remplacer le bloc parent par `<ServiceStep />`**

  Garder dans le parent uniquement le calcul des services et la transition `goNext`.

- [ ] **Step 3: Vérifier**

  Run: `npm test -- --runInBand __tests__/interventionServicePannes.test.ts`

  Expected: PASS.

- [ ] **Step 4: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention/ServiceStep.tsx src/screens/Intervention/screens/NewInterventionScreen.tsx && git commit -m "refactor: extract service step"`

### Task 3: Extraire l’étape Détails

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/DetailsStep.tsx`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`

**Interfaces:**
- Consumes `selectedTiming`, `onSelectTiming`, `onNext` and `onPrevious`.
- Produces the existing description input, photo picker, timing cards and bottom actions.

- [ ] **Step 1: Déplacer le JSX du step 2**

  Créer `DetailsStep` avec les callbacks typés et les mêmes textes, icônes et composants.

- [ ] **Step 2: Monter le composant dans le parent**

  Remplacer le bloc conditionnel `step === 2` par `<DetailsStep />`.

- [ ] **Step 3: Vérifier le typage ciblé**

  Run: `npx tsc --noEmit 2>&1 | rg "(DetailsStep|NewInterventionScreen)" || true`

  Expected: aucune erreur provenant des fichiers modifiés.

- [ ] **Step 4: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention/DetailsStep.tsx src/screens/Intervention/screens/NewInterventionScreen.tsx && git commit -m "refactor: extract details step"`

### Task 4: Extraire la carte plein écran et le modal d’adresse

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/FullscreenMapModal.tsx`
- Create: `src/screens/Intervention/components/new-intervention/AddressModal.tsx`
- Create: `src/screens/Intervention/components/new-intervention/addressModal.styles.ts`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`
- Test: `__tests__/googlePlacesConfig.test.ts`, `__tests__/googlePlaceAddress.test.ts`

**Interfaces:**
- `FullscreenMapModal` consumes `visible`, `region`, `selectedLocation`, `onClose` and `onSelectCoordinate`.
- `AddressModal` consumes `visible`, `region`, `selectedLocation`, `isLookingUpAddress`, `isSavingAddress`, `onClose`, `onSelectPlace`, `onSelectCoordinate` and `onSave`.
- Produces the same Google Places New API behavior, reverse geocoding behavior, map controls and save/cancel actions.

- [ ] **Step 1: Extraire d’abord `FullscreenMapModal`**

  Déplacer le modal plein écran et ses styles. Le `MapView` doit conserver `scrollEnabled`, `zoomEnabled`, `rotateEnabled`, `pitchEnabled`, `showsCompass`, `showsScale`, `showsBuildings`, `showsPointsOfInterests`, `zoomControlEnabled` et `toolbarEnabled`.

- [ ] **Step 2: Extraire `AddressModal`**

  Déplacer le bottom-sheet, `GooglePlacesAutocomplete`, les champs, la carte compacte et les actions. Les callbacks doivent être injectés par le parent.

- [ ] **Step 3: Monter les deux composants dans l’écran**

  Supprimer les blocs modal de `NewInterventionScreen` et conserver uniquement l’appel aux composants.

- [ ] **Step 4: Vérifier les intégrations**

  Run: `npm test -- --runInBand __tests__/googlePlacesConfig.test.ts __tests__/googlePlaceAddress.test.ts`

  Expected: PASS, sans régression de format API.

- [ ] **Step 5: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention src/screens/Intervention/screens/NewInterventionScreen.tsx && git commit -m "refactor: extract address modals"`

### Task 5: Extraire l’étape Adresse

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/AddressStep.tsx`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`
- Test: `__tests__/addressFlow.test.ts`, `__tests__/addressResponse.test.ts`

**Interfaces:**
- Consumes normalized `addresses`, loading state, selected address, selected map region, modal state and callbacks.
- Produces the address intro, compact map, first four address cards, empty state, CTA and conditional bottom actions.

- [ ] **Step 1: Extraire le JSX du step 3**

  Déplacer l’affichage de la liste, le `slice(0, 4)`, le CTA et les appels à `AddressModal`/`FullscreenMapModal` dans `AddressStep`.

- [ ] **Step 2: Garder la logique métier dans le hook ou le parent**

  `AddressStep` ne doit pas appeler RTK Query directement ; il reçoit les données et callbacks.

- [ ] **Step 3: Vérifier**

  Run: `npm test -- --runInBand __tests__/addressFlow.test.ts __tests__/addressResponse.test.ts`

  Expected: PASS.

- [ ] **Step 4: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention/AddressStep.tsx src/screens/Intervention/screens/NewInterventionScreen.tsx && git commit -m "refactor: extract address step"`

### Task 6: Extraire l’étape Récapitulatif

**Files:**
- Create: `src/screens/Intervention/components/new-intervention/SummaryStep.tsx`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`

**Interfaces:**
- Consumes service label, description, selected address label, timing, `onNext` and `onPrevious`.
- Produces the existing summary and bottom actions.

- [ ] **Step 1: Déplacer le JSX du step 4**

  Créer `SummaryStep` avec des valeurs reçues par props et déplacer les styles de résumé associés.

- [ ] **Step 2: Monter le composant**

  Remplacer le bloc `step === 4` par `<SummaryStep />`.

- [ ] **Step 3: Vérifier**

  Run: `npx tsc --noEmit 2>&1 | rg "(SummaryStep|NewInterventionScreen)" || true`

  Expected: aucune erreur sur les fichiers modifiés.

- [ ] **Step 4: Committer**

  Run: `git add src/screens/Intervention/components/new-intervention/SummaryStep.tsx src/screens/Intervention/screens/NewInterventionScreen.tsx && git commit -m "refactor: extract summary step"`

### Task 7: Extraire le hook et les styles partagés

**Files:**
- Create: `src/screens/Intervention/hooks/useNewIntervention.ts`
- Create: `src/screens/Intervention/styles/newIntervention.styles.ts`
- Modify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`
- Modify: `src/screens/Intervention/components/new-intervention/*.tsx`

**Interfaces:**
- `useNewIntervention(route)` returns the step state, selected values, address query state, map region and all transition/address callbacks currently defined in the screen.
- The style module exports only shared styled components used by multiple extracted children.

- [ ] **Step 1: Déplacer les états et actions dans le hook**

  Déplacer les `useState`, les sélections dérivées, `goNext`, `goPrevious`, `closeAddressModal`, `selectMapLocation`, `saveAddress` et la logique de sélection par défaut.

- [ ] **Step 2: Brancher le parent sur le hook**

  Réduire `NewInterventionScreen` à `useRoute`, `useNewIntervention`, `InterventionHeader`, `StepProgress` et le choix de l’étape.

- [ ] **Step 3: Déplacer uniquement les styles concernés**

  Déplacer les styles extraits vers le module de styles sans modifier les tokens, dimensions ou couleurs.

- [ ] **Step 4: Vérifier le flux complet**

  Run: `npm test -- --runInBand __tests__/addressFlow.test.ts __tests__/addressResponse.test.ts __tests__/googlePlaceAddress.test.ts __tests__/googlePlacesConfig.test.ts __tests__/interventionServicePannes.test.ts`

  Expected: tous les tests ciblés passent.

- [ ] **Step 5: Vérifier la qualité**

  Run: `npx eslint src/screens/Intervention`

  Expected: aucune erreur, les éventuels avertissements préexistants sont documentés.

- [ ] **Step 6: Committer**

  Run: `git add src/screens/Intervention src/screens/Intervention/components/new-intervention src/screens/Intervention/hooks src/screens/Intervention/styles && git commit -m "refactor: split new intervention flow"`

### Task 8: Vérification finale de la restructuration

**Files:**
- Verify: `src/screens/Intervention/screens/NewInterventionScreen.tsx`
- Verify: `src/screens/Intervention/components/new-intervention/*.tsx`
- Verify: `src/screens/Intervention/hooks/useNewIntervention.ts`

- [ ] **Step 1: Vérifier la taille et les responsabilités**

  Run: `wc -l src/screens/Intervention/screens/NewInterventionScreen.tsx && rg -n "GooglePlacesAutocomplete|MapView|const SectionTitle|step ===" src/screens/Intervention/screens/NewInterventionScreen.tsx`

  Expected: le parent ne contient plus les détails JSX des étapes, la recherche Google, `MapView` ni les styles spécifiques des enfants.

- [ ] **Step 2: Exécuter la suite ciblée finale**

  Run: `npm test -- --runInBand __tests__/addressFlow.test.ts __tests__/addressResponse.test.ts __tests__/googlePlaceAddress.test.ts __tests__/googlePlacesConfig.test.ts __tests__/googlePlaceAddress.test.ts __tests__/interventionServicePannes.test.ts`

  Expected: PASS.

- [ ] **Step 3: Contrôler le diff sans toucher aux changements externes**

  Run: `git diff --check && git status --short`

  Expected: aucun whitespace error ; les fichiers non liés restent inchangés par cette restructuration.
