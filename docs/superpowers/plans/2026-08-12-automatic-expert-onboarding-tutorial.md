# Automatic Expert Onboarding Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the PRO24HOME welcome screen into a three-step client tutorial that explains automatic expert assignment and enters the existing registration flow.

**Architecture:** Keep the flow inside `src/screens/Welcome.tsx` using local step state and a typed tutorial-data array. Generate two additional raster hero assets for the service-matching and intervention-complete steps, while reusing the current welcome hero for the first step. Preserve the existing navigation targets and visual shell.

**Tech Stack:** React Native 0.83, TypeScript, styled-components/native, react-navigation, react-native-svg, bundled PNG/SVG assets, Jest/Metro validation.

## Global Constraints

- The tutorial is client-first and must explain that PRO24HOME assigns the professional automatically.
- The flow has exactly three steps with one primary action per step.
- `Passer` opens client registration from any step.
- `Suivant` advances locally; the final CTA is `Commencer` and opens client registration.
- The existing `Se connecter` link remains available on every step.
- The active progress position is an orange elongated pill; inactive positions are pale-blue dots.
- Preserve the elegant white/soft-blue surface, navy typography, orange accents, rounded hero container, safe-area spacing, and readable touch targets.
- Do not add backend calls, persistence, new routes, feature grids, or unrelated navigation.

---

### Task 1: Create tutorial artwork assets

**Files:**
- Create: `src/assets/images/onboarding-match.png`
- Create: `src/assets/images/onboarding-complete.png`

**Interfaces:**
- Consumes: the current PRO24HOME hero art direction and `logo444.png` as brand reference.
- Produces: two portrait-safe raster assets with no embedded copy, logos, buttons, or device chrome.

- [ ] **Step 1: Generate the automatic-assignment visual**

Create a polished mobile hero image showing a PRO24HOME technician receiving an assignment on a phone, with subtle home/route cues. Keep the green-and-orange uniform, realistic soft-3D style, bright daylight, and clean composition. Do not include any text.

- [ ] **Step 2: Generate the completed-intervention visual**

Create a polished mobile hero image showing a relieved homeowner and the PRO24HOME technician beside a well-maintained home. Keep the same palette and rendering style. Do not include any text.

- [ ] **Step 3: Inspect both images**

Confirm that each image has the subject fully inside the frame, no accidental text, no watermark, and enough contrast behind the UI content.

- [ ] **Step 4: Copy the accepted assets into the project**

Save the accepted files at the exact paths above without modifying the existing hero asset.

---

### Task 2: Add typed three-step tutorial state

**Files:**
- Modify: `src/screens/Welcome.tsx`

**Interfaces:**
- Consumes: `onboarding-hero-v2.png`, `onboarding-match.png`, and `onboarding-complete.png`.
- Produces: a local `currentStep` state, typed `tutorialSteps` data, and step-aware CTA/progress behavior.

- [ ] **Step 1: Define the tutorial model**

Add a typed step structure with `title`, `description`, `image`, and `actionLabel` fields. Define exactly these three steps:

```ts
[
  {
    title: 'Décrivez votre besoin',
    description: "Expliquez-nous ce qu'il faut réparer ou améliorer chez vous.",
    actionLabel: 'Suivant',
  },
  {
    title: 'PRO24HOME choisit votre expert',
    description: 'Nous vous attribuons automatiquement le professionnel le plus adapté à votre besoin et à votre localisation.',
    actionLabel: 'Suivant',
  },
  {
    title: "Votre intervention est prise en charge",
    description: "Recevez la confirmation et avancez sereinement jusqu'à la fin de l'intervention.",
    actionLabel: 'Commencer',
  },
]
```

- [ ] **Step 2: Implement step transitions**

Initialize `currentStep` to `0`. Make `handleStart` advance to the next step when `currentStep < tutorialSteps.length - 1`; on the final step, keep the existing loading delay and navigate to `RegisterScreen` with `{ role: 'client' }`.

- [ ] **Step 3: Implement skip and sign-in behavior**

Keep `Passer` navigating directly to client registration. Keep `Se connecter` navigating to `SignIn` with `{ role: 'client' }` on every step.

- [ ] **Step 4: Bind the current step to the screen**

Use the active step's image, title, description, and action label in the existing layout. Replace the static eyebrow with a short step context label such as `ÉTAPE ${currentStep + 1} SUR 3` while retaining the brand identity in the header.

---

### Task 3: Make the progress indicator interactive and accessible

**Files:**
- Modify: `src/screens/Welcome.tsx`

**Interfaces:**
- Consumes: `currentStep` from Task 2.
- Produces: a progress row that announces the current step and visually tracks it.

- [ ] **Step 1: Bind active state**

Render three progress positions from `tutorialSteps.map`, setting `active` when the index equals `currentStep`.

- [ ] **Step 2: Add accessibility semantics**

Set the progress row label to `Étape ${currentStep + 1} sur 3` and expose the step count in the screen content without relying only on color.

- [ ] **Step 3: Preserve touch target sizing**

Keep the primary CTA at least 44 points tall and `Passer`/`Se connecter` comfortably tappable. Do not make progress dots the only way to navigate.

---

### Task 4: Verify the tutorial flow

**Files:**
- Verify: `src/screens/Welcome.tsx`
- Verify: `src/assets/images/onboarding-match.png`
- Verify: `src/assets/images/onboarding-complete.png`
- Update: `artifacts/ios/latest.png` through the capture script

**Interfaces:**
- Consumes: the completed three-step flow.
- Produces: lint/build evidence and a clean iOS screenshot of the initial tutorial step.

- [ ] **Step 1: Run the focused linter**

Run `npx eslint src/screens/Welcome.tsx`.

Expected: exit code `0`.

- [ ] **Step 2: Build the iOS JavaScript bundle**

Run:

```sh
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/pro24home-tutorial.jsbundle --assets-dest /tmp/pro24home-tutorial-assets
```

Expected: Metro writes the bundle and copies assets successfully.

- [ ] **Step 3: Capture the initial tutorial screen**

Run `npm run capture:ios` after the simulator is stable. Inspect `artifacts/ios/latest.png` and confirm there is no refresh overlay, the first step copy is visible, the first progress position is active, and the CTA reads `Suivant`.

- [ ] **Step 4: Verify the state transitions**

Manually tap `Suivant` twice, confirming the copy and hero asset change on each step, the active indicator moves, and `Commencer` enters client registration. Confirm `Passer` and `Se connecter` still route correctly.

