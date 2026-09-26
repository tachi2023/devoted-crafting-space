# Portfolio professionnel d’Ivana Tamno

## Résultat visé
Construire un portfolio lunaire bilingue visuellement sobre et remarquable, centré sur les réalisations, avec une administration sécurisée réservée à `ivanatamno@gmail.com`. Les informations non fournies resteront explicitement absentes ou désactivées.

## Expérience publique
- Créer une page d’accueil mobile-first avec navigation fixe, introduction lunaire animée, présentation, compétences, processus, formation, langues, documents et contact.
- Présenter les trois projets fournis dans une galerie éditoriale, avec illustrations conceptuelles identifiées comme telles et pages détaillées dédiées.
- Ajouter un mode clair et sombre mémorisé, une navigation mobile, des animations discrètes et un respect complet de la réduction des mouvements.
- Afficher les CV et lettre de motivation comme « bientôt disponibles » jusqu’à leur ajout réel.
- Relier email, téléphone, GitHub et LinkedIn sans inventer d’autres coordonnées, chiffres ou résultats.

## Administration et données
- Mettre en place la connexion sécurisée par email et mot de passe.
- Réserver les droits d’administration au compte `ivanatamno@gmail.com` via un rôle vérifié côté serveur.
- Créer un tableau de bord protégé pour gérer les projets, leur publication, leur ordre, leur mise en avant et leurs images.
- Permettre le remplacement du CV et de la lettre, avec fichiers persistants et dernière date de mise à jour.
- Rendre les informations principales, compétences et coordonnées modifiables sans toucher au code.
- Conserver les trois projets initiaux et le contenu fourni dans la base dès la mise en service.

## Contact
- Ajouter un formulaire fonctionnel avec validation, champ anti-robot invisible et limitation anti-spam.
- Enregistrer les demandes de contact de façon privée dans l’administration, sans exposer les messages au public.

## Qualité et visibilité
- Ajouter les titres, descriptions et données de partage propres à chaque page.
- Fournir un plan du site, un fichier robots et une page 404 cohérente avec le thème lunaire.
- Optimiser les images, le chargement et les interactions clavier.
- Vérifier les parcours publics et administrateur sur smartphone et ordinateur, ainsi que les deux thèmes.

## Détails techniques
- Utiliser Lovable Cloud pour la base, l’authentification et le stockage persistant.
- Appliquer des règles d’accès strictes : lecture publique uniquement pour le contenu publié, écriture réservée au rôle administrateur, messages privés.
- Utiliser les routes et fonctions serveur natives du projet ; aucune clé privée ne sera exposée au navigateur.
- Générer des illustrations conceptuelles légères pour les projets, puis permettre leur remplacement depuis l’administration.

## Limites assumées
- Aucun faux CV ni lettre ne sera généré : les boutons seront inactifs jusqu’au téléversement des vrais PDF.
- Aucun lien GitHub ou démo propre à un projet ne sera inventé.
- L’envoi d’email sortant n’est pas supposé : les messages seront conservés dans l’administration.
