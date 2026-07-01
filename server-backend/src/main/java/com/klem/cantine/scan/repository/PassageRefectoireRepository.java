package com.klem.cantine.scan.repository;

import com.klem.cantine.scan.entity.PassageRefectoire;
import com.klem.cantine.scan.entity.ResultatScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface PassageRefectoireRepository extends JpaRepository<PassageRefectoire, Long> {

    // Vérification doublon : l'élève a-t-il déjà eu un passage ACCORDÉ aujourd'hui ?
    boolean existsByEleveIdAndDatePassageAndResultat(Long eleveId, LocalDate datePassage, ResultatScan resultat);

    // Recherche multi-critères : JOIN simple (pas de FETCH JOIN pour éviter le conflit
    // Hibernate 6 + pagination en mémoire). Les associations sont chargées en batch
    // via hibernate.default_batch_fetch_size configuré dans application.yml.
    // Pas de ORDER BY dans la requête : Pageable l'applique (évite le double ORDER BY).
    @Query(value = "SELECT p FROM PassageRefectoire p " +
           "JOIN p.eleve e " +
           "JOIN e.etablissement et " +
           "WHERE p.datePassage BETWEEN :dateDebut AND :dateFin " +
           "AND (:etablissementId IS NULL OR et.id = :etablissementId) " +
           "AND (:resultat IS NULL OR p.resultat = :resultat) " +
           "AND (:search IS NULL OR (" +
           "  LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.matricule) LIKE LOWER(CONCAT('%', :search, '%'))" +
           "))",
           countQuery = "SELECT COUNT(p) FROM PassageRefectoire p " +
           "JOIN p.eleve e " +
           "JOIN e.etablissement et " +
           "WHERE p.datePassage BETWEEN :dateDebut AND :dateFin " +
           "AND (:etablissementId IS NULL OR et.id = :etablissementId) " +
           "AND (:resultat IS NULL OR p.resultat = :resultat) " +
           "AND (:search IS NULL OR (" +
           "  LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.matricule) LIKE LOWER(CONCAT('%', :search, '%'))" +
           "))")
    Page<PassageRefectoire> findWithFilters(
            @Param("dateDebut")        LocalDate dateDebut,
            @Param("dateFin")          LocalDate dateFin,
            @Param("etablissementId")  Long etablissementId,
            @Param("resultat")         ResultatScan resultat,
            @Param("search")           String search,
            Pageable pageable);

    // Comptage rapide pour le dashboard
    long countByDatePassageAndResultat(LocalDate date, ResultatScan resultat);
}
