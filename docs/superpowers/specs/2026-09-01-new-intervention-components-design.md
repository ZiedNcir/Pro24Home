# Nouvelle intervention — restructuration des composants

## Objectif

Découper le flux de création d’une intervention en composants autonomes afin de réduire la complexité de `NewInterventionScreen.tsx`, tout en conservant le comportement actuel.

## Périmètre

Le périmètre couvre les quatre étapes du flux : type de service, détails, adresse et récapitulatif. Il couvre également le modal d’ajout d’adresse et la carte plein écran.

Les intégrations existantes restent inchangées : services API, Google Places API (New), géocodage inverse, sauvegarde d’adresse, sélection d’adresse et règles d’activation des boutons.

## Structure cible

- `NewInterventionScreen.tsx` orchestre la navigation entre les étapes et fournit les données aux enfants.
- `components/new-intervention/ServiceStep.tsx` affiche le service et les types de panne.
- `components/new-intervention/DetailsStep.tsx` affiche la description, les photos et le créneau.
- `components/new-intervention/AddressStep.tsx` affiche les adresses, la carte compacte et le CTA d’ajout.
- `components/new-intervention/SummaryStep.tsx` affiche le récapitulatif.
- `components/new-intervention/AddressModal.tsx` contient la recherche Google, les champs et l’enregistrement.
- `components/new-intervention/FullscreenMapModal.tsx` contient la carte interactive plein écran.
- `hooks/useNewIntervention.ts` regroupe l’état du flux, les transitions et les mutations d’adresse.
- `styles/newIntervention.styles.ts` regroupe les styles propres à ces composants.

## Flux de données

Le hook expose un état explicite (`step`, sélection du problème, timing, adresse sélectionnée, modal ouvert, carte plein écran) ainsi que des actions (`goNext`, `goPrevious`, `openAddressModal`, `closeAddressModal`, `saveAddress`, `selectMapLocation`). Les composants d’étape restent principalement présentatifs et déclenchent ces actions via leurs props.

Le composant Adresse reçoit toujours un tableau normalisé. La liste affichée est limitée aux quatre premières adresses. Le bouton « Continuer » est visible uniquement lorsqu’une adresse est sélectionnée et que le modal de recherche est fermé.

## Comportement modal et carte

- Le CTA d’ajout ouvre un bottom-sheet modal.
- La recherche utilise Places API (New) et récupère les coordonnées via l’endpoint de détails.
- La carte compacte ouvre une carte plein écran au tap.
- La carte plein écran permet déplacement, zoom, rotation, inclinaison, boussole, échelle, bâtiments et points d’intérêt.
- Un tap sur la carte place un marqueur et tente un géocodage inverse.
- La fermeture du modal réinitialise les champs temporaires sans perdre l’adresse déjà enregistrée.

## Compatibilité et qualité

- Réutiliser les composants et tokens existants du projet.
- Ne pas modifier les endpoints API ni la navigation globale.
- Ajouter ou déplacer les tests unitaires avec les modules concernés.
- Vérifier TypeScript ciblé, ESLint ciblé et les tests du flux adresse après chaque étape.
- Préserver les changements non liés déjà présents dans la branche.

## Critères de réussite

- `NewInterventionScreen.tsx` ne contient plus le détail des quatre écrans ni les styles de leurs sous-composants.
- Chaque composant d’étape est testable et possède une responsabilité claire.
- Le comportement adresse actuel reste fonctionnel : affichage des adresses API, recherche, sauvegarde, sélection sur carte et conditions du bouton « Continuer ».
- Les tests ciblés passent et aucune erreur TypeScript n’est introduite par la restructuration.
