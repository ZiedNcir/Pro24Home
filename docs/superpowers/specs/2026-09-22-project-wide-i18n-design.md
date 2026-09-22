# Internationalisation complète du projet — conception

## Objectif

Centraliser dans i18n tous les textes statiques que Pro24Home présente à une personne utilisant l’application. L’interface doit rester disponible en français et en anglais, avec une traduction complète dans les deux langues et sans nouveaux textes visibles codés directement dans les écrans ou les parcours.

## Périmètre validé

La migration couvre les textes contrôlés par le projet :

- titres, descriptions, boutons, labels, placeholders, aides et états vides ;
- erreurs de formulaire, confirmations, alertes, dialogues et toasts ;
- messages de notifications locales créées par l’application ;
- noms accessibles, labels de contrôles et autres textes lus par les technologies d’assistance ;
- chaînes statiques natives du projet, notamment les descriptions de permissions iOS et les ressources Android affichées dans les notifications ou les contrôles système.

Les chaînes dynamiques provenant de l’API (par exemple nom du client, adresse ou contenu d’une notification serveur), les identifiants techniques, les journaux internes et les textes fournis directement par des services ou SDK tiers restent hors des dictionnaires de l’application. Le contenu dynamique ne doit pas être remplacé par une traduction statique.

Les langues conservées sont `fr` et `en`. La langue de l’appareil est détectée à l’ouverture, les variantes régionales sont ramenées à une langue prise en charge et le français reste le repli si aucune langue disponible ne correspond.

## Décision d’architecture

Conserver `i18next` et `react-i18next` déjà présents. Réutiliser `src/translations/fr.json` et `src/translations/en.json`, sans ajouter une seconde couche d’abstraction ni un nouveau moteur de traduction.

Organiser les nouvelles clés par domaine fonctionnel (par exemple `common`, `auth`, `intervention`, `notifications`, `navigation`, `accessibility`), en étendant les namespaces existants lorsque c’est cohérent. Les clés doivent identifier l’intention de l’interface plutôt que répéter une phrase traduite. Les valeurs avec variables utilisent les interpolations i18next (`{{count}}`, `{{name}}`) plutôt que la concaténation de fragments.

Les traductions doivent être demandées au moment où l’interface ou le message est construit, afin que les changements de langue ne figent pas un texte traduit lors du chargement du module. Dans un composant, utiliser `useTranslation`; dans le code hors React, utiliser l’instance i18next via un helper adapté. Les modèles contenant du texte seront convertis en descripteurs sémantiques ou en clés, puis résolus dans la couche d’interface.

## Parité des locales et détection

- Les dictionnaires français et anglais doivent avoir la même arborescence de clés.
- L’initialisation normalise le code de langue système en `fr` ou `en`, puis sélectionne `fr` comme repli.
- L’utilisation de la détection système doit être adaptée à React Native et ne pas dépendre d’un détecteur de navigateur.
- Les clés et variables d’interpolation sont typées à partir des ressources i18n pour permettre la détection des références inexistantes pendant le développement.

## Migration

La migration se fait par domaines et parcours utilisateurs pour faciliter l’examen et réduire les régressions. L’inventaire doit rechercher le texte dans les fichiers TypeScript/TSX, les ressources natives, les métadonnées d’accessibilité, les appels d’alerte/toast et les notifications locales. Les textes extraits sont ajoutés aux deux dictionnaires avec une traduction naturelle et cohérente.

Ordre proposé : infrastructure et dictionnaires, composants UI partagés, authentification et compte, intervention et paiement, centre de notifications, navigation et permissions, puis parcours restants. Chaque étape laisse le projet compilable et utilise les mêmes conventions de clés.

## Prévention des régressions

Ajouter un contrôle automatisé au projet qui :

1. compare récursivement les clés de `fr.json` et `en.json` et échoue sur les clés manquantes ou supplémentaires ;
2. vérifie que les références statiques `t('...')` et `i18n.t('...')` existent dans les ressources ;
3. repère les littéraux statiques dans les emplacements d’interface reconnus, dont le texte JSX, les props d’accessibilité et de formulaire, les appels à `Alert`, les toasts et les notifications locales ;
4. permet explicitement les contenus dynamiques, les constantes techniques et les exceptions non visibles, avec une liste d’exceptions minimale et motivée.

Le contrôle s’applique d’abord aux fichiers migrés afin de permettre une intégration par étapes, puis à tous les fichiers du projet à la fin. Une règle de lint ou un script dédié doit être exécuté dans le flux de validation standard pour empêcher le retour de textes statiques dans l’interface.

## Critères d’acceptation

- Toute chaîne statique contrôlée par Pro24Home et visible par l’utilisateur est résolue par i18n dans les deux langues.
- Les textes iOS de permission appartenant au projet ont des variantes françaises et anglaises ; les ressources Android localisées couvrent les chaînes personnalisées du projet.
- Les deux locales possèdent exactement les mêmes clés et les mêmes variables d’interpolation.
- Une clé utilisée mais absente est détectée par le contrôle automatisé.
- Le contrôle échoue sur un nouveau texte en clair placé dans un emplacement d’interface pris en charge.
- La langue système sélectionne `fr` ou `en` comme prévu et les autres locales retombent sur le français.
- Les chaînes dynamiques de l’API et celles générées par des services tiers ne sont pas altérées.

## Hors périmètre

- Ajouter d’autres langues que le français et l’anglais.
- Traduire les noms et contenus dynamiques renvoyés par le serveur.
- Modifier les textes ou le comportement interne du SDK Google, d’OneSignal ou d’autres fournisseurs tiers.
- Reconcevoir les écrans ou changer leurs comportements au-delà de l’extraction des chaînes.
