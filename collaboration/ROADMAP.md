# ROADMAP — Cantine Connect
> Inventaire complet des modules, fonctionnalités et tests de validation
> Mis à jour : 2026-06-30 | Responsable : Yacouba SYLLA

---

## Légende
| Icône | Statut |
|-------|--------|
| ✅ | Livré et testé |
| 🔄 | En cours |
| 🔲 | À faire |
| ❌ | Bloqué |

---

## PARTIE 1 — BACK-END (Spring Boot 3.x / Java 17)

### ✅ B-01 · Infrastructure & Fondations
**Périmètre :** Docker, Spring Boot, configuration multi-profils, CORS  
**Fichiers clés :** `docker-compose.yml`, `application.yml`, `CantineConnectApplication.java`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `docker compose up -d` → PostgreSQL actif sur `localhost:5432` | ✅ |
| 2 | `./mvnw compile -q` → 0 erreur | ✅ |
| 3 | `curl http://localhost:8081/actuator/health` → `{"status":"UP"}` | ✅ |
| 4 | Requête depuis `localhost:5173` → pas d'erreur CORS | ✅ |

---

### ✅ B-02 · Gestion Structurelle (Établissements / Niveaux / Classes)
**Périmètre :** CRUD complet, cascade JPA, pagination  
**Fichiers clés :** `etablissement/` (entity, repository, service, controller, dto)

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/etablissements` → 201 + objet créé | ✅ |
| 2 | `GET /api/v1/etablissements` → liste des établissements actifs | ✅ |
| 3 | `POST /api/v1/etablissements/{id}/niveaux` → niveau créé | ✅ |
| 4 | `POST /api/v1/etablissements/niveaux/{id}/classes` → classe créée | ✅ |
| 5 | `DELETE /api/v1/etablissements/niveaux/{id}` → cascade classes supprimées | ✅ |
| 6 | `DELETE /api/v1/etablissements/classes/{id}` → classe supprimée | ✅ |
| 7 | `GET /api/v1/etablissements/{id}/niveaux` → structure hiérarchique complète | ✅ |

---

### ✅ B-03 · Gestion des Élèves
**Périmètre :** CRUD, QR code UUID, pagination serveur, filtres multi-critères  
**Fichiers clés :** `eleve/` (entity, repository, service, controller, dto)

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/eleves` → 201 + qrCodeToken UUID auto-généré | ✅ |
| 2 | `GET /api/v1/eleves?page=0&size=10` → page paginée | ✅ |
| 3 | `GET /api/v1/eleves?search=kouassi` → filtre par nom | ✅ |
| 4 | `GET /api/v1/eleves?etablissementId=1` → filtre par établissement | ✅ |
| 5 | `GET /api/v1/eleves?statut=AUTORISE` → filtre par statut | ✅ |
| 6 | `PUT /api/v1/eleves/{id}` → mise à jour complète | ✅ |
| 7 | `PATCH /api/v1/eleves/{id}/statut?statut=AUTORISE` → changement statut | ✅ |
| 8 | `DELETE /api/v1/eleves/{id}` → suppression logique (`actif=false`) | ✅ |
| 9 | `POST` avec matricule dupliqué → 400 avec message clair | ✅ |
| 10 | `POST` sans champs obligatoires → 400 + détail validation JSON | ✅ |

---

### ✅ B-04 · Authentification JWT Stateless
**Périmètre :** Login, JwtFilter, SecurityConfig, rôles ADMIN/GESTIONNAIRE/CAISSIER  
**Fichiers clés :** `auth/` (entity, repository, service, controller, config, dto), `common/JwtAuthFilter.java`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/auth/login` (admin@cantine.connect / Admin123!) → 200 + token JWT | ✅ |
| 2 | `POST /api/v1/auth/login` (mauvais mdp) → 401 + message `UNAUTHORIZED` | ✅ |
| 3 | `GET /api/v1/eleves` sans token → 403 | ✅ |
| 4 | `GET /api/v1/eleves` avec token valide → 200 | ✅ |
| 5 | Compte admin créé automatiquement au 1er démarrage (DataInitializer) | ✅ |
| 6 | Token expiré → 403 et redirection /login côté frontend | ✅ |

---

### ✅ B-05 · ActionLog AOP (Traçabilité)
**Périmètre :** Aspect Spring AOP, table `action_logs`, capture avant/après, auteur JWT  
**Fichiers clés :** `actionlog/` (annotation, aspect, controller, dto, entity, repository, service), `common/AsyncConfig.java`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/eleves` → ligne insérée dans `action_logs` avec `type=CREATE` | ✅ |
| 2 | `PATCH /api/v1/eleves/{id}/statut` → ligne avec `type=UPDATE` + payload avant/après | ✅ |
| 3 | `DELETE /api/v1/eleves/{id}` → ligne avec `type=DELETE` + payload `{"id":"2"}` | ✅ |
| 4 | Auteur = `admin@cantine.connect` (email extrait du SecurityContext JWT) | ✅ |
| 5 | Exécution asynchrone (`@Async`) → log créé sans bloquer la réponse HTTP | ✅ |

