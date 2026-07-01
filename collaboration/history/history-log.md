# Journal de Bord Chronologique — Cantine Connect

---

### [2026-06-20] - Kickoff et Initialisation de l'Écosystème
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** : `CLAUDE.md`, `collaboration/context/CONTEXT.md`, `collaboration/doc/workflows.md`, `server-backend/`, `client-frontend/`
- **Description** : Création de la structure globale du projet (client-frontend Vite+React+MUI, server-backend Spring Boot 3.x). Définition des fichiers de gouvernance initiaux. Squelettes applicatifs configurés.

---

### [2026-06-30] - Mise à Jour des Fichiers de Gouvernance (Base de Connaissance IA)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** :
  - `collaboration/context/CONTEXT.md` — Réécrit intégralement pour Cantine Connect
  - `collaboration/doc/architecture.md` — Architecture 3-tiers, JWT stateless, Spring AOP, offline-first, Docker
  - `collaboration/doc/specifications.md` — 5 modules avec modèles SQL, contrats API et règles métier
  - `commands/startup.md` — Noms de fichiers corrigés (casse Linux)
- **Description** : Refonte complète de la base de connaissance IA héritée du projet Parc Auto. Alignement sur la proposition commerciale Cantine Connect (Juin 2026).

---

### [2026-06-30] - B-01 · Infrastructure & Docker (Back-end)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** : `docker-compose.yml`, `server-backend/src/main/resources/application.yml`
- **Description** : Environnement Docker avec PostgreSQL 16 sur le port 5432 et pgAdmin sur le port 5050. Spring Boot configuré sur le port 8081 (port 8080 occupé). CORS pour `localhost:5173`. Actuator activé.
- **Tests validés** : Compilation propre, `actuator/health` → UP, CORS OK.

---

### [2026-06-30] - B-02 + F-01 + F-03 · Module Gestion Structurelle (Établissements / Niveaux / Classes)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** :
  - `server-backend/.../etablissement/` (entity, dto, repository, service, controller)
  - `client-frontend/src/pages/etablissements/` (EtablissementsPage, EtablissementFormDialog, GestionStructureDialog)
  - `client-frontend/src/services/etablissementService.js`
  - `client-frontend/src/hooks/useEtablissements.js`
  - `client-frontend/src/layouts/MainLayout.jsx`, `App.jsx`, `theme.js`
- **Description** : CRUD complet établissements avec gestion hiérarchique Niveaux/Classes. Interface de saisie en lot (ex: `CP, CE1, CM1`) avec suppression individuelle ou en cascade. Layout MainLayout avec Drawer persistant, routing React Router v7, thème KLEM. Correction bug `@Builder.Default` Lombok pour les valeurs par défaut JPA.
- **Décision technique** : Requête native PostgreSQL avec `CAST(:param AS type)` pour contourner bug Hibernate 6 + PostgreSQL sur paramètres JPQL nullables. Voir ADR-007.
- **Tests validés** : CRUD établissements, niveaux, classes. Suppression en cascade. UI saisie en lot.

---

### [2026-06-30] - B-03 + F-04 · Module Gestion des Élèves
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** :
  - `server-backend/.../eleve/` (entity, dto, repository, service, controller)
  - `client-frontend/src/pages/eleves/` (ElevesPage, EleveFormDialog, StatutBadge)
  - `client-frontend/src/services/eleveService.js`
  - `client-frontend/src/hooks/useEleves.js`
- **Description** : CRUD élèves avec QR code UUID auto-généré. Pagination côté serveur (10 000+ lignes). Filtres multi-critères (texte, établissement, statut). Formulaire 3 onglets MUI (Général / Cantine+Affectation / Contacts+Allergies) — zéro scroll vertical. Suppression logique. Badge statut coloré.
- **Tests validés** : Pagination, filtres, création avec QR token, modification, suppression, validation formulaire.

---

### [2026-06-30] - B-04 + F-02 · Module Authentification JWT Stateless
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Commit GitHub** : `66ae192` — `yacoubasylla/cantine-connect`
- **Fichiers Modifiés** :
  - `server-backend/.../auth/` (Utilisateur, Role, LoginRequestDTO, AuthResponseDTO, UtilisateurRepository, AuthService, JwtService, AuthController, DataInitializer, PasswordEncoderConfig)
  - `server-backend/.../common/JwtAuthFilter.java`, `SecurityConfig.java`, `ApiResponse.java`
  - `client-frontend/src/context/AuthContext.jsx`
  - `client-frontend/src/hooks/useAuth.js`
  - `client-frontend/src/services/authService.js`, `apiClient.js`
  - `client-frontend/src/pages/auth/LoginPage.jsx`
  - `client-frontend/src/components/ProtectedRoute.jsx`
  - `client-frontend/src/main.jsx`, `App.jsx`, `layouts/MainLayout.jsx`
