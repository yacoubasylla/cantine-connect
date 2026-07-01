# DECISION-LOG.md — Registre des Décisions Architecturales (Cantine Connect)

> Ce registre liste les choix technologiques et méthodologiques structurants arbitrés sur le projet.
> Chaque décision majeure dispose d'un ADR détaillé dans `collaboration/history/adr/`.

---

### ADR-001 · Choix de la Stack Technique Front-end (React + Vite + MUI)
- **Statut** : Accepté — 2026-06-20
- **Décision** : React.js 18 propulsé par Vite, avec Material UI v9 comme design system unique.
- **Contexte** : Interface web hautement responsive pour agents sur site (écrans compacts 15 pouces). Interdiction de CSS externe — uniquement `sx={{ }}` MUI.
- **Alternatives rejetées** : Next.js (SSR inutile pour un dashboard SPA interne), Tailwind CSS (non cohérent avec le design system MUI).
- **Fichier ADR** : `adr/2026-06-30-stack-technique-frontend.md`

---

### ADR-002 · Formulaire Élèves en 3 Onglets MUI (Contrainte Ergonomique)
- **Statut** : Accepté — 2026-06-30
- **Décision** : Composant `Tabs`/`TabPanel` MUI divisant les champs en 3 volets : Général / Cantine+Affectation / Contacts+Allergies.
- **Contexte** : Contrainte explicite du cahier des charges — zéro scroll vertical sur les formulaires. Les gestionnaires saisissent jusqu'à 50 élèves par session sur des moniteurs 15 pouces.
- **Conséquences** : La validation doit indiquer l'onglet concerné par l'erreur (feedback UX obligatoire).

---

### ADR-003 · Traçabilité via Table `action_logs` Alimentée par Spring AOP
- **Statut** : Accepté — 2026-06-30 | Implémentation prévue : B-05
- **Décision** : Aspect Spring AOP (`@Around`) sur les méthodes de service annotées, alimentant la table `action_logs` de façon asynchrone.
- **Contexte** : Exigence de conformité du cahier des charges. Toute opération d'écriture (CREATE/UPDATE/DELETE) doit être tracée avec auteur, horodatage et payload avant/après.
- **Alternative rejetée** : Logging fichiers — non structuré, non interrogeable SQL.
- **Fichier ADR** : À créer lors de l'implémentation de B-05.

---

### ADR-004 · Authentification JWT Stateless (Spring Security 6 + jjwt 0.12.3)
- **Statut** : Accepté — 2026-06-30
- **Décision** : JWT stateless HMAC-SHA512 via en-tête `Authorization: Bearer`. Pas de session HTTP serveur.
- **Contexte** : Architecture multi-établissements avec potentiel scaling horizontal. Les sessions serveur compliqueraient le déploiement multi-instances.
- **Alternative rejetée** : Sessions HTTP cookies — incompatibles avec le scaling horizontal et l'architecture mobile-first.
- **Fichier ADR** : `adr/2026-06-30-jwt-stateless-authentication.md`

---

### ADR-005 · Extraction PasswordEncoder dans PasswordEncoderConfig (Anti-Circular-Dependency)
- **Statut** : Accepté — 2026-06-30
- **Décision** : Bean `PasswordEncoder` dans une classe `PasswordEncoderConfig.java` indépendante, sans dépendances Spring Security.
- **Contexte** : Dépendance circulaire au démarrage — `SecurityConfig` → `JwtAuthFilter` → `AuthService` → `PasswordEncoder` ← `SecurityConfig`. Spring Boot refuse de démarrer.
- **Alternative rejetée** : `@Lazy` sur le bean — masque le problème sans le résoudre proprement.
- **Fichier ADR** : `adr/2026-06-30-resolution-dependance-circulaire.md`

---

### ADR-006 · Port 8081 pour Spring Boot (Conflit Port 8080)
- **Statut** : Accepté — 2026-06-30
- **Décision** : Spring Boot écoute sur le port `8081` en développement local.
- **Contexte** : Port 8080 occupé sur la machine de développement de M. Sylla. La configuration est dans `application.yml` (`server.port: 8081`).
- **Impact** : Le client Axios pointe sur `http://localhost:8081/api/v1`. À documenter dans le README de l'équipe.

