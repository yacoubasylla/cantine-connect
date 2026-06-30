package com.klem.cantine.paiement.repository;

import com.klem.cantine.paiement.entity.StatutPaiement;
import com.klem.cantine.paiement.entity.TransactionPaiement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TransactionPaiementRepository extends JpaRepository<TransactionPaiement, Long> {

    Optional<TransactionPaiement> findByReferenceInterne(String referenceInterne);

    Page<TransactionPaiement> findByEleveId(Long eleveId, Pageable pageable);

    Page<TransactionPaiement> findByStatut(StatutPaiement statut, Pageable pageable);

    @Query("SELECT t FROM TransactionPaiement t WHERE " +
           "(:eleveId IS NULL OR t.eleve.id = :eleveId) AND " +
           "(:statut IS NULL OR t.statut = :statut) " +
           "ORDER BY t.dateCreation DESC")
    Page<TransactionPaiement> findAllWithFilters(Long eleveId, StatutPaiement statut, Pageable pageable);
}