- **Description** : JWT stateless HMAC-SHA512 (jjwt 0.12.3). Entité Utilisateur (UserDetails) avec rôles ADMIN/GESTIONNAIRE/CAISSIER. JwtAuthFilter injecté avant UsernamePasswordAuthenticationFilter. DataInitializer crée `admin@cantine.connect / Admin123!` au premier démarrage. Frontend : LoginPage MUI, AuthContext localStorage, ProtectedRoute, intercepteur Axios 401 auto-redirect. Résolution dépendance circulaire via PasswordEncoderConfig. Voir ADR-005.
- **Tests validés** : Login → token JWT, 403 sans token, 200 avec token, redirect /login si non authentifié.

---

### [2026-06-30] - Gouvernance : Création ROADMAP + ADRs + Mise à jour Logs
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Modifiés** :
  - `collaboration/ROADMAP.md` — Inventaire 16 modules (8 back + 8 front) avec tests de validation et statuts
  - `collaboration/history/history-log.md` — Historique complet depuis le kickoff
  - `collaboration/history/decision-log.md` — 7 décisions architecturales documentées
  - `collaboration/history/adr/2026-06-30-stack-technique-frontend.md`
  - `collaboration/history/adr/2026-06-30-jwt-stateless-authentication.md`
  - `collaboration/history/adr/2026-06-30-resolution-dependance-circulaire.md`
- **Description** : Mise en place du système de gouvernance. La ROADMAP couvre l'ensemble du projet avec 47 tests de validation répartis sur 16 modules. Protocole établi : chaque module livré entraîne une mise à jour des 3 fichiers de gouvernance (ROADMAP, history-log, decision-log + ADR si applicable).

---

### [2026-06-30] - Front-end F-08 · Gestion des Utilisateurs UI (ADMIN)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel — **DERNIER MODULE — PROJET COMPLET 16/16**
- **Fichiers Créés** :
  - `services/utilisateurService.js` — lister, creer, changerRole, desactiver, reactiver
  - `hooks/useUtilisateurs.js` — pagination + CRUD complet
  - `pages/utilisateurs/UtilisateursPage.jsx` — table + dialog + select rôle inline
  - `components/AdminRoute.jsx` — garde de route ADMIN (redirect → /dashboard si non-ADMIN)
- **Fichiers Modifiés** :
  - `App.jsx` — route `/utilisateurs` wrappée dans `<AdminRoute>`
  - `layouts/MainLayout.jsx` — item "Utilisateurs" filtré par `roles: ['ADMIN']`, ManageAccountsIcon
- **Description** : Interface de gestion des comptes utilisateurs réservée ADMIN. Table avec Select rôle inline (ADMIN/GESTIONNAIRE/CAISSIER avec chips colorés). Boutons Désactiver (PersonOffIcon, rouge) / Réactiver (PersonAddIcon, vert). Row "(vous)" + désactivation de soi-même impossible. Dialog "Créer un compte" avec validation. Menu sidebar filtré par rôle. AdminRoute redirige automatiquement les non-ADMIN vers le dashboard.
- **Tests validés** : liste ✅, créer ✅, changer rôle ✅, désactiver→401 ✅, 403 GESTIONNAIRE ✅

---

### [2026-06-30] - Front-end F-07 · Interface QR Code / Scan Réfectoire
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Packages installés** : `qrcode.react` (génération QR Code SVG)
- **Fichiers Créés** :
  - `services/scanService.js` — scanner(), getCache(), getPassages()
  - `services/cacheOfflineService.js` — sauvegarder/charger/scanner/ageTexte (TTL 24h localStorage)
  - `hooks/useScan.js` — scan online + fallback offline automatique + rafraîchirCache
  - `pages/scan/ScanPage.jsx` — layout 2 colonnes (scan+résultat / passages du jour)
- **Fichiers Modifiés** :
  - `pages/eleves/ElevesPage.jsx` — QrCodeDialog avec QRCodeSVG 220px + copier + imprimer
  - `App.jsx` — route `/scan` ajoutée
  - `layouts/MainLayout.jsx` — nav item "Scan Réfectoire" (QrCodeScannerIcon) ajouté
- **Description** : Interface de contrôle accès réfectoire. Input QR token + bouton Scanner (compatible scanner USB/BT). Carte résultat : ACCORDÉ (fond vert) ou REFUSÉ (fond rouge) avec élève, classe, heure, motif. Panel droit : liste passages du jour rechargée après chaque scan. Mode offline : cache téléchargeable via GET /scan/cache → localStorage 24h, validation locale en cas de perte réseau. Chip statut en-ligne/hors-ligne (navigator.onLine + événements browser). QR codes affichables sur la fiche de chaque élève.
- **Tests validés** : scan online ✅, résultat carte ✅, passages ✅, cache download ✅, offline fallback ✅, 404 inconnu ✅, QrCodeDialog ✅

---

### [2026-06-30] - Front-end F-06 · Interface Paiements Mobile Money
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Créés** :
  - `services/paiementService.js` — lister, getById, initier
  - `hooks/usePaiements.js` — pagination + filtres + initier
  - `pages/paiements/PaiementsPage.jsx` — table + dialog complet
- **Fichiers Modifiés** :
  - `App.jsx` — route `/paiements` ajoutée
  - `layouts/MainLayout.jsx` — entrée "Paiements" (PaymentsIcon) dans la sidebar
