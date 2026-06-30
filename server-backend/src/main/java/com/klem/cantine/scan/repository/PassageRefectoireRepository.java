package com.klem.cantine.scan.repository;

import com.klem.cantine.scan.entity.PassageRefectoire;
import com.klem.cantine.scan.entity.ResultatScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface PassageRefectoireRepository extends JpaRepository<PassageRefectoire, Long> {

    // Vérification doublon : l'élève a-t-il déjà eu un passage ACCORDÉ aujourd'hui ?
    boolean existsByEleveIdAndDatePassageAndResultat(Long eleveId, LocalDate datePassage, ResultatScan resultat);

    // Liste des passages du jour avec chargement eager pour éviter N+1
    @Query("SELECT p FROM PassageRefectoire p " +
           "JOIN FETCH p.eleve e JOIN FETCH e.classe JOIN FETCH e.etablissement " +
           "WHERE p.datePassage = :date " +
           "ORDER BY p.heurePassage DESC")
    Page<PassageRefectoire> findByDatePassageWithDetails(LocalDate date, Pageable pageable);

    // Filtre par établissement
    @Query("SELECT p FROM PassageRefectoire p " +
           "JOIN FETCH p.eleve e JOIN FETCH e.classe JOIN FETCH e.etablissement " +
           "WHERE p.datePassage = :date AND e.etablissement.id = :etablissementId " +
           "ORDER BY p.heurePassage DESC")
    Page<PassageRefectoire> findByDatePassageAndEtablissementId(
            LocalDate date, Long etablissementId, Pageable pageable);

    // Comptage rapide pour le dashboard
    long countByDatePassageAndResultat(LocalDate date, ResultatScan resultat);
}
