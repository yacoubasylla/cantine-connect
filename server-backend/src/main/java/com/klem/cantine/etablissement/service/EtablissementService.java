package com.klem.cantine.etablissement.service;

import com.klem.cantine.etablissement.dto.*;
import com.klem.cantine.etablissement.entity.Classe;
import com.klem.cantine.etablissement.entity.Etablissement;
import com.klem.cantine.etablissement.entity.Niveau;
import com.klem.cantine.etablissement.repository.ClasseRepository;
import com.klem.cantine.etablissement.repository.EtablissementRepository;
import com.klem.cantine.etablissement.repository.NiveauRepository;
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
    private final NiveauRepository niveauRepository;
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

    public List<NiveauResponseDTO> getNiveauxAvecClasses(Long etablissementId) {
        if (!etablissementRepository.existsById(etablissementId)) {
            throw new EntityNotFoundException("Établissement introuvable : " + etablissementId);
        }
        return niveauRepository.findByEtablissementIdOrderByOrdre(etablissementId)
                .stream()
                .map(NiveauResponseDTO::from)
                .toList();
    }

    @Transactional
    public NiveauResponseDTO creerNiveau(Long etablissementId, NiveauRequestDTO dto) {
        Etablissement etab = etablissementRepository.findById(etablissementId)
                .orElseThrow(() -> new EntityNotFoundException("Établissement introuvable : " + etablissementId));
        Niveau niveau = Niveau.builder()
                .etablissement(etab)
                .libelle(dto.libelle())
                .ordre(dto.ordre() != null ? dto.ordre() : 0)
                .build();
        return NiveauResponseDTO.from(niveauRepository.save(niveau));
    }

    @Transactional
    public ClasseResponseDTO creerClasse(Long niveauId, ClasseRequestDTO dto) {
        Niveau niveau = niveauRepository.findById(niveauId)
                .orElseThrow(() -> new EntityNotFoundException("Niveau introuvable : " + niveauId));
        String annee = (dto.anneeScolaire() != null && !dto.anneeScolaire().isBlank())
                ? dto.anneeScolaire() : "2025-2026";
        Classe classe = Classe.builder()
                .niveau(niveau)
                .libelle(dto.libelle())
                .anneeScolaire(annee)
                .build();
        return ClasseResponseDTO.from(classeRepository.save(classe));
    }
}
