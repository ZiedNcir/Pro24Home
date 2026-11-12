# Connexion — option 1

## Vérification professionnelle — option 2 avec illustration

- Source visuelle : `/Users/ziedncir/.codex/generated_images/01a17d83-409d-78a3-9673-f7d7de7dcc65/exec-2a9cabb6-48e9-4aad-8504-3290f45b4057.png`.
- Capture de l'implémentation : indisponible. Le compte réel utilisé dans le simulateur n'a pas encore envoyé ses documents et ne peut donc pas atteindre cet écran sans modifier son dossier.
- État cible : compte professionnel en attente, documents envoyés, thème clair. La comparaison de la typographie, des espacements, des couleurs, de l'illustration et des textes reste à effectuer sur un rendu natif de cet état.
- Contrôles effectués : tests des états de documents et de navigation, vérification des traductions, TypeScript et ESLint ciblé.
- final result: blocked

final result: passed

## Source et rendu

- Option choisie : première image affichée de l’idéation connexion, conservée dans `docs/design/signin/reference-option-1.png`.
- Écran natif final : `docs/design/signin/implemented-option-1.png`.
- Comparaison côte à côte ouverte et inspectée : `docs/design/signin/comparison-final.png`, référence à gauche, implémentation à droite, état vide sans focus, français, clair, 390 × 844.
- Capture iPhone 13 Pro Max iOS17.4 native 1284 × 2778 ; recadrage du contenu (57,141,1170,2532) puis normalisation à390 ×844. Header réel logo/flèche, fonts et contrôles du projet réutilisés. Scène locale isolée utilisant le vrai SignIn et le vrai navigateur, sans authentification fabriquée.

## Itérations

La première comparaison (`docs/design/signin/comparison-1.png`) montrait une emphase insuffisante des CTA et de petits décalages de progression verticale/position du pied de page. Titre et boutons agrandis, espacement du formulaire et de la récupération ajustés, confidentialité remontée. La comparaison finale aligne les champs, la récupération, les CTA principal/secondaire et le footer ; aucun P0/P1/P2 visuel restant dans cet état. Différences mineures conservées : logo réel et son dimensionnement existant, icône œil de la bibliothèque installée et contrôles partagés du projet.

## Interactions et vérifications

Sur le simulateur : Créer un compte ouvre AccountType, retour vers SignIn fonctionne ; Mot de passe oublié ouvre la récupération, son retour revient à SignIn ; Se connecter avec champs vides affiche les erreurs sous les deux champs. Aucun compte créé, aucun SMS demandé et aucune requête de connexion réelle avec identifiants personnels.

Cinq suites ciblées/19 tests réussis, dont deux nouveaux tests des liens inscription/récupération et le basculement de visibilité du mot de passe dans le champ réel. Politique de création toujours active à l’inscription ; connexion autorise un mot de passe existant non vide, malgré l’absence d’astérisques visuels. Routage professionnel et upload restent couverts. TypeScript, ESLint sur les fichiers changés, contrôle i18n (238 fichiers) et whitespace check réussis.

## Limites

Comparaison finale uniquement sur iOS en clair ; Android, taille de texte système agrandie et petit écran ne sont pas vérifiés pour cette nouvelle page. La confidentialité conserve son texte existant, sans destination inventée. Le blocage serveur des comptes inactifs sans session n’est pas modifié. Le cycle d’import de DialogModal a été supprimé par des imports directs. Une dépréciation de SafeAreaView provenant de la dépendance des toasts a été identifiée dans les logs puis exclue uniquement du bandeau du preview pour la capture ; aucune suppression de logs ajoutée au produit.

---

# Formulaires — option 3, header existant

final result: passed

Scope: existing native form system and the professional profile step used as the selected visual target. Header retains the existing logo asset, back arrow, sizing and navigation. No web prototype or app authentication bypass.

## Visual evidence and iterations

- User selected the third displayed concept, then requested the existing logo/back header. Revised visual shown before implementation: `docs/design/forms/reference-option-3-header.png`.
- Final native capture: `docs/design/forms/implemented-option-3.png`.
- Opened side-by-side final comparison: `docs/design/forms/comparison-final.png`, source left, implementation right; both 390 × 844, French, light, first name Zied, missing surname error, other inputs untouched, no focused input.
- iPhone 13 Pro Max iOS 17.4 native screenshot 1284 × 2778, content crop (57, 141, 1170, 2532), excluding OS chrome and centered preview gutters. Real RegisterScreen, ProfessionalForm, theme, fonts, validation and country picker run in an isolated local preview with preloaded empty services. No account creation or upload was submitted.
- First combined comparison (`artifacts/design/forms/comparison-1.png`) found P2 spacing drift, oversized CTA and clipped sign-in footer. Reduced intro/field spacing, aligned the footer, set CTA height48, used explicit bold button labels and matched the Continuer/link wording.
- A second combined comparison (`artifacts/design/forms/comparison-2.png`) confirmed the field hierarchy; remaining footer offset was corrected before the final capture. The final comparison has no unresolved P0/P1/P2 finding in this state.
- Supplemental narrow/dark capture: `docs/design/forms/narrow-dark.png`, actual content width330 × height844. Postal code and phone stack, the address placeholder fits, and both CTA and sign-in link remain visible. Removed contrasting outer card surfaces and reduced the compact footer gap after visual review. Native CUA scroll gestures returned noWindowsAvailable, so scrolling beyond these visible states was not verified.

