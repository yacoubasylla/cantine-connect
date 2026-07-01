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

    // Recherche multi-critères avec plage de dates, établissement, résultat, texte libre
    @Query(value = "SELECT p FROM PassageRefectoire p " +
           "JOIN FETCH p.eleve e JOIN FETCH e.classe JOIN FETCH e.etablissement " +
           "WHERE p.datePassage BETWEEN :dateDebut AND :dateFin " +
           "AND (:etablissementId IS NULL OR e.etablissement.id = :etablissementId) " +
           "AND (:resultat IS NULL OR p.resultat = :resultat) " +
           "AND (:search IS NULL OR (" +
           "  LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "  OR LOWER(e.matricule) LIKE LOWER(CONCAT('%', :search, '%'))" +
           ")) " +
           "ORDER BY p.heurePassage DESC",
           countQuery = "SELECT COUNT(p) FROM PassageRefectoire p " +
           "JOIN p.eleve e " +
           "WHERE p.datePassage BETWEEN :dateDebut AND :dateFin " +
           "AND (:etablissementId IS NULL OR e.etablissement.id = :etablissementId) " +
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
