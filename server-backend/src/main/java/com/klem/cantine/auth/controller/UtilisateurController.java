package com.klem.cantine.auth.controller;

import com.klem.cantine.auth.dto.ChangerRoleRequestDTO;
import com.klem.cantine.auth.dto.CreerUtilisateurRequestDTO;
import com.klem.cantine.auth.dto.UtilisateurResponseDTO;
import com.klem.cantine.auth.service.UtilisateurService;
import com.klem.cantine.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/utilisateurs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UtilisateurResponseDTO>>> lister(
            @PageableDefault(size = 20, sort = "nom") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(utilisateurService.lister(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UtilisateurResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(utilisateurService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UtilisateurResponseDTO>> creer(
            @Valid @RequestBody CreerUtilisateurRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(utilisateurService.creer(dto)));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UtilisateurResponseDTO>> changerRole(
            @PathVariable Long id,
            @Valid @RequestBody ChangerRoleRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(utilisateurService.changerRole(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        utilisateurService.desactiver(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reactiver")
    public ResponseEntity<ApiResponse<UtilisateurResponseDTO>> reactiver(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(utilisateurService.reactiver(id)));
    }
}
