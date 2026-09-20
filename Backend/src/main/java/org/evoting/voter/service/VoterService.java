package org.evoting.voter.service;

import org.evoting.voter.dto.VoterRegistrationDto;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.repository.VoterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoterService {

    private final VoterRepository voterRepository;

    public VoterService(VoterRepository voterRepository) {
        this.voterRepository = voterRepository;
    }

    public Voter registerVoter(VoterRegistrationDto dto) {
        if (voterRepository.existsByEpicNumber(dto.getEpicNumber())) {
            throw new IllegalArgumentException("Voter with EPIC number " + dto.getEpicNumber() + " already exists.");
        }
        if (voterRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Voter with email " + dto.getEmail() + " already exists.");
        }

        Voter voter = new Voter();
        voter.setEpicNumber(dto.getEpicNumber().toUpperCase().trim());
        voter.setFullName(dto.getFullName().trim());
        voter.setEmail(dto.getEmail().toLowerCase().trim());
        voter.setPhone(dto.getPhone().trim());
        voter.setConstituency(dto.getConstituency().trim());
        voter.setVerified(false);
        voter.setHasVoted(false);

        return voterRepository.save(voter);
    }

    public List<Voter> getAllVoters() {
        return voterRepository.findAll();
    }

    public Optional<Voter> getVoterById(Long id) {
        return voterRepository.findById(id);
    }

    public Optional<Voter> getVoterByEpic(String epicNumber) {
        return voterRepository.findByEpicNumber(epicNumber.toUpperCase().trim());
    }

    public Voter verifyVoter(Long id) {
        Voter voter = voterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + id));
        voter.setVerified(true);
        return voterRepository.save(voter);
    }

    public Voter updateVotingStatus(Long id, boolean hasVoted) {
        Voter voter = voterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + id));
        voter.setHasVoted(hasVoted);
        return voterRepository.save(voter);
    }
}