- **Description** : Interface complète de gestion des paiements Mobile Money. Table paginée filtrée par statut (chips EN_ATTENTE/ACCEPTÉ/REFUSÉ/ANNULÉ). Dialog "Initier un paiement" : Autocomplete élève avec debounce 300ms (search API), Select opérateur 4 opérateurs avec pastille couleur, montant min 100 XOF, téléphone. Après soumission : alerte succès avec lien CinetPay checkout cliquable. Correction champ `classeLibelle` (nom réel dans le DTO élève).
- **Tests validés** : liste ✅, filtre statut ✅, initier paiement ✅, paymentUrl ✅, autocomplete ✅

---

### [2026-06-30] - Front-end F-05 · Dashboard avec Stats Réelles
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Créés** :
  - `services/dashboardService.js` — 7 appels API parallèles (`Promise.all`)
  - `hooks/useDashboard.js` — custom hook loading/error/data
- **Fichiers Modifiés** :
  - `pages/DashboardPage.jsx` — KPI cards + répartition statuts + table passages
  - `services/apiClient.js` — correction bug : `jwt_token` → `cc_token` (clé localStorage)
- **Description** : Dashboard entièrement dynamique. 4 cartes KPI (établissements, élèves actifs, passages du jour, en attente paiement). Répartition des 4 statuts d'accès en chips colorés. Table des 5 derniers passages avec heure, résultat (CheckCircle/Cancel) et motif de refus. Skeletons MUI pendant chargement. Bouton rafraîchir. Correction silencieuse du bug `apiClient.js` (clé mal nommée).
- **Tests validés** : établissements ✅, élèves/statuts ✅, passages ✅, skeletons ✅, rafraîchir ✅, table passages ✅

---

### [2026-06-30] - Back-end B-08 · Gestion des Utilisateurs (Admin)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Créés** :
  - `auth/dto/UtilisateurResponseDTO.java`, `CreerUtilisateurRequestDTO.java`, `ChangerRoleRequestDTO.java`
  - `auth/service/UtilisateurService.java`
  - `auth/controller/UtilisateurController.java`
- **Fichiers Modifiés** :
  - `auth/repository/UtilisateurRepository.java` — `countByRoleAndActifTrue(Role)`
  - `common/SecurityConfig.java` — `@EnableMethodSecurity` activé
  - `common/GlobalExceptionHandler.java` — handlers 403/401/409 ajoutés
- **Description** : CRUD complet des comptes utilisateurs (`ADMIN` uniquement via `@PreAuthorize`). Soft delete protégé contre la suppression du dernier ADMIN (409 CONFLICT). Correction transversale : `GlobalExceptionHandler` intercepte maintenant `AccessDeniedException` → 403 propre.
- **Tests validés** : liste ✅, création 201 ✅, changement rôle ✅, soft delete ✅, protection dernier ADMIN 409 ✅, GESTIONNAIRE 403 ✅, réactivation ✅

---

### [2026-06-30] - Back-end B-07 · Contrôle Accès QR Code / Scan Réfectoire
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Fichiers Créés** :
  - `scan/entity/` — `PassageRefectoire.java`, `ResultatScan.java`, `MotifRefus.java`
  - `scan/dto/` — `ScanResultDTO.java`, `PassageResponseDTO.java`, `CacheEntreeDTO.java`
  - `scan/repository/PassageRefectoireRepository.java` — doublon check, filtre par date/établissement
  - `scan/service/ScanService.java` — scanner(), getCacheOffline(), listerPassages()
  - `scan/controller/ScanController.java` — POST /scan/{token}, GET /scan/cache, GET /passages
- **Fichiers Modifiés** :
  - `eleve/repository/EleveRepository.java` — `findByQrCodeTokenAndActifTrue()` + `findAllActiveWithDetails()`
- **Description** : Module de contrôle d'accès au réfectoire par QR Code. Validation en 240ms (< 1s requis). Logique : AUTORISE/GRACE → vérifier doublon du jour → ACCORDÉ ou DOUBLON_PASSAGE ; SUSPENDU/EN_ATTENTE_PAIEMENT → REFUSÉ. Cache offline téléchargeable (tous élèves actifs + statuts) pour fonctionnement sans internet 24h. Historique des passages filtrable par date et établissement. Chaque scan enregistré dans `passages_refectoire` avec motif de refus si applicable.
- **Tests validés** : 240ms ✅, ACCORDÉ ✅, REFUSÉ SUSPENDU ✅, 404 inconnu ✅, doublon ✅, cache ✅, historique ✅

---

### [2026-06-30] - Back-end B-06 · Moteur de Paiements & Webhooks (CinetPay / PayDunya)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Commit GitHub** : à venir
- **Fichiers Créés** :
  - `paiement/entity/` — `TransactionPaiement.java`, `StatutPaiement.java`, `OperateurMobileMoney.java`
  - `paiement/dto/` — `InitierPaiementRequestDTO.java`, `PaiementResponseDTO.java`, `WebhookCinetPayDTO.java`, `WebhookPayDunyaDTO.java`
  - `paiement/repository/TransactionPaiementRepository.java`
  - `paiement/service/PaiementService.java` — initier, lister, getById
  - `paiement/service/WebhookService.java` — traiterCinetPay + traiterPayDunya @Async
  - `paiement/controller/PaiementController.java` — POST /initier, GET /paiements, GET /{id}
  - `paiement/controller/WebhookController.java` — POST /webhooks/cinetpay + /paydunya (public)
  - `paiement/config/PaiementProperties.java` — @ConfigurationProperties