## Intentional adaptations

- Existing header uses the original asset and layout, as requested, rather than the generated approximation.
- Fields/buttons retain48pt height for touch usability, slightly taller than the generated drawing. No pixel-identical claim.
- Existing localized validation message is retained instead of replacing its meaning solely for the mockup.
- Native phone input retains its working international-number value and country picker; it does not split the country prefix into a decorative fake input. The real flag asset and library chevron signal country selection.
- Existing theme colors and icon library are reused; dark palette follows existing theme tokens.

## Verification

TypeScript, ESLint on changed files, translation key check (238 source files), and git diff whitespace check passed. Six relevant suites /18 tests passed: client form, professional registration loading, sign-in password policy, professional sign-in, document upload and registration steps. Layout changes do not alter registration payloads, server upload, account-scoped persistence or pending-account routing. Login password policy and registration policy remain separately tested.

Limits: Android and physical keyboard/large dynamic-type layouts were not visually checked. Login and recovery share the revised controls/layout but did not receive separate screenshot comparisons in this final pass. Live inactive-account authentication remains subject to the server-session limitation documented in the existing audit. A framework/dependency development-warning banner appeared on preview reloads and was dismissed for captures; production code does not suppress warnings.

---

# Mes documents — option 2

final result: passed

Scope: native professional document screen, light theme, French, 2 of 5 submitted, proof of address selected. This result covers visual implementation, not a live server authentication/upload acceptance test.

## Evidence

- Selected source: `docs/design/mes-documents/reference-option-2.png`.
- Rendered implementation: `docs/design/mes-documents/implemented-option-2.png`.
- Side-by-side comparison: `docs/design/mes-documents/comparison-option-2.png` (source left, implementation right).
- Captured on an iPhone 13 Pro Max iOS 17.4 simulator using the actual React Native view, bundled fonts, theme, translation and icon components. Isolated local fixture supplies two submitted identity documents; it does not authenticate or contact the backend.
- Native screenshot 1284 × 2778: content cropped to (57, 141, 1170, 2532), excluding OS chrome, normalized to 390 × 844. Reference normalized to the same dimensions and state.

## Iterations

1. Initial rendered comparison (`artifacts/design/mes-documents/comparison-1.png`) found P2 vertical drift: notice line height, heading wrapping, description and upload spacing pushed the footer down. Queue labels also differed from the selected source.
2. Adjusted notice padding, progress line height, heading line breaks/height, section spacing, and short KBIS/RIB labels. Recaptured native implementation and opened the combined final comparison above. Progress, notice, heading, dashed area, buttons, queue and footer now align closely; all content is visible. No remaining P0/P1/P2 findings in this state.
3. P3 intentional difference: existing FontAwesome solid icons replace the mockup's outline icons. No new icon package or handcrafted SVG was added.

## Functional verification

- TypeScript: `npx tsc --noEmit --incremental false` passed.
- ESLint on document controller, view and upload screen tests passed.
- Translation key check passed (237 source files).
- Five relevant suites passed, 28 tests: sign-in, document upload, account-scoped storage, onboarding scenarios and pending navigation.
- New coverage: selected queue item controls upload type, camera photo uses current type, failed server upload cannot finish or navigate. Existing coverage verifies final acknowledged upload persists completion and navigates to pending.

## Limits

The complete live inactive-account flow remains blocked by the previously observed login response lacking `user` and `access_token`; see `docs/audits/2026-11-07-inactive-professional-login.md`. No authentication bypass was introduced. Native preview callbacks for file/camera are inert; those production interactions are covered by integration tests with native picker mocks. Android and dark-theme visual comparisons were not run.

---

# Cartes de services — option 3

final result: passed

Compared the selected reference and native iOS rendering at 390 points wide in French light mode. The four horizontal cards match the selected structure, with a thumbnail on the left, wrapping copy and a separate chevron on the right. The native rendering retains the existing service names, descriptions and images. Reference and capture are in `docs/design/service-cards/`. Side-by-side evidence is in `artifacts/design/service-cards/comparison.png`.

TypeScript, targeted ESLint and diff whitespace checks passed. The isolated preview verifies the layout. The production tap handler still routes to NewIntervention with the existing service parameters. Navigation was not exercised in the isolated preview.

---

# Mes interventions — état vide En cours

final result: blocked

L’option 1 sélectionnée est intégrée sans bouton dans l’état vide. La comparaison visuelle native avec la maquette reste à effectuer. TypeScript et le contrôle i18n passent ; ESLint signale deux avertissements de styles en ligne.
