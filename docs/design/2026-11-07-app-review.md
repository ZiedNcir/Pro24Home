# Revue progressive iOS

Périmètre autorisé : corriger les erreurs UX/UI observées dans les parcours existants, conserver la charte et vérifier chaque écran dans le simulateur. Pas de nouvelle direction graphique nécessaire pour les défauts identifiés.

Premier lot : supprimer les autorisations globales au démarrage ; demander la caméra Android au moment de la prise de photo ; demander la localisation de premier plan lorsque le professionnel active sa disponibilité ; réduire le vide entre illustration et texte dans le tutoriel sans couper le contenu sur petit écran. Respecter la langue du téléphone (FR/EN).

Validation : tests des permissions contextuelles, tests de navigation du tutoriel, contrôles TypeScript/ESLint/i18n et captures iOS avant/après. Poursuivre ensuite sur connexion et inscription, sans créer de compte ni envoyer de documents réels pendant la revue.

## Résultat du premier lot

Parcours vus dans cette session sur iPhone 13 Pro Max / iOS 17.4 : les trois pages du tutoriel, connexion, récupération du mot de passe, choix du profil, première étape d’inscription professionnelle et validation de champs vides.

Corrections appliquées :
- Fin des demandes globales de caméra, photos et localisation au lancement. Caméra demandée à l’usage sur Android ; les sélecteurs natifs gèrent l’accès iOS. Galerie sans demande de bibliothèque complète inutile. Localisation de premier plan demandée lors du changement de disponibilité pro, sans demande de localisation permanente.
- Tutoriel : texte rapproché de l’illustration et graisses explicites pour titre, action et lien de connexion.
- Connexion : labels visibles et accessibles, remplissage automatique adapté, lien de récupération de 44 points minimum, anglais corrigé. Les mots de passe existants restent masqués et obligatoires, sans imposer la politique de création ; celle-ci reste active à l’inscription.
- Choix de profil : titres plus lisibles.
- Inscription : le chargement des métiers ne bloque plus les étapes précédentes ; skeleton uniquement sur la sélection de métiers, envoi désactivé tant que cette liste charge. Titre répété retiré, retour localisé et liens identifiés comme boutons.
- Erreurs de formulaire annoncées dans l’arbre d’accessibilité ; l’écran natif a confirmé les messages de chaque champ obligatoire après tentative de passage à l’étape suivante.
- Boutons partagés : graisse medium explicite.

Validation automatisée : 8 suites ciblées / 24 tests réussis (permissions contextuelles, politique de mot de passe, chargement de l’inscription pro, tutoriel, connexion pro, upload des documents, statut pro et étapes d’inscription). TypeScript, ESLint sur les fichiers concernés et contrôle i18n validés.

Captures natives : `artifacts/review/ios/02-tutorial-after.png`, `03-forgot-password.png`, `04-professional-validation.png`. Les captures et observations UI de cette session fondent les constats ; aucune nouvelle inscription, récupération SMS, connexion réelle ou soumission de document n’a été effectuée.

## À poursuivre

La revue intégrale n’est pas terminée. Reste à parcourir les étapes remplies de l’inscription et les espaces authentifiés client/pro (interventions, notifications, paiement, profil, paramètres). Le texte de politique de confidentialité à la connexion ne mène pas à une destination configurée : fournir une vraie page publiée avant d’ajouter un lien. Pas de conformité complète d’accessibilité déduite des seules captures. Android, petits écrans et thèmes sombres restent à comparer visuellement. Le blocage serveur de connexion inactive sans session reste décrit dans l’audit existant.