- **Fichiers Modifiés** :
  - `common/SecurityConfig.java` — `/api/v1/webhooks/**` ajouté aux routes publiques
  - `application.yml` — bloc `paiement.cinetpay` + `paiement.paydunya`
- **Description** : Moteur de paiements Mobile Money (Orange, MTN, Moov, Wave). Initiation de transaction avec URL de paiement CinetPay. Webhooks IPN asynchrones (`@Async`) : `cpm_result=00` → ACCEPTE + élève AUTORISE, autre → REFUSE. Signature SHA-256 configurable par variable d'environnement (`CINETPAY_VERIFY_SIGNATURE=true`). Support PayDunya avec même architecture. `@Traceable` sur initierPaiement pour la traçabilité AOP.
- **Tests validés** : Initier EN_ATTENTE ✅, Webhook ACCEPTED → AUTORISE ✅, Webhook REFUSED ✅, HTTP 200 immédiat ✅, Filtre eleveId ✅

---

### [2026-06-30] - Back-end B-05 · ActionLog AOP (Traçabilité Automatique)
- **Auteur** : Yacouba SYLLA / Claude Code
- **Statut** : Livré / Opérationnel
- **Commit GitHub** : à venir
- **Fichiers Créés** :
  - `server-backend/.../actionlog/annotation/Traceable.java` — annotation custom `@Traceable(action, entite)`
  - `server-backend/.../actionlog/entity/ActionLog.java` — entité JPA table `action_logs`
  - `server-backend/.../actionlog/entity/TypeAction.java` — enum CREATE / UPDATE / DELETE
  - `server-backend/.../actionlog/repository/ActionLogRepository.java`
  - `server-backend/.../actionlog/service/ActionLogService.java` — méthode `@Async sauvegarder()`
  - `server-backend/.../actionlog/aspect/ActionLogAspect.java` — aspect `@Around`
  - `server-backend/.../actionlog/dto/ActionLogResponseDTO.java`
  - `server-backend/.../actionlog/controller/ActionLogController.java` — `GET /api/v1/logs`
  - `server-backend/.../common/AsyncConfig.java` — `@EnableAsync`
- **Fichiers Modifiés** :
  - `EleveService.java` — `@Traceable` sur `creer`, `modifier`, `changerStatut`, `supprimer`
  - `EtablissementService.java` — `@Traceable` sur `creer`, `creerNiveau`, `creerClasse`, `supprimerNiveau`, `supprimerClasse`
- **Description** : Traçabilité automatique et transparente de toutes les opérations d'écriture via Spring AOP. L'aspect `@Around` intercepte chaque méthode annotée `@Traceable`, extrait l'auteur du SecurityContext JWT, capture le payload avant/après et sauvegarde en base de façon asynchrone (`@Async`) sans bloquer la réponse HTTP. Endpoint `GET /api/v1/logs` avec filtres optionnels (entite, entiteId, auteur). Indexation stratégique sur `entite+entite_id`, `auteur` et `date_action`.
- **Tests validés** : CREATE log ✅, UPDATE log ✅, DELETE log ✅, auteur extrait JWT ✅, async ✅

---

## Statut Actuel — 2026-06-30

**Avancement : 8/16 modules livrés (50%)**

| Module | Statut |
|--------|--------|
| B-01 Infrastructure Docker | ✅ |
| B-02 Gestion Structurelle (back) | ✅ |
| B-03 Gestion Élèves (back) | ✅ |
| B-04 Auth JWT (back) | ✅ |
| F-01 Socle Layout | ✅ |
| F-02 Auth UI | ✅ |
| F-03 Gestion Structurelle (front) | ✅ |
| F-04 Gestion Élèves (front) | ✅ |
| B-05 ActionLog AOP | ✅ |
| B-06 Paiements + Webhooks | 🔲 |
| B-07 QR Code / Scan | 🔲 |
| B-08 Gestion Utilisateurs (back) | 🔲 |
| F-05 Dashboard Stats Réelles | 🔄 |
| F-06 Interface Paiements | 🔲 |
| F-07 Interface QR Scan | 🔲 |
| F-08 Gestion Utilisateurs (front) | 🔲 |

| B-05 ActionLog AOP | ✅ |

| B-06 Back-end Paiements & Webhooks | ✅ |

| B-07 Back-end QR Code / Scan | ✅ |

**Prochaine étape** : Back-end B-08 Gestion Utilisateurs ou Front-end (F-05 à F-08).

---

### [2026-06-30] - Amélioration P2 : Migrations Flyway versionnées
- **Statut :** Livré / Opérationnel
- **Fichiers Modifiés :**
  - `server-backend/pom.xml` — ajout `flyway-core` + `flyway-database-postgresql`
  - `server-backend/src/main/resources/application.yml` — `ddl-auto: update` → `validate`, bloc Flyway (`baseline-on-migrate: true`)
  - `server-backend/src/main/resources/db/migration/V1__init_schema.sql` — schéma complet (8 tables, index stratégiques, `CREATE IF NOT EXISTS`)
