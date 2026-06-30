package com.klem.cantine.auth.config;

import com.klem.cantine.auth.entity.Role;
import com.klem.cantine.auth.entity.Utilisateur;
import com.klem.cantine.auth.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (utilisateurRepository.count() == 0) {
            utilisateurRepository.save(Utilisateur.builder()
                    .nom("Admin")
                    .prenom("Système")
                    .email("admin@cantine.connect")
                    .motDePasse(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .build());
            log.info(">>> Compte admin créé : admin@cantine.connect / Admin123!");
        }
    }
}
