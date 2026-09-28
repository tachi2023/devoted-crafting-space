**Administration — Configuration Supabase**

Ce document décrit les étapes nécessaires pour finaliser et vérifier la partie `Administration` du portfolio.

- Variables d'environnement (à définir sur l'environnement de déploiement et localement):
  - `VITE_SUPABASE_URL` ou `SUPABASE_URL` → URL du projet Supabase
  - `VITE_SUPABASE_PUBLISHABLE_KEY` ou `SUPABASE_PUBLISHABLE_KEY` → clé publishable
  - (optionnel) `SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PROJECT_ID`

- Migrations et fonctions SQL importantes (déjà présentes sous `drizzle/migrations`):
  - `claim_portfolio_admin()` : RPC qui donne le rôle `admin` à l'utilisateur authentifié si son email est `ivanatamno@gmail.com`.
  - `has_role(user_id, role)` : utilitaire pour vérifier les rôles.
  - Politiques RLS pour `projects`, `documents`, `contact_messages` et `storage.objects` (bucket `portfolio-files`).

- Étapes pour préparer l'administration:
  1. Appliquer les migrations sur la base Supabase (via `drizzle-kit` ou le runner SQL de Supabase). Exemple (si `drizzle-kit` configuré) :

```bash
npx drizzle-kit push --migration-folder ./drizzle/migrations
```

2. Vérifier que le bucket `portfolio-files` existe dans Supabase Storage et que les politiques RLS sont en place.

3. Configurer les variables d'environnement sur l'hôte (Lovable / Vercel / Netlify / serveur) en copiant les valeurs depuis le panneau Supabase.

4. Se connecter via l'UI d'administration (`/auth`) avec l'email `ivanatamno@gmail.com` puis se connecter. Le code appelle `claim_portfolio_admin()` après connexion pour s'ajouter le rôle `admin`.

5. Si l'email d'administration doit changer, soit modifier la fonction SQL `claim_portfolio_admin()` dans les migrations, soit attribuer manuellement un rôle `admin` dans la table `public.user_roles`.

- Tests rapides:
  - Visiteur public: vérifier que la page publique charge (`/`) et que `projects` visibles sont ceux `published = true`.
  - Inscription/connexion admin: aller sur `/auth`, se connecter avec l'email admin, puis vérifier l'accès à `/_authenticated/admin`.

- Points d'attention et recommandations:
  - La fonction `claim_portfolio_admin()` accorde le rôle basé sur l'email contenu dans le JWT — assurez-vous que le fournisseur d'auth renvoie bien l'email exact.
  - Pour la production, protégez la clé `service_role` (ne pas la mettre côté client). Les actions serveur doivent utiliser `service_role` côté backend.
  - Vérifier les quotas et permissions du bucket `portfolio-files` (taille max, types autorisés).

Si tu veux, j'applique une petite validation côté UI (messages d'erreur plus explicites) et je pousse ces modifications.