---

### ADR-007 · Requête Native PostgreSQL pour Bug Hibernate 6 + JPQL Nullable
- **Statut** : Accepté — 2026-06-30
- **Décision** : `@Query(value="...", nativeQuery=true)` avec `CAST(:param AS varchar)` pour les filtres optionnels (nullables) de la liste des élèves.
- **Contexte** : Hibernate 6 + driver PostgreSQL échouent à inférer le type SQL d'un paramètre JPQL `null`, générant l'erreur `operator does not exist: lower(bytea)`. Bug connu Hibernate 6.
- **Alternative rejetée** : Specification API JPA — overhead architectural disproportionné pour 3-4 filtres simples.

---

### ADR-008 · Stratégie de Déploiement Production : Vercel (Frontend) + Railway (Backend)
- **Statut** : Accepté — 2026-07-01
- **Décision** : Déploiement découplé — frontend React/Vite sur Vercel, backend Spring Boot + PostgreSQL sur Railway.
- **Contexte** : Architecture SPA (Single Page App) + API REST. Vercel est optimisé pour les assets statiques avec CDN global. Railway simplifie le déploiement Docker + base de données managée sans gestion d'infrastructure.
- **Configurations clés** :
  - `client-frontend/vercel.json` — rewrites `/(.*) → /index.html` pour React Router
  - `server-backend/Dockerfile` — multi-stage `eclipse-temurin:17-jdk-alpine` → `eclipse-temurin:17-jre-alpine`
  - `server-backend/railway.toml` — `healthcheckPath: /actuator/health`, `healthcheckTimeout: 120`
  - `server.port: ${PORT:8081}` — Railway injecte `$PORT` dynamiquement
- **Alternatives rejetées** : Render.com (cold start 30s sur tier gratuit), Fly.io (complexité réseau VPN), Heroku (coût).
- **Fichier ADR** : `adr/2026-07-01-strategie-deploiement-production.md`

---

### ADR-010 · JPA Specifications (Criteria API) pour les Filtres Dynamiques Multi-Critères
- **Statut** : Accepté — 2026-07-01 (révision ADR-007)
- **Décision** : Utiliser `JpaSpecificationExecutor` + classe `PassageSpecification` (Criteria API) pour la requête de l'historique des passages, au lieu d'un `@Query` JPQL avec paramètres optionnels.
- **Contexte** : ADR-007 avait rejeté les Specifications "overhead disproportionné pour 3-4 filtres simples". Ce jugement s'appliquait aux élèves (4 filtres, requête native possible). Pour les passages, le JPQL avec `(:param IS NULL OR ...)` a généré des 500 persistants en production : Hibernate 6 ne résout pas fiablement les types null pour les enums (`ResultatScan`) et les combinaisons LIKE+OR dans le pattern `(:search IS NULL OR LOWER(e.nom) LIKE ...)`. Deux versions corrigées ont échoué successivement (double ORDER BY, JOIN FETCH pagination). La Criteria API, elle, ajoute chaque prédicat conditionnellement en Java — Hibernate ne reçoit jamais de paramètre null ambigu.
- **Règle résultante** : Utiliser `@Query` JPQL pour les requêtes à paramètres fixes ou peu optionnels. Utiliser `JpaSpecificationExecutor` + Specification dès qu'une requête a ≥ 3 filtres optionnels ou implique des enums/types complexes nullables.
- **Conséquences** : `PassageRefectoireRepository` étend `JpaSpecificationExecutor<PassageRefectoire>`. Le sort Pageable est résolu nativement sans conflit ORDER BY. Performance identique — le SQL généré par Criteria est équivalent au JPQL corrigé.

---

