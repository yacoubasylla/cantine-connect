package com.klem.cantine.scan.controller;

import com.klem.cantine.common.ApiResponse;
import com.klem.cantine.scan.dto.CacheEntreeDTO;
import com.klem.cantine.scan.dto.PassageResponseDTO;
import com.klem.cantine.scan.dto.ScanResultDTO;
import com.klem.cantine.scan.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ScanController {

    private final ScanService scanService;

    /**
     * Scan d'un QR Code — réponse < 1s.
     * POST /api/v1/scan/{qrCodeToken}
     */
    @PostMapping("/api/v1/scan/{qrCodeToken}")
    public ResponseEntity<ApiResponse<ScanResultDTO>> scanner(
            @PathVariable String qrCodeToken) {
        ScanResultDTO result = scanService.scanner(qrCodeToken);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /**
     * Cache offline — liste complète des élèves actifs pour le mode dégradé 24h.
     * GET /api/v1/scan/cache
     */
    @GetMapping("/api/v1/scan/cache")
    public ResponseEntity<ApiResponse<List<CacheEntreeDTO>>> cache() {
        List<CacheEntreeDTO> cache = scanService.getCacheOffline();
        return ResponseEntity.ok(ApiResponse.ok(
                "Cache généré — " + cache.size() + " élèves actifs", cache));
    }

    /**
     * Historique des passages du jour ou d'une date donnée.
     * GET /api/v1/passages?date=2026-06-30&etablissementId=1
     */
    @GetMapping("/api/v1/passages")
    public ResponseEntity<ApiResponse<Page<PassageResponseDTO>>> passages(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long etablissementId,
            @PageableDefault(size = 50, sort = "heurePassage") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                scanService.listerPassages(date, etablissementId, pageable)));
    }
}
