# Pro24Home — Asset Delivery Rules

## Règle principale

Une image générée dans le chat est rarement un asset final complet.

Elle doit être nettoyée conceptuellement avant livraison :

```txt
éléments décoratifs → conservés
éléments UI → reconstruits en code
logo → remplacé par SVG officiel
texte → translations
boutons → Design System
loader → AppLoader
```

## Exemple

### Prototype IA

Contient :
- background orange
- ville
- logo
- tagline
- loader

### Livraison correcte

```txt
background/décor → asset si nécessaire
logo → src/assets/logo/logo-mediumPro24.svg
tagline → src/translations/fr/module1.ts
loader → src/design-system/ui/Loader/AppLoader.tsx
screen → src/features/client/auth/screens/C01ClientSplash.tsx
```

## Interdit

Livrer une image complète contenant :
- faux logo ;
- texte figé ;
- bouton figé ;
- loader figé ;
- status bar figée.