### ADR-009 · Construction Manuelle de l'URL JDBC sur Railway (Incompatibilité DATABASE_URL)
- **Statut** : Accepté — 2026-07-01
- **Décision** : Construire `SPRING_DATASOURCE_URL` manuellement via les variables atomiques du plugin PostgreSQL Railway : `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`
- **Contexte** : Railway fournit `${{Postgres.DATABASE_URL}}` au format `postgresql://...` (standard PostgreSQL). Spring Boot / HikariCP exige le format JDBC : `jdbc:postgresql://...`. L'erreur `IllegalArgumentException: URL must start with 'jdbc'` se produit au démarrage si on utilise `DATABASE_URL` directement. Railway ne fournit pas de variable `JDBC_URL` prête à l'emploi.
- **Conséquence** : `SPRING_DATASOURCE_USERNAME` = `${{Postgres.PGUSER}}` et `SPRING_DATASOURCE_PASSWORD` = `${{Postgres.PGPASSWORD}}` doivent être définis séparément.

---

### ADR-011 · RBAC Serveur pour le Rôle PARENT (Périmètre Restreint aux Enfants)
- **Statut** : Accepté — 2026-07-01
- **Décision** : Restriction appliquée côté serveur (pas seulement UI) — `EleveController`, `EtablissementController` et `ScanController.scanner()`/`.cache()` bloqués pour PARENT (`@PreAuthorize("!hasRole('PARENT')")`) ; `PaiementService` et `ScanService.listerPassages` filtrent/rejettent selon les enfants réels du parent (`ParentRepository.findEnfantIdsByUtilisateurId()`).
- **Contexte** : Sans restriction serveur, un compte PARENT authentifié pouvait interroger les données de tous les élèves, pas seulement les siens — fuite de données personnelles entre familles.
- **Alternative rejetée** : Filtrage uniquement côté frontend (masquage de menus) — aucune garantie de sécurité réelle face à un appel API direct.
- **Fichier ADR** : `adr/2026-07-01-rbac-parent-restriction-serveur.md`

---

### ADR-012 · Migrations Flyway comme Source Unique des Comptes de Seed
- **Statut** : Accepté — 2026-07-01
- **Décision** : Suppression de `DataInitializer.java` (ApplicationRunner). Les comptes de seed (un par rôle) sont désormais définis exclusivement par la migration `V6__reset_comptes_un_par_role.sql`.
- **Contexte** : Le champ `telephone` obligatoire/unique (V5) et la demande de réinitialisation des comptes (un par rôle) rendaient `DataInitializer` incompatible (pas de téléphone renseigné) et son garde-fou `count()==0` définitivement mort une fois V6 appliquée.
- **Alternative rejetée** : Mettre à jour `DataInitializer` en parallèle de la migration — risque de divergence silencieuse entre deux mécanismes de seed pour un code qui ne s'exécuterait de toute façon plus jamais.
- **Fichier ADR** : `adr/2026-07-01-migrations-source-unique-comptes-seed.md`

---

### ADR-013 · Incident Production — Récidive du Bug JPQL Nullable + LIKE (ADR-007) sur Paiements/Utilisateurs
- **Statut** : Accepté — 2026-07-01
- **Décision** : Conversion des requêtes de recherche `UtilisateurRepository`/`TransactionPaiementRepository` en `@Query(nativeQuery = true)` + `CAST(:param AS ...)`, comme déjà établi par l'ADR-007. Correction en cascade de `statsAcceptesPeriode` (`Object[]` → `List<Object[]>`, `ClassCastException` dans `DashboardService`) et d'un double `ORDER BY` introduit par le `Sort` du `Pageable` sur les nouvelles requêtes natives. `GlobalExceptionHandler.handleGeneric` journalise désormais la stack trace complète.
- **Contexte** : Les endpoints `GET /api/v1/utilisateurs`, `GET /api/v1/paiements` et `GET /api/v1/dashboard/stats` renvoyaient 500 en production — écran Utilisateurs vide alors que les 4 comptes de la V6 existaient réellement en base. La règle de l'ADR-007 (CAST explicite pour paramètre JPQL nullable) n'avait pas été appliquée aux nouvelles requêtes de recherche ajoutées dans la session précédente.
- **Leçon retenue** : tout test manuel d'un endpoint de recherche doit couvrir explicitement le cas sans filtre (`search=null`), pas seulement le cas filtré — c'est le chemin le plus emprunté et celui qui a échappé à la vérification précédente.
- **Fichier ADR** : `adr/2026-07-01-incident-jpql-null-bytea-paiements-utilisateurs.md`
