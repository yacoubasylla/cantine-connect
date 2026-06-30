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