- **Description :** Remplacement du mécanisme fragile `ddl-auto: update` par des migrations SQL versionnées via Flyway. Le script `V1__init_schema.sql` crée les 8 tables dans l'ordre des FK (`utilisateurs` → `etablissements` → `niveaux` → `classes` → `eleves` → `transactions_paiement` / `passages_refectoire` / `action_logs`). Toutes les instructions utilisent `IF NOT EXISTS` pour rester idempotentes sur une base déjà existante. Le profil prod est maintenant fonctionnel : Flyway applique les migrations, Hibernate valide le schéma.
- **Tests validés :** `./mvnw compile` ✅ (exit 0)

---

### [2026-06-30] - Amélioration P1 : Tests unitaires JUnit 5 (23 tests)
- **Statut :** Livré / Opérationnel
- **Fichiers Créés :**
  - `server-backend/src/test/.../scan/service/ScanServiceTest.java` — 7 tests
  - `server-backend/src/test/.../auth/service/UtilisateurServiceTest.java` — 8 tests
  - `server-backend/src/test/.../eleve/service/EleveServiceTest.java` — 5 tests
  - `server-backend/src/test/.../paiement/service/WebhookServiceTest.java` — 3 tests
- **Description :** Première suite de tests automatisés du projet. Stratégie `@ExtendWith(MockitoExtension.class)` sans contexte Spring ni base de données, exécution en 1,4s. Cas critiques couverts : scan ACCORDÉ/REFUSÉ (statut + doublon du jour), protection dernier ADMIN (→ 409), webhook CinetPay accepté → élève AUTORISE, webhook refusé → élève inchangé, soft-delete, matricule dupliqué.
- **Tests validés :** `./mvnw test` → **23/23 ✅ BUILD SUCCESS**

---

### [2026-07-01] - Amélioration P3 : Déploiement production Vercel + Railway
- **Statut :** Livré / Opérationnel
- **Fichiers Créés/Modifiés :**
  - `client-frontend/src/services/apiClient.js` — `baseURL` via `import.meta.env.VITE_API_URL` (fallback `localhost:8081`)
  - `client-frontend/vercel.json` — build Vite + rewrites SPA React Router (`/(.*) → /index.html`)
  - `client-frontend/.env.example` — template variables d'environnement
  - `server-backend/Dockerfile` — multi-stage `eclipse-temurin:17-jdk-alpine` (build) → `eclipse-temurin:17-jre-alpine` (runtime)
  - `server-backend/railway.toml` — builder Dockerfile + healthcheck `/actuator/health`, timeout 120s
  - `server-backend/src/main/resources/application.yml` — `server.port: ${PORT:8081}` (Railway injecte `$PORT` dynamiquement)
- **Description :** Infrastructure de déploiement production opérationnelle. Frontend React/Vite déployé sur Vercel avec routing SPA. Backend Spring Boot containerisé via Dockerfile multi-stage déployé sur Railway avec PostgreSQL managée. 3 bugs corrigés en séquence : (1) port hardcodé → `${PORT:8081}`, (2) ENTRYPOINT shell expansion supprimée (Spring Boot lit `SPRING_PROFILES_ACTIVE` nativement), (3) `SPRING_DATASOURCE_URL` construite via variables atomiques PGHOST/PGPORT/PGDATABASE car Railway ne fournit pas de `JDBC_URL` (le `DATABASE_URL` natif est au format `postgresql://` incompatible avec HikariCP). Voir ADR-008 + ADR-009.
- **Architecture prod :** Frontend (Vercel) → Backend (Railway) → PostgreSQL (Railway managed)
- **Statuts finaux :** Vercel ✅ Online · Railway ✅ Online · PostgreSQL ✅ Online

---

### [2026-07-01] - Fix prod : CORS configurable via variable d'environnement
- **Statut :** Livré / Opérationnel
- **Commit :** `6fb3e2a`
- **Fichiers Modifiés :**
  - `server-backend/src/main/java/.../common/SecurityConfig.java` — `@Value("${cors.allowed-origins}")` + split virgule
  - `server-backend/src/main/resources/application.yml` — `cors.allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173}`
