package com.klem.cantine.scan.repository;

import com.klem.cantine.scan.entity.PassageRefectoire;
import com.klem.cantine.scan.entity.ResultatScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;

public interface PassageRefectoireRepository
        extends JpaRepository<PassageRefectoire, Long>,
                JpaSpecificationExecutor<PassageRefectoire> {

    // Vérification doublon : l'élève a-t-il déjà eu un passage ACCORDÉ aujourd'hui ?
    boolean existsByEleveIdAndDatePassageAndResultat(
            Long eleveId, LocalDate datePassage, ResultatScan resultat);

    // Comptage rapide pour le dashboard
    long countByDatePassageAndResultat(LocalDate date, ResultatScan resultat);
}
