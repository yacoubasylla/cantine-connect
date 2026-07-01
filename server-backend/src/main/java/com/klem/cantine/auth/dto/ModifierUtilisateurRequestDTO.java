package com.klem.cantine.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ModifierUtilisateurRequestDTO(

        @NotBlank(message = "Le nom est obligatoire")
        String nom,

        @NotBlank(message = "Le prénom est obligatoire")
        String prenom,

        @Email(message = "Format email invalide")
        @NotBlank(message = "L'email est obligatoire")
        String email,

        // Laisser null ou vide pour conserver le mot de passe actuel
        String nouveauMotDePasse
) {}
