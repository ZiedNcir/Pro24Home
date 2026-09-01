# PRO24HOME Automatic Expert Assignment Tutorial

## Goal

Extend the existing PRO24HOME welcome screen into a three-step onboarding tutorial that clearly explains the app's core promise: the customer describes a home-improvement need and PRO24HOME automatically assigns a suitable expert.

## Audience

Homeowners and clients looking for repair, maintenance, or home-improvement help. The tutorial is client-first and does not explain the professional registration path.

## Experience

The tutorial remains a focused mobile onboarding flow with one message, one primary action, and one optional skip action per screen.

### Step 1 — Describe the need

- Headline: `Décrivez votre besoin`
- Supporting copy: `Expliquez-nous ce qu'il faut réparer ou améliorer chez vous.`
- Primary action: `Suivant`
- Visual direction: warm home and repair context, using the existing PRO24HOME hero style.

### Step 2 — Automatic expert assignment

- Headline: `PRO24HOME choisit votre expert`
- Supporting copy: `Nous vous attribuons automatiquement le professionnel le plus adapté à votre besoin et à votre localisation.`
- Primary action: `Suivant`
- Visual direction: expert/profile and matching/service context, with the brand's orange and green accents.

### Step 3 — Intervention taken care of

- Headline: `Votre intervention est prise en charge`
- Supporting copy: `Recevez la confirmation et avancez sereinement jusqu'à la fin de l'intervention.`
- Primary action: `Commencer`
- Visual direction: resolved, reassuring home-improvement outcome.

## Interaction rules

- The progress indicator has three positions and updates to the current step.
- The active position uses the orange elongated pill; inactive positions use small pale-blue dots.
- `Suivant` advances to the next step without navigating away.
- `Passer` skips the tutorial and opens client registration.
- On the final step, `Commencer` opens client registration.
- The existing `Se connecter` link remains available on every step.
- Forward transitions use the existing subtle fade/slide animation; no auto-advance.

## Visual system

- Preserve the existing PRO24HOME logo and brand palette.
- Use the current clean white/soft-blue page surface.
- Keep the hero image inside a rounded container with generous margins.
- Use navy for primary text, muted blue-gray for supporting copy, and orange for emphasis and CTAs.
- Maintain safe-area spacing and readable touch targets.
- Avoid adding feature grids, cards, navigation, or unrelated product claims.

## Accessibility and UX requirements

- Each step has one clear heading and one clear primary action.
- Progress is exposed as `Étape X sur 3` for assistive technologies.
- Buttons and skip/link controls have accessible labels and comfortable touch areas.
- Text maintains high contrast against the white surface.
- The tutorial must remain usable on short iPhone screens without clipping the CTA or sign-in link.

## Success criteria

- A first-time client can explain the product promise after viewing all three screens.
- The automatic assignment behavior is explicit and not presented as a manual expert marketplace.
- The progress indicator accurately reflects the current screen.
- The final CTA enters the existing registration flow.
- Existing sign-in behavior remains unchanged.
