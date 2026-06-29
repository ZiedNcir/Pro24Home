# Pro24Home — Onboarding illustrations

Ces fichiers sont des illustrations explicatives seules, pas des écrans complets.

## Fichiers finaux

```txt
final/onboarding_repair.png
final/onboarding_quote.png
final/onboarding_tracking.png
```

## Règle importante

Le logo Pro24Home ne doit jamais être intégré dans ces PNG.
Le logo SVG officiel du projet doit être affiché dans l'écran React Native.

## Utilisation

```tsx
import { OnboardingIllustrations } from '@assets/illustrations/onboarding';

<Image
  source={OnboardingIllustrations.Repair}
  resizeMode="contain"
/>
```