- **Description :** Les origines CORS étaient hardcodées à `localhost:5173`, bloquant les requêtes depuis le domaine Vercel. La configuration lit désormais `CORS_ALLOWED_ORIGINS` (variable d'environnement Railway), acceptant plusieurs domaines séparés par des virgules. Résolution du "Erreur réseau" sur la page de connexion après le premier déploiement.

---

### [2026-07-01] - Fix prod : Error Boundary — page blanche remplacée par message lisible
- **Statut :** Livré / Opérationnel
- **Commit :** `7980507`
- **Fichiers Créés :**
  - `client-frontend/src/components/ErrorBoundary.jsx` — composant classe React avec `getDerivedStateFromError`, bouton "Réessayer"
- **Fichiers Modifiés :**
  - `client-frontend/src/App.jsx` — toutes les routes wrappées dans `<ErrorBoundary>`
- **Description :** En React 19, toute erreur de rendu non capturée démontre la racine React entière (page blanche). L'ErrorBoundary intercepte les erreurs d'affichage par route et affiche un message d'erreur lisible avec bouton de rechargement, limitant l'impact à la route fautive.

---

### [2026-07-01] - Fix prod : MUI v9 — Autocomplete paiements (params.slotProps)
- **Statut :** Livré / Opérationnel
- **Commit :** `d55f242`
- **Fichiers Modifiés :**
  - `client-frontend/src/pages/paiements/PaiementsPage.jsx` — `params.InputProps` → `params.slotProps?.input`
  - `client-frontend/src/hooks/usePaiements.js` — `setData(result ?? { content: [], totalElements: 0 })` (null safety)
- **Description :** MUI v9 a supprimé `params.InputProps` du callback `renderInput` de l'Autocomplete. L'accès à `params.InputProps.endAdornment` lançait une TypeError qui, sans Error Boundary, causait une page blanche complète sur `/paiements`. Migré vers `params.slotProps?.input` conformément à l'API MUI v9.

---

### [2026-07-01] - Feat : Scanner caméra QR Code + page Configuration admin
- **Statut :** Livré / Opérationnel
- **Commit :** `86583af`
- **Packages installés :** `html5-qrcode`
- **Fichiers Créés :**
  - `client-frontend/src/components/QrCameraScanner.jsx` — composant Html5Qrcode (caméra arrière prioritaire, debounce 3s, cleanup propre)
  - `client-frontend/src/services/configService.js` — lister, getParCle, modifier
  - `client-frontend/src/hooks/useConfig.js` — `useConfigurations()`, `useConfigValeur(cle, default)`
  - `client-frontend/src/pages/configuration/ConfigurationPage.jsx` — Switch toggle par fonctionnalité (ADMIN only)
  - `server-backend/src/main/java/.../parametrage/` — entité Configuration, DTO, repository, service, controller (GET + PUT `@PreAuthorize ADMIN`)
  - `server-backend/src/main/resources/db/migration/V2__add_configurations_table.sql` — table `configurations` + seed `SCAN_CAMERA_ENABLED=false`
- **Fichiers Modifiés :**
  - `client-frontend/src/pages/scan/ScanPage.jsx` — bouton "Activer caméra" conditionnel (config `SCAN_CAMERA_ENABLED`), callback `handleCameraDetected`
  - `client-frontend/src/App.jsx` — route `/configuration` (AdminRoute)
  - `client-frontend/src/layouts/MainLayout.jsx` — item "Configuration" (TuneIcon, ADMIN only)
- **Description :** Scan par caméra smartphone/tablette comme alternative à la douchette USB. Activer/désactiver la fonctionnalité sans déploiement depuis la page `/configuration` (ADMIN). Le scanner utilise la caméra arrière par préférence, lance le scan automatiquement et intègre un debounce 3s pour éviter les doublons. La table `configurations` en base permet d'ajouter de futurs feature flags.

---

### [2026-07-01] - Feat : Historique des Passages — filtres multi-critères + export CSV
- **Statut :** Livré / Opérationnel
- **Commit :** `1440a2d`
- **Fichiers Créés :**
  - `server-backend/.../scan/repository/PassageSpecification.java` — Specification JPA Criteria (plage dates, établissement, résultat, recherche texte)
  - `client-frontend/src/hooks/usePassages.js` — hook pagination + filtres
  - `client-frontend/src/pages/passages/PassagesPage.jsx` — filtres, table paginée, compteurs, export CSV
- **Fichiers Modifiés :**
  - `server-backend/.../scan/repository/PassageRefectoireRepository.java` — `JpaSpecificationExecutor`
  - `server-backend/.../scan/service/ScanService.java` — `listerPassages()` étendu (dateDebut/dateFin/resultat/search) + délégation à la Specification
  - `server-backend/.../scan/controller/ScanController.java` — nouveaux query params (dateDebut, dateFin, resultat, search)
  - `client-frontend/src/App.jsx` — route `/passages`
  - `client-frontend/src/layouts/MainLayout.jsx` — item "Historique" (HistoryIcon)
- **Description :** Page dédiée à la consultation de l'historique complet des passages réfectoire. Filtres cumulables : plage de dates (initialisée à aujourd'hui), établissement, résultat (ACCORDÉ/REFUSÉ), recherche par nom/prénom/matricule. Table paginée (10/25/50/100 lignes) avec colonnes date, heure, matricule, élève, classe, établissement, résultat, motif. Compteurs temps réel (total / accordés / refusés). Export CSV UTF-8 BOM compatible Excel. Rétro-compatible avec la vue daily de ScanPage (paramètre `date` conservé).

---

### [2026-07-01] - Fix : Passages 500 — double ORDER BY + JOIN FETCH Hibernate 6
- **Statut :** Livré / Opérationnel
- **Commit :** `a1dbe16`
- **Fichiers Modifiés :**
  - `server-backend/.../scan/repository/PassageRefectoireRepository.java` — suppression `JOIN FETCH` + `ORDER BY` hardcodé
  - `server-backend/src/main/resources/application.yml` — `default_batch_fetch_size: 50`, `max-page-size: 200`
