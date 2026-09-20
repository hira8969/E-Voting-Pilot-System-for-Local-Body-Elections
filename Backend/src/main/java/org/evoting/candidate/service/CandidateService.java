package org.evoting.candidate.service;

import org.evoting.candidate.dto.CandidateDto;
import org.evoting.candidate.entity.Candidate;
import org.evoting.candidate.repository.CandidateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate addCandidate(CandidateDto dto) {
        Candidate candidate = new Candidate();
        candidate.setElectionId(dto.getElectionId());
        candidate.setFullName(dto.getFullName().trim());
        candidate.setPartyName(dto.getPartyName().trim());
        candidate.setSymbolUrl(dto.getSymbolUrl());
        candidate.setConstituency(dto.getConstituency().trim());
        candidate.setBio(dto.getBio());
        candidate.setManifesto(dto.getManifesto());
        candidate.setNominationStatus(dto.getNominationStatus() != null ? dto.getNominationStatus() : "APPROVED");

        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }

    public List<Candidate> getCandidatesByElection(Long electionId) {
        return candidateRepository.findByElectionId(electionId);
    }

    public List<Candidate> getCandidatesByElectionAndConstituency(Long electionId, String constituency) {
        return candidateRepository.findByElectionIdAndConstituency(electionId, constituency.trim());
    }

    public Candidate updateCandidate(Long id, CandidateDto dto) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found with id: " + id));

        candidate.setElectionId(dto.getElectionId());
        candidate.setFullName(dto.getFullName().trim());
        candidate.setPartyName(dto.getPartyName().trim());
        candidate.setSymbolUrl(dto.getSymbolUrl());
        candidate.setConstituency(dto.getConstituency().trim());
        candidate.setBio(dto.getBio());
        candidate.setManifesto(dto.getManifesto());
        if (dto.getNominationStatus() != null) {
            candidate.setNominationStatus(dto.getNominationStatus());
        }

        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new IllegalArgumentException("Candidate not found with id: " + id);
        }
        candidateRepository.deleteById(id);
    }
}
