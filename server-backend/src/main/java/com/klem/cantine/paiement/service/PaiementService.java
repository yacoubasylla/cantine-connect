package com.klem.cantine.paiement.service;

import com.klem.cantine.actionlog.annotation.Traceable;
import com.klem.cantine.actionlog.entity.TypeAction;
import com.klem.cantine.eleve.repository.EleveRepository;
import com.klem.cantine.paiement.config.PaiementProperties;
import com.klem.cantine.paiement.dto.InitierPaiementRequestDTO;
import com.klem.cantine.paiement.dto.PaiementResponseDTO;
import com.klem.cantine.paiement.entity.StatutPaiement;
import com.klem.cantine.paiement.entity.TransactionPaiement;
import com.klem.cantine.paiement.repository.TransactionPaiementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaiementService {

    private final TransactionPaiementRepository transactionRepository;
    private final EleveRepository eleveRepository;
    private final PaiementProperties paiementProperties;

    @Traceable(action = TypeAction.CREATE, entite = "TransactionPaiement")
    @Transactional
    public PaiementResponseDTO initierPaiement(InitierPaiementRequestDTO dto) {
        var eleve = eleveRepository.findByIdActive(dto.eleveId())
                .orElseThrow(() -> new EntityNotFoundException("Élève introuvable : " + dto.eleveId()));

        String referenceInterne = UUID.randomUUID().toString();

        TransactionPaiement transaction = TransactionPaiement.builder()
                .eleve(eleve)
                .referenceInterne(referenceInterne)
                .operateur(dto.operateur())
                .montant(dto.montant())
                .telephonePayeur(dto.telephonePayeur())
                .build();

        transaction = transactionRepository.save(transaction);

        // URL de paiement CinetPay (en production : appel API CinetPay pour obtenir l'URL réelle)
        String paymentUrl = construireUrlPaiement(referenceInterne, dto);
        log.info("Paiement initié : ref={} operateur={} montant={} XOF",
                referenceInterne, dto.operateur(), dto.montant());

        return PaiementResponseDTO.from(transaction, paymentUrl);
    }

    public Page<PaiementResponseDTO> lister(Long eleveId, StatutPaiement statut, Pageable pageable) {
        return transactionRepository.findAllWithFilters(eleveId, statut, pageable)
                .map(PaiementResponseDTO::from);
    }

    public PaiementResponseDTO getById(Long id) {
        return transactionRepository.findById(id)
                .map(PaiementResponseDTO::from)
                .orElseThrow(() -> new EntityNotFoundException("Transaction introuvable : " + id));
    }

    // ── Construction URL paiement ─────────────────────────────────────────────

    private String construireUrlPaiement(String referenceInterne, InitierPaiementRequestDTO dto) {
        String siteId = paiementProperties.getCinetpay().getSiteId();
        return String.format(
                "https://checkout.cinetpay.com/pay?site_id=%s&transaction_id=%s&amount=%s&currency=XOF&phone=%s",
                siteId, referenceInterne, dto.montant(), dto.telephonePayeur()
        );
    }
}