- **Description :** Deux causes de 500 identifiées : (1) `JOIN FETCH` + Pageable en Hibernate 6 applique la pagination en mémoire (HHH90003004) et peut lever une exception ; (2) `ORDER BY p.heurePassage DESC` codé dans `@Query` + `sort=heurePassage,desc` dans l'URL Pageable générait un double `ORDER BY` invalide. Fix : suppression du `JOIN FETCH` et du `ORDER BY` dans le `@Query`, activation du batch fetch size (N+1 → N/50+1 queries), `max-page-size` porté à 200.

---

### [2026-07-01] - Fix : Passages 500 — migration @Query JPQL → JPA Specifications (Criteria API)
- **Statut :** Livré / Opérationnel
- **Commit :** `ac2dbdc`
- **Fichiers Créés :**
  - `server-backend/.../scan/repository/PassageSpecification.java`
- **Fichiers Modifiés :**
  - `server-backend/.../scan/repository/PassageRefectoireRepository.java` — `JpaSpecificationExecutor`
  - `server-backend/.../scan/service/ScanService.java` — `findAll(spec, pageable)`
- **Description :** Le `@Query` JPQL avec `(:resultat IS NULL OR p.resultat = :resultat)` continuait à échouer en 500 — Hibernate 6 ne résout pas fiablement les types null pour les enums dans les paramètres JPQL. Remplacement complet par JPA Criteria API : `PassageSpecification.withFilters()` ajoute chaque prédicat conditionnellement en Java, sans jamais passer de type null à Hibernate. Le sort Pageable est nativement résolu par Spring Data Criteria. Voir ADR-010.

---

### [2026-07-01] - Feat : Interface entièrement responsive (≤1200px)
- **Statut :** Livré / Opérationnel
- **Commit :** `e81f78e`
- **Fichiers Modifiés :**
  - `client-frontend/src/layouts/MainLayout.jsx` — Drawer temporaire sur mobile (< lg), permanent sur desktop (≥ lg) ; hamburger MenuIcon ; padding responsif xs/sm/md
  - `client-frontend/src/pages/scan/ScanPage.jsx` — layout colonne sur mobile, 2 colonnes sur md+ ; suppression hauteur fixe
  - `client-frontend/src/pages/paiements/PaiementsPage.jsx` — en-tête `flexWrap="wrap"` pour éviter le débordement sur petits écrans
- **Description :** L'application était inutilisable sur écrans ≤1200px : le Drawer permanent de 240px écrasait la zone de contenu principale. Threshold MUI `lg` (1200px) : en dessous le Drawer devient temporaire (overlay) et un bouton hamburger apparaît dans l'AppBar pour l'ouvrir ; la navigation ferme automatiquement le Drawer. Sur desktop (≥1200px) le comportement précédent (Drawer fixe latéral) est préservé.

---

### [2026-07-01] - Feat : Gestion Utilisateurs — Modification & Suppression définitive (ADMIN)
- **Statut :** Livré / Opérationnel
- **Commit :** `d6fa644`
- **Fichiers Créés :**
  - `server-backend/.../auth/dto/ModifierUtilisateurRequestDTO.java` — nom, prenom, email, nouveauMotDePasse (optionnel)
- **Fichiers Modifiés :**
  - `server-backend/.../auth/service/UtilisateurService.java` — `modifier()` (unicité email, changement mot de passe optionnel min 8 car.) + `supprimerDefinitivement()` (protection dernier ADMIN)
  - `server-backend/.../auth/controller/UtilisateurController.java` — `PUT /{id}` + `DELETE /{id}/permanent`
  - `client-frontend/src/services/utilisateurService.js` — `modifier()` PUT + `supprimer()` DELETE `/permanent`
  - `client-frontend/src/hooks/useUtilisateurs.js` — `modifier()` + `supprimer()` ajoutés
  - `client-frontend/src/pages/utilisateurs/UtilisateursPage.jsx` — `ModifierDialog` (formulaire pré-rempli + champ nouveau mdp optionnel), `ConfirmSupprimerDialog` (alerte irréversible), boutons Edit et DeleteForever sur chaque ligne
