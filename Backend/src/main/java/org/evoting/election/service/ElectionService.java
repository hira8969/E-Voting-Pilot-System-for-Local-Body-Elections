package org.evoting.election.service;

import org.evoting.election.dto.ElectionDto;
import org.evoting.election.entity.Election;
import org.evoting.election.entity.ElectionStatus;
import org.evoting.election.repository.ElectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;

    public ElectionService(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }

    public Election createElection(ElectionDto dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        Election election = new Election();
        election.setTitle(dto.getTitle().trim());
        election.setDescription(dto.getDescription());
        election.setStartDate(dto.getStartDate());
        election.setEndDate(dto.getEndDate());
        election.setStatus(dto.getStatus() != null ? dto.getStatus() : ElectionStatus.UPCOMING);
        election.setElectionType(dto.getElectionType().trim());

        return electionRepository.save(election);
    }

    public List<Election> getAllElections() {
        return electionRepository.findAllByOrderByStartDateDesc();
    }

    public Optional<Election> getElectionById(Long id) {
        return electionRepository.findById(id);
    }

    public List<Election> getElectionsByStatus(ElectionStatus status) {
        return electionRepository.findByStatus(status);
    }

    public Election updateElectionStatus(Long id, ElectionStatus status) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + id));
        election.setStatus(status);
        return electionRepository.save(election);
    }

    public Election updateElection(Long id, ElectionDto dto) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + id));

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        election.setTitle(dto.getTitle().trim());
        election.setDescription(dto.getDescription());
        election.setStartDate(dto.getStartDate());
        election.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) {
            election.setStatus(dto.getStatus());
        }
        election.setElectionType(dto.getElectionType().trim());

        return electionRepository.save(election);
    }
}
