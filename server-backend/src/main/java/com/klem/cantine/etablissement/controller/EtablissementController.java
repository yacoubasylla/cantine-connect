package com.klem.cantine.etablissement.controller;

import com.klem.cantine.common.ApiResponse;
import com.klem.cantine.etablissement.dto.ClasseRequestDTO;
import com.klem.cantine.etablissement.dto.EtablissementRequestDTO;
import com.klem.cantine.etablissement.dto.NiveauRequestDTO;
import com.klem.cantine.etablissement.service.EtablissementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/etablissements")
@RequiredArgsConstructor
public class EtablissementController {

    private final EtablissementService etablissementService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> creer(@Valid @RequestBody EtablissementRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(etablissementService.creer(dto)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> lister() {
        return ResponseEntity.ok(ApiResponse.ok(etablissementService.listerActifs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(etablissementService.getById(id)));
    }

    @GetMapping("/{id}/classes")
    public ResponseEntity<ApiResponse<?>> getClasses(
            @PathVariable Long id,
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(etablissementService.getClassesByEtablissement(id, anneeScolaire)));
    }

    @GetMapping("/{id}/niveaux")
    public ResponseEntity<ApiResponse<?>> getNiveaux(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(etablissementService.getNiveauxAvecClasses(id)));
    }

    @PostMapping("/{id}/niveaux")
    public ResponseEntity<ApiResponse<?>> creerNiveau(
            @PathVariable Long id,
            @Valid @RequestBody NiveauRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(etablissementService.creerNiveau(id, dto)));
    }

    @PostMapping("/niveaux/{niveauId}/classes")
    public ResponseEntity<ApiResponse<?>> creerClasse(
            @PathVariable Long niveauId,
            @Valid @RequestBody ClasseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(etablissementService.creerClasse(niveauId, dto)));
    }

    @DeleteMapping("/niveaux/{niveauId}")
    public ResponseEntity<ApiResponse<?>> supprimerNiveau(@PathVariable Long niveauId) {
        etablissementService.supprimerNiveau(niveauId);
        return ResponseEntity.ok(ApiResponse.ok("Niveau supprimé"));
    }

    @DeleteMapping("/classes/{classeId}")
    public ResponseEntity<ApiResponse<?>> supprimerClasse(@PathVariable Long classeId) {
        etablissementService.supprimerClasse(classeId);
        return ResponseEntity.ok(ApiResponse.ok("Classe supprimée"));
    }
}