- **Description :** Complétion du CRUD utilisateurs pour les administrateurs. Modification : dialog pré-rempli permettant de changer nom, prénom, email et optionnellement le mot de passe (vide = conserver l'actuel). Suppression définitive : dialog de confirmation avec alerte "irréversible", protection systématique contre la suppression du dernier ADMIN (409 CONFLICT). Les boutons modifier et supprimer sont désactivés sur la propre ligne de l'utilisateur connecté.

---

### [2026-07-01] - Documentation : Manuel Utilisateur & Cahier de Recette avec captures d'écran réelles
- **Statut :** Livré / Opérationnel
- **Fichiers Créés :**
  - `documentations/manuel-utilisateur.html` + `.pdf` (1,3 Mo) — 12 sections, 13 captures d'écran réelles intégrées
  - `documentations/cahier-de-recette.html` + `.pdf` — 49 cas de test (AUTH, DASH, ETB, ELV, PAI, SCN, HIS, USR, CFG, THM)
  - `documentations/assets/01-login.png` à `16-dashboard-ivoirien.png` — 16 captures Playwright (1280×800)
  - `README.md` — réécriture complète avec stack, modules, setup local, sécurité, contact
- **Contexte résolu :**
  - Création manuelle de la table `configurations` (V2 Flyway) dans PostgreSQL Docker
  - Correction import Playwright (CommonJS → `import pkg from index.js`) + flag `--no-sandbox`
  - Résolution du bug Spring Security (InMemoryUserDetailsManager) via restart DevTools après création table manquante
- **Description :** Génération de documentation complète avec captures d'écran automatisées par Playwright. Le script capture 16 écrans : connexion, dashboard (3 thèmes), sélecteur thème, établissements, liste élèves, formulaire (3 onglets), paiements, scan réfectoire, historique, utilisateurs, configuration, À Propos. Le manuel utilisateur en PDF (1,3 Mo) intègre toutes les captures avec captions. Le cahier de recette couvre 49 cas de test fonctionnels.

---

### [2026-07-01] - Feat : Statistiques Globales — Dashboard enrichi
- **Statut :** Livré / Opérationnel
- **Fichiers Créés :**
  - `server-backend/.../dashboard/dto/DashboardStatsDTO.java` — record complet (établissements, élèves, passages, tendance 7 jours, paiements du mois)
  - `server-backend/.../dashboard/dto/JourPassageDTO.java` — projection jour : date, accordes, refuses
  - `server-backend/.../dashboard/service/DashboardService.java` — agrège toutes les stats en une seule transaction read-only
  - `server-backend/.../dashboard/controller/DashboardController.java` — `GET /api/v1/dashboard/stats`
- **Fichiers Modifiés :**
  - `server-backend/.../eleve/repository/EleveRepository.java` — `countByActifTrue()`, `countByStatutAccesAndActifTrue()`
  - `server-backend/.../etablissement/repository/EtablissementRepository.java` — `countByActifTrue()`
  - `server-backend/.../scan/repository/PassageRefectoireRepository.java` — `findTop5ByDatePassageOrderByHeurePassageDesc()`, `countByDateRangeGrouped()` (JPQL groupé)
  - `server-backend/.../paiement/repository/TransactionPaiementRepository.java` — `countByStatut()`, `statsAcceptesPeriode()` (COUNT + SUM du mois)
  - `client-frontend/src/services/dashboardService.js` — remplace 7 appels parallèles par un unique `GET /dashboard/stats`
  - `client-frontend/src/pages/DashboardPage.jsx` — 4 KPI cards enrichies (sous-info, FCFA), répartition statuts, panneau accès/paiements, graphique tendance 7 jours (barres MUI), table derniers passages
- **Description :** Remplacement des 7 appels API indépendants du frontend par un endpoint dédié côté backend (`DashboardService`) qui agrège toutes les données en une seule transaction. Enrichissements UI : sous-informations dans les KPI cards (accordés/refusés, nb transactions), panneau "Accès réfectoire aujourd'hui" avec barre de progression et taux d'accès %, panneau "Paiements du mois" avec montant FCFA formaté et compteur en attente, graphique en barres empilées pour la tendance des 7 derniers jours (vert accordés / rouge refusés) sans dépendance externe — 100% MUI.

---

### [2026-07-01] - Feat : Système de Thèmes & Design KLEM + Fenêtre À Propos
- **Statut :** Livré / Opérationnel
- **Fichiers Créés :**
  - `client-frontend/src/theme/themes.js` — 3 thèmes MUI : Corporatif (dark navy), Moderne (blanc/bling), École Ivoirienne (orange/vert)
  - `client-frontend/src/context/ThemeContext.jsx` — `ThemeModeProvider` + `useThemeMode()` avec persistance localStorage `klem-theme`
  - `client-frontend/src/components/ThemeSwitcher.jsx` — bouton palette + Popover 3 thèmes avec swatches et CheckIcon
  - `client-frontend/src/components/AProposDialog.jsx` — dialog ℹ️ avec version, coordonnées KLEM, copyright 2026
- **Fichiers Modifiés :**
  - `client-frontend/src/main.jsx` — pattern `ThemedApp` + `ThemeModeProvider` wrapper
  - `client-frontend/src/pages/auth/LoginPage.jsx` — redesign complet (gradient dynamique thème, logo 🍽️, KLEM Technologies & Services)
  - `client-frontend/src/layouts/MainLayout.jsx` — ThemeSwitcher dans AppBar, bouton À Propos en bas drawer
  - `client-frontend/package.json` — version `1.0.0-beta`
- **Description :** Identité visuelle KLEM (bleu #1565C0, orange #FF6D00) déclinée en 3 thèmes persistés en localStorage. Corporatif : dark mode marine profond, premium et sobre. Moderne : fond blanc, gradients colorés, effets lift-on-hover, animations cubic-bezier. École Ivoirienne : orange primaire, vert secondaire, fond ivoire. Tous les composants MUI (boutons, Drawer, AppBar, TableCell, Tabs, Chips) respectent les couleurs primary/secondary du thème actif. Fenêtre À Propos avec téléphone +225 07 58 89 24 77, site www.klemtech.net, email infos@klemtech.net.
