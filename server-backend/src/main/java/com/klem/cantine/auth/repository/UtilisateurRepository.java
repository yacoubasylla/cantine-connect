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

    // Requêtes natives — voir ADR-007 : Hibernate 6 + PostgreSQL échouent à inférer le type
    // d'un paramètre JPQL nullable utilisé dans LOWER()/LIKE ("operator does not exist: lower(bytea)").
    // Le CAST explicite (CAST(:param AS varchar)) contourne le problème.
    @Query(value = """
            SELECT * FROM utilisateurs u
            WHERE u.role = CAST(:role AS varchar) AND u.actif = true
              AND (CAST(:search AS varchar) IS NULL
                   OR LOWER(u.nom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR u.telephone LIKE CONCAT('%', CAST(:search AS varchar), '%'))
            """,
           countQuery = """
            SELECT COUNT(*) FROM utilisateurs u
            WHERE u.role = CAST(:role AS varchar) AND u.actif = true
              AND (CAST(:search AS varchar) IS NULL
                   OR LOWER(u.nom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR u.telephone LIKE CONCAT('%', CAST(:search AS varchar), '%'))
            """,
           nativeQuery = true)
    Page<Utilisateur> findByRoleAndActifTrueWithSearch(
            @Param("role") String role, @Param("search") String search, Pageable pageable);

    @Query(value = """
            SELECT * FROM utilisateurs u
            WHERE (CAST(:search AS varchar) IS NULL
                   OR LOWER(u.nom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR u.telephone LIKE CONCAT('%', CAST(:search AS varchar), '%'))
            """,
           countQuery = """
            SELECT COUNT(*) FROM utilisateurs u
            WHERE (CAST(:search AS varchar) IS NULL
                   OR LOWER(u.nom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR LOWER(u.prenom) LIKE LOWER(CONCAT('%', CAST(:search AS varchar), '%'))
                   OR u.telephone LIKE CONCAT('%', CAST(:search AS varchar), '%'))
            """,
           nativeQuery = true)
    Page<Utilisateur> findAllWithSearch(@Param("search") String search, Pageable pageable);
}
