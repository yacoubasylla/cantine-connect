package com.klem.cantine.auth.repository;

import com.klem.cantine.auth.entity.Role;
import com.klem.cantine.auth.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmailAndActifTrue(String email);
    boolean existsByEmail(String email);
    long countByRoleAndActifTrue(Role role);
}
