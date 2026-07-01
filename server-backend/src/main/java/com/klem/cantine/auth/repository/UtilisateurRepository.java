package com.klem.cantine.auth.repository;

import com.klem.cantine.auth.entity.Role;
import com.klem.cantine.auth.entity.Utilisateur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmailAndActifTrue(String email);
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);
    long countByRoleAndActifTrue(Role role);
    Page<Utilisateur> findByRoleAndActifTrue(Role role, Pageable pageable);

    @Query("SELECT u FROM Utilisateur u WHERE u.role = :role AND u.actif = true AND " +
           "(:search IS NULL OR LOWER(u.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR u.telephone LIKE CONCAT('%', :search, '%'))")
    Page<Utilisateur> findByRoleAndActifTrueWithSearch(
            @Param("role") Role role, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM Utilisateur u WHERE " +
           "(:search IS NULL OR LOWER(u.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR u.telephone LIKE CONCAT('%', :search, '%'))")
    Page<Utilisateur> findAllWithSearch(@Param("search") String search, Pageable pageable);
}
