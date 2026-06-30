# DECISION-LOG.md - Registre des Décisions Architecturales (ADR)

Ce registre liste les choix technologiques et méthodologiques structurants arbitrés sur le projet.

### ADR 001 : Choix de la stack technique Front-end
- **Statut** : Accepté
- **Contexte** : Besoin d'une interface web hautement responsive, fluide (Mobile First) pour les parents et agents sur site.
- **Décision** : Utilisation de React.js propulsé par Vite pour des performances de build optimales, couplé à Material UI (MUI) pour des interfaces robustes.

### ADR 002 : Implémentation du Formulaire d'Élèves en Onglets
- **Statut** : Accepté
- **Contexte** : Contrainte d'ergonomie et d'affichage sur petits écrans pour limiter le scroll vertical lors des saisies d'élèves.
- **Décision** : Utilisation du composant Tabulation de MUI (`Tabs`, `TabPanel`) scindant les données de l'élève en 3 volets logiques clairs.

### ADR 003 : Traçabilité des actions via Table de Trace dédiée
- **Statut** : Accepté
- **Contexte** : Exigence de conformité et d'audit pour interdire toute modification non documentée des profils élèves et statuts de paiement.
- **Décision** : Création d'une table `ActionLog` alimentée via Programmation Orientée Aspect (AOP) au niveau des contrôleurs Spring Boot, capturant l'état avant/après de chaque entité modifiée.