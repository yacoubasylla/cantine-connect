package com.klem.cantine.etablissement.controller;

import com.klem.cantine.common.ApiResponse;
import com.klem.cantine.etablissement.dto.EtablissementRequestDTO;
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
}
