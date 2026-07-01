package com.klem.cantine.paiement.repository;

import com.klem.cantine.paiement.entity.StatutPaiement;
import com.klem.cantine.paiement.entity.TransactionPaiement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionPaiementRepository extends JpaRepository<TransactionPaiement, Long> {

    Optional<TransactionPaiement> findByReferenceInterne(String referenceInterne);

    Page<TransactionPaiement> findByEleveId(Long eleveId, Pageable pageable);

    Page<TransactionPaiement> findByStatut(StatutPaiement statut, Pageable pageable);

    @Query("SELECT t FROM TransactionPaiement t JOIN t.eleve e WHERE " +
           "(:eleveId IS NULL OR e.id = :eleveId) AND " +
           "(:statut IS NULL OR t.statut = :statut) AND " +
           "(:search IS NULL OR LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.matricule) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.dateCreation DESC")
    Page<TransactionPaiement> findAllWithFilters(Long eleveId, StatutPaiement statut, String search, Pageable pageable);

    @Query("SELECT t FROM TransactionPaiement t JOIN t.eleve e WHERE " +
           "e.id IN :eleveIds AND " +
           "(:eleveId IS NULL OR e.id = :eleveId) AND " +
           "(:statut IS NULL OR t.statut = :statut) AND " +
           "(:search IS NULL OR LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.matricule) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.dateCreation DESC")
    Page<TransactionPaiement> findAllWithFiltersForEleves(
            List<Long> eleveIds, Long eleveId, StatutPaiement statut, String search, Pageable pageable);

    long countByStatut(StatutPaiement statut);

    @Query("SELECT COUNT(t), COALESCE(SUM(t.montant), 0) FROM TransactionPaiement t " +
           "WHERE t.statut = com.klem.cantine.paiement.entity.StatutPaiement.ACCEPTE " +
           "AND t.dateCreation >= :debut AND t.dateCreation < :fin")
    Object[] statsAcceptesPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
}
