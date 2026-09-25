package org.evoting.voter.service;

import org.evoting.voter.dto.VoterEligibilityDto;
import org.evoting.voter.dto.VoterRegistrationDto;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.repository.VoterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VoterService {

    private final VoterRepository voterRepository;

    public VoterService(VoterRepository voterRepository) {
        this.voterRepository = voterRepository;
    }

    @Transactional
    public Voter registerVoter(VoterRegistrationDto dto) {
        String cleanEpic = dto.getEpicNumber().toUpperCase().trim();
        String cleanEmail = dto.getEmail().toLowerCase().trim();

        if (voterRepository.existsByEpicNumber(cleanEpic)) {
            throw new IllegalArgumentException("Voter with EPIC number " + cleanEpic + " already exists.");
        }
        if (voterRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Voter with email " + cleanEmail + " already exists.");
        }
        if (dto.getUserId() != null && voterRepository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("A voter profile is already linked to user ID " + dto.getUserId());
        }

        Voter voter = Voter.builder()
                .userId(dto.getUserId())
                .epicNumber(cleanEpic)
                .fullName(dto.getFullName().trim())
                .email(cleanEmail)
                .phone(dto.getPhone().trim())
                .constituency(dto.getConstituency().trim())
                .isVerified(false)
                .hasVoted(false)
                .build();

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

    public Optional<Voter> getVoterByUserId(Long userId) {
        return voterRepository.findByUserId(userId);
    }

    @Transactional
    public Voter verifyVoter(Long id) {
        Voter voter = voterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + id));
        voter.setVerified(true);
        return voterRepository.save(voter);
    }

    @Transactional
    public Voter updateVotingStatus(Long id, boolean hasVoted) {
        Voter voter = voterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + id));
        voter.setHasVoted(hasVoted);
        return voterRepository.save(voter);
    }

    public VoterEligibilityDto checkEligibility(Long id) {
        Voter voter = voterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voter not found with id: " + id));

        boolean eligible = voter.isVerified() && !voter.isHasVoted();
        String message = !voter.isVerified()
                ? "Voter is not verified by election administrator."
                : (voter.isHasVoted() ? "Voter has already cast their ballot." : "Voter is verified and eligible to vote.");

        return VoterEligibilityDto.builder()
                .voterId(voter.getId())
                .userId(voter.getUserId())
                .epicNumber(voter.getEpicNumber())
                .fullName(voter.getFullName())
                .constituency(voter.getConstituency())
                .verified(voter.isVerified())
                .hasVoted(voter.isHasVoted())
                .eligible(eligible)
                .message(message)
                .build();
    }
}
