package com.klem.cantine.etablissement.service;

import com.klem.cantine.etablissement.dto.ClasseResponseDTO;
import com.klem.cantine.etablissement.dto.EtablissementRequestDTO;
import com.klem.cantine.etablissement.dto.EtablissementResponseDTO;
import com.klem.cantine.etablissement.entity.Etablissement;
import com.klem.cantine.etablissement.repository.ClasseRepository;
import com.klem.cantine.etablissement.repository.EtablissementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EtablissementService {

    private final EtablissementRepository etablissementRepository;
    private final ClasseRepository classeRepository;

    @Transactional
    public EtablissementResponseDTO creer(EtablissementRequestDTO dto) {
        Etablissement e = Etablissement.builder()
                .nom(dto.nom())
                .adresse(dto.adresse())
                .ville(dto.ville() != null ? dto.ville() : "Abidjan")
                .telephone(dto.telephone())
                .build();
        return EtablissementResponseDTO.from(etablissementRepository.save(e));
    }

    public List<EtablissementResponseDTO> listerActifs() {
        return etablissementRepository.findByActifTrue()
                .stream()
                .map(EtablissementResponseDTO::from)
                .toList();
    }

    public EtablissementResponseDTO getById(Long id) {
        return etablissementRepository.findById(id)
                .filter(e -> e.getActif())
                .map(EtablissementResponseDTO::from)
                .orElseThrow(() -> new EntityNotFoundException("Établissement introuvable : " + id));
    }

    public List<ClasseResponseDTO> getClassesByEtablissement(Long etablissementId, String anneeScolaire) {
        if (!etablissementRepository.existsById(etablissementId)) {
            throw new EntityNotFoundException("Établissement introuvable : " + etablissementId);
        }
        return classeRepository.findByEtablissementAndAnnee(etablissementId, anneeScolaire)
                .stream()
                .map(ClasseResponseDTO::from)
                .toList();
    }
}
