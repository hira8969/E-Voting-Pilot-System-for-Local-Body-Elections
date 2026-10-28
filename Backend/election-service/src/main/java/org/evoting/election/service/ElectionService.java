package org.evoting.election.service;

import org.evoting.election.dto.ElectionDto;
import org.evoting.election.entity.Election;
import org.evoting.election.entity.ElectionStatus;
import org.evoting.election.exception.InvalidElectionStateException;
import org.evoting.election.repository.ElectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;

    public ElectionService(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }

    @Transactional
    public Election createElection(ElectionDto dto) {
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("Election end date cannot be earlier than start date.");
        }

        Election election = Election.builder()
                .title(dto.getTitle().trim())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? dto.getStatus() : ElectionStatus.DRAFT)
                .electionType(dto.getElectionType().trim())
                .constituency(dto.getConstituency())
                .ward(dto.getWard())
                .build();

        return electionRepository.save(election);
    }

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Optional<Election> getElectionById(Long id) {
        return electionRepository.findById(id);
    }

    public List<Election> getElectionsByStatus(ElectionStatus status) {
        return electionRepository.findByStatus(status);
    }

    @Transactional
    public Election updateElectionStatus(Long id, ElectionStatus targetStatus) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + id));

        ElectionStatus currentStatus = election.getStatus();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new InvalidElectionStateException(
                    String.format("Invalid state transition: Cannot transition election %d from %s to %s.",
                            id, currentStatus, targetStatus)
            );
        }

        election.setStatus(targetStatus);
        return electionRepository.save(election);
    }

    @Transactional
    public Election updateElection(Long id, ElectionDto dto) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found with id: " + id));

        if (election.getStatus() == ElectionStatus.ACTIVE || election.getStatus() == ElectionStatus.COMPLETED || election.getStatus() == ElectionStatus.PUBLISHED) {
            throw new InvalidElectionStateException("Cannot modify details of an election that is ACTIVE, COMPLETED, or PUBLISHED.");
        }

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("Election end date cannot be earlier than start date.");
        }

        election.setTitle(dto.getTitle().trim());
        election.setDescription(dto.getDescription());
        election.setStartDate(dto.getStartDate());
        election.setEndDate(dto.getEndDate());
        election.setElectionType(dto.getElectionType().trim());
        if (dto.getConstituency() != null) election.setConstituency(dto.getConstituency());
        if (dto.getWard() != null) election.setWard(dto.getWard());

        return electionRepository.save(election);
    }

    public boolean isElectionOpenForVoting(Long id) {
        return electionRepository.findById(id)
                .map(e -> {
                    LocalDateTime now = LocalDateTime.now();
                    return e.getStatus() == ElectionStatus.ACTIVE &&
                            now.isAfter(e.getStartDate()) &&
                            now.isBefore(e.getEndDate());
                })
                .orElse(false);
    }
}
