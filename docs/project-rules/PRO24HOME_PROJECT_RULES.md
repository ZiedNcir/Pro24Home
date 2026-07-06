# Pro24Home — Règles officielles du projet

## 1. Prototype First

Chaque écran suit ce cycle :

```txt
Analyse UX
↓
Prototype graphique dans le chat
↓
Validation
↓
Intégration dans les assets
↓
Implémentation React Native
↓
Livraison
```

Aucun livrable ZIP n’est créé avant validation explicite.

---

## 2. Logo officiel uniquement

Le logo officiel fourni par le client est la seule source autorisée.

Interdits :

```txt
logo généré par IA
logo redessiné
logo recoloré
logo modifié
logo intégré définitivement dans une image IA
```

Obligatoire :

```txt
utiliser le SVG officiel du projet
```

Si un prototype contient un faux logo généré par IA, il doit être remplacé par le logo officiel avant livraison.

---

## 3. Les images générées dans le chat

Les images créées dans le chat sont considérées à 90 % comme des backgrounds, décors ou références visuelles.

Elles servent à définir :

```txt
ambiance
composition
couleurs
formes
illustrations
décor
hiérarchie visuelle
```

Elles ne doivent pas embarquer définitivement les éléments UI.

---

## 4. Règle background / UI reconstruite en code

Si une image générée contient :

```txt
texte
bouton
logo
loader
status bar
input
icône UI
CTA
navigation
tab bar
```

ces éléments doivent être remplacés en livraison par du code React Native.

Répartition officielle :

```txt
Background visuel → image asset
Logo → SVG officiel
Textes → src/translations
Boutons → Design System
Loader → AppLoader
Inputs → Design System
Icônes UI → Design System icons
Navigation → React Navigation
```

Exemple Splash :

```txt
Prototype IA complet
↓
On garde l’ambiance, les formes et le fond
↓
On reconstruit en code :
- logo officiel SVG
- tagline
- loader
- animations
```

---

## 5. Statut des images

```txt
Prototype
Image visible dans le chat uniquement.

Validée
Direction artistique approuvée.

Livrée
Image présente dans src/assets/... et utilisée dans le code.
```

Une image visible uniquement dans le chat n’est jamais considérée comme livrée.

---

## 6. Assets

Les assets validés doivent être rangés dans :

```txt
src/assets/
  illustrations/
  images/
  icons/
  lottie/
  logo/
```

Chaque dossier d’assets livré doit contenir :

```txt
README.md
index.ts
fichiers finalisés
```

---

## 7. Traductions

Aucun texte hardcodé dans les écrans.

Interdit :

```tsx
<Button title="Connexion" />
```

Autorisé :

```tsx
<Button title={t('auth.login.button')} />
```

Tous les textes doivent passer par :

```txt
src/translations/
```

---

## 8. Design System

Les écrans utilisent uniquement les composants validés du Design System.

Interdits :

```txt
duplication de composants
styles inline complexes
boutons spécifiques à un seul écran si un Button existe déjà
inputs spécifiques si un Input existe déjà
```

---

## 9. Responsive

Toutes les tailles doivent passer par :

```txt
src/utils/normalizedCss.tsx
```

Fonctions officielles :

```txt
horizontalScale
verticalScale
moderateScale
fontPixel
```

---

## 10. Loader

Les loaders doivent utiliser le composant Design System :

```txt
AppLoader
```

Aucun loader ne doit être dessiné directement dans une image finale si l’écran est implémenté en React Native.

---

## 11. Livraison

Une livraison complète contient toujours :

```txt
code React Native
assets nécessaires
translations
README
CHANGELOG
INTEGRATION_NOTES
```

---

## 12. Branche de travail

La branche `feature-1` est la branche d’évolution contrôlée.

Règle :

```txt
master = source de vérité
feature-1 = amélioration contrôlée
```

On améliore l’existant au lieu de recréer tout le front.
