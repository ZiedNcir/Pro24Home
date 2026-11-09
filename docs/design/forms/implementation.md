# Formulaires — option 3 avec header existant

Choix utilisateur : troisième image affichée, avec le logo et la flèche de retour existants. La maquette ajustée est `reference-option-3-header.png`. Implémenter dans React Native existant, sans nouveau prototype web.

1. Harmoniser le champ partagé : hauteur minimum 48, contour fin, label stable 14, saisie15, aide/erreur12, contraste clair/sombre, aucune animation de grossissement ; garder validation, sélecteur de pays et masquage du mot de passe.
2. Ajouter une progression de formulaire partagée avec étapes textuelles et pourcentage. Adapter les inscriptions client/pro ; rapprocher le contenu, retirer les cartes et les titres répétés, conserver exactement le header existant.
3. Disposer code postal/téléphone sur une ligne quand l’espace permet, empiler sur petit écran. Harmoniser connexion/récupération et leurs boutons.
4. Vérifier tests existants, TypeScript, lint, traductions ; capturer le rendu natif et le comparer côte à côte avec la maquette ajustée. Ne pas envoyer de données d’inscription réelles.

## Résultat

Option 3 appliquée aux formulaires existants. Champs partagés de 48 points, labels neutres et persistants, messages d’erreur sous les champs, sélecteur de pays conservé, étapes et pourcentage partagés, CTA et lien de connexion harmonisés. Header existant conservé.

Rendu natif comparé avec la référence en 390 × 844 ; contrôle supplémentaire en 330 × 844 sombre. Voir `implemented-option-3.png`, `comparison-final.png`, `narrow-dark.png` et le rapport `design-qa.md` à la racine pour les limites précises. Six suites ciblées / 18 tests passent, avec TypeScript, ESLint et contrôle i18n.