---

### ✅ B-06 · Moteur de Paiements & Webhooks
**Périmètre :** TransactionPaiement, CinetPay/PayDunya, webhooks, statuts Mobile Money  
**Fichiers clés :** `paiement/` (entity, dto, repository, service, controller, config)

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/paiements/initier` → transaction EN_ATTENTE + paymentUrl CinetPay | ✅ |
| 2 | Webhook CinetPay `cpm_result=00` → transaction ACCEPTE + élève AUTORISE | ✅ |
| 3 | Webhook CinetPay `cpm_result=01/REFUSED` → transaction REFUSE, statut élève inchangé | ✅ |
| 4 | Signature vérifiée si `CINETPAY_VERIFY_SIGNATURE=true` (désactivée en dev) | ✅ |
| 5 | `GET /api/v1/paiements?eleveId={id}` → historique transactions paginé | ✅ |
| 6 | Webhook retourne HTTP 200 immédiatement, traitement `@Async` en arrière-plan | ✅ |

---

### ✅ B-07 · Contrôle d'Accès QR Code / Scan Réfectoire
**Périmètre :** PassageRefectoire, validation < 1s, cache offline 24h  
**Fichiers clés :** `scan/` (entity, dto, repository, service, controller)

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `POST /api/v1/scan/{qrCodeToken}` → réponse en **240ms** (< 1 000ms) | ✅ |
| 2 | Token valide + statut `AUTORISE` → 200 `{"acces":"ACCORDÉ"}` + passageId | ✅ |
| 3 | Token valide + statut `SUSPENDU` → 200 `{"acces":"REFUSÉ"}` motif=STATUT_SUSPENDU | ✅ |
| 4 | Token inexistant → 404 | ✅ |
| 5 | Double passage même jour → `{"acces":"REFUSÉ"}` motif=DOUBLON_PASSAGE | ✅ |
| 6 | `GET /api/v1/scan/cache` → cache avec tous les élèves actifs + statuts | ✅ |
| 7 | `GET /api/v1/passages?date=2026-06-30` → liste 3 passages (ACCORDE + REFUSE) | ✅ |

---

### 🔲 B-08 · Gestion des Utilisateurs (Admin)
**Périmètre :** CRUD utilisateurs, changement de rôle, désactivation  
**Fichiers clés :** `auth/controller/UtilisateurController.java`

| # | Test de validation | Attendu |
|---|-------------------|---------|
| 1 | `POST /api/v1/utilisateurs` (ADMIN) → création d'un gestionnaire | 🔲 |
| 2 | `GET /api/v1/utilisateurs` (ADMIN) → liste complète | 🔲 |
| 3 | `PATCH /api/v1/utilisateurs/{id}/role` → changement de rôle | 🔲 |
| 4 | `DELETE /api/v1/utilisateurs/{id}` → désactivation (soft delete) | 🔲 |
| 5 | Accès refusé si rôle ≠ ADMIN → 403 | 🔲 |

---

## PARTIE 2 — FRONT-END (React 18 / Vite / MUI v9)

### ✅ F-01 · Socle Technique & Layout
**Périmètre :** ThemeProvider, MainLayout (AppBar + Drawer), routing React Router v7  
**Fichiers clés :** `theme.js`, `layouts/MainLayout.jsx`, `App.jsx`, `main.jsx`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | `npm run dev` → démarrage sans erreur sur `localhost:5173` | ✅ |
| 2 | Drawer persistant → pas de chevauchement avec le contenu | ✅ |
| 3 | Navigation sidebar → changement de page sans rechargement | ✅ |
| 4 | AppBar affiche nom + rôle + bouton déconnexion | ✅ |

---

### ✅ F-02 · Authentification UI
**Périmètre :** LoginPage, AuthContext (localStorage), ProtectedRoute, intercepteur 401  
**Fichiers clés :** `pages/auth/LoginPage.jsx`, `context/AuthContext.jsx`, `components/ProtectedRoute.jsx`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | Accès à `/dashboard` sans login → redirect `/login` | ✅ |
| 2 | Login valide → redirect `/dashboard` + token en localStorage | ✅ |
| 3 | Login invalide → message d'erreur affiché | ✅ |
| 4 | Clic "Déconnexion" → token supprimé + redirect `/login` | ✅ |
| 5 | Refresh page authentifié → session restaurée (token localStorage) | ✅ |

---

### ✅ F-03 · Gestion Structurelle UI
**Périmètre :** EtablissementsPage, GestionStructureDialog (niveaux + classes)  
**Fichiers clés :** `pages/etablissements/`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | Créer un établissement → apparaît dans la liste | ✅ |
| 2 | Ouvrir "Gérer les classes" → dialog avec la structure | ✅ |
| 3 | Saisir `CP, CE1, CM1` → 3 niveaux créés en un clic | ✅ |
| 4 | Saisir `CP A, CP B` sous un niveau → 2 classes créées | ✅ |
| 5 | Supprimer un niveau avec classes → confirmation + cascade | ✅ |
| 6 | Supprimer une classe individuelle → confirmation | ✅ |

---

### ✅ F-04 · Gestion des Élèves UI
**Périmètre :** ElevesPage (tableau paginé), EleveFormDialog (3 onglets)  
**Fichiers clés :** `pages/eleves/`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | Tableau paginé → 10 lignes par défaut, navigation fonctionnelle | ✅ |
| 2 | Filtre recherche → résultats mis à jour côté serveur | ✅ |
| 3 | Filtre statut → filtre côté serveur | ✅ |
| 4 | Dialog 3 onglets → Général / Cantine+Affectation / Contacts+Allergies | ✅ |
| 5 | Select Classe → vide si aucun établissement sélectionné | ✅ |
| 6 | Select Classe → se peuple après sélection d'un établissement | ✅ |
| 7 | Validation formulaire → erreurs affichées sur le bon onglet | ✅ |
| 8 | Modifier un élève → formulaire pré-rempli | ✅ |
| 9 | Supprimer un élève → confirmation + disparition du tableau | ✅ |
| 10 | Badge StatutBadge → couleur correcte par statut | ✅ |

---

### 🔄 F-05 · Dashboard (Stats Réelles)
**Périmètre :** Statistiques dynamiques depuis API (nb élèves, passages, paiements)  
**Fichiers clés :** `pages/DashboardPage.jsx`

| # | Test de validation | Résultat |
|---|-------------------|----------|
| 1 | Nombre d'établissements réel affiché | 🔲 |
| 2 | Nombre d'élèves inscrits réel | 🔲 |
| 3 | Passages du jour en temps réel | 🔲 |
| 4 | Montant encaissé du mois | 🔲 |

---

### 🔲 F-06 · Interface Paiements
**Périmètre :** Liste transactions, initiation paiement, statuts Mobile Money  
**Fichiers clés :** `pages/paiements/`

| # | Test de validation | Attendu |
|---|-------------------|---------|
| 1 | Liste transactions paginée par élève | 🔲 |
| 2 | Bouton "Initier paiement" → dialog avec choix opérateur | 🔲 |
| 3 | Statut Orange/MTN/Moov/Wave affiché avec icône | 🔲 |
| 4 | Historique paiements d'un élève accessible depuis sa fiche | 🔲 |

---

### 🔲 F-07 · Interface QR Code / Scan Mobile
**Périmètre :** Page scan mobile-friendly, résultat ACCORDÉ/REFUSÉ, historique passages  
**Fichiers clés :** `pages/scan/`

| # | Test de validation | Attendu |
|---|-------------------|---------|
| 1 | Page dédiée mobile avec champ saisie QR | 🔲 |
| 2 | Résultat scan affiché en < 1s (vert/rouge) | 🔲 |
| 3 | Historique passages du jour filtré par établissement | 🔲 |
| 4 | Fonctionne en mode offline (cache localStorage 24h) | 🔲 |

---

### 🔲 F-08 · Gestion des Utilisateurs UI (Admin)
**Périmètre :** Liste utilisateurs, création, changement rôle (ADMIN seulement)  
**Fichiers clés :** `pages/utilisateurs/`

| # | Test de validation | Attendu |
|---|-------------------|---------|
| 1 | Menu "Utilisateurs" visible seulement pour ADMIN | 🔲 |
| 2 | Créer un gestionnaire → apparaît dans la liste | 🔲 |
| 3 | Changer le rôle → mis à jour immédiatement | 🔲 |
| 4 | Désactiver un utilisateur → ne peut plus se connecter | 🔲 |

---

## Récapitulatif de progression

| Module | Backend | Frontend | Priorité |
|--------|---------|----------|----------|
| B-01 Infrastructure | ✅ | — | — |
| B-02 / F-03 Structure | ✅ | ✅ | — |
| B-03 / F-04 Élèves | ✅ | ✅ | — |
| B-04 / F-02 Auth JWT | ✅ | ✅ | — |
| F-01 Layout | — | ✅ | — |
| B-05 ActionLog AOP | ✅ | — | — |
| B-06 / F-06 Paiements | ✅ | 🔲 | 🟡 F-06 restant |
| B-07 / F-07 QR Scan | ✅ | 🔲 | 🟡 F-07 restant |
| F-05 Dashboard | — | 🔄 | 🟡 Moyenne |
| B-08 / F-08 Utilisateurs | 🔲 | 🔲 | 🟡 Moyenne |

**Avancement global : 11/16 modules livrés (69%)**
