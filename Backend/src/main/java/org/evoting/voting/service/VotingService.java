package org.evoting.voting.service;

import org.evoting.candidate.entity.Candidate;
import org.evoting.candidate.repository.CandidateRepository;
import org.evoting.election.entity.Election;
import org.evoting.election.repository.ElectionRepository;
import org.evoting.voter.entity.Voter;
import org.evoting.voter.repository.VoterRepository;
import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.dto.CastVoteDto;
import org.evoting.voting.dto.VoteReceiptDto;
import org.evoting.voting.entity.Vote;
import org.evoting.voting.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VotingService {

    private final VoteRepository voteRepository;
    private final VoterRepository voterRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;

    public VotingService(
            VoteRepository voteRepository,
            VoterRepository voterRepository,
            ElectionRepository electionRepository,
            CandidateRepository candidateRepository) {
        this.voteRepository = voteRepository;
        this.voterRepository = voterRepository;
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
    }

    /**
     * Cast a vote. Validates all SRS business rules before persisting atomically.
     *
     * Rules enforced here (backend is the authoritative boundary):
     * 1. Voter must exist and be approved (isVerified = true).
     * 2. Election must exist and be in an active/open voting state.
     * 3. Voter must not have already voted in this election.
     * 4. Candidate must exist, be APPROVED, and belong to this election.
     * 5. Vote is persisted atomically in a single transaction.
     */
    @Transactional
    public VoteReceiptDto castVote(CastVoteDto dto) {

        // Rule 1 — Voter must be approved
        Voter voter = voterRepository.findById(dto.getVoterId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Voter not found with id: " + dto.getVoterId()));
        if (!voter.isVerified()) {
            throw new IllegalStateException(
                    "Voter " + dto.getVoterId() + " is not approved to vote. "
                    + "Contact the election officer for approval.");
        }

        // Rule 2 — Election must be active/open
        Election election = electionRepository.findById(dto.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Election not found with id: " + dto.getElectionId()));
        if (!election.getStatus().isVotingOpen()) {
            throw new IllegalStateException(
                    "Election '" + election.getTitle() + "' is not currently open for voting. "
                    + "Current status: " + election.getStatus());
        }

        // Rule 3 — Duplicate vote prevention (application layer; DB constraint also enforces this)
        if (voteRepository.existsByElectionIdAndVoterId(dto.getElectionId(), dto.getVoterId())) {
            throw new IllegalStateException(
                    "Voter " + dto.getVoterId() + " has already cast a ballot in election "
                    + dto.getElectionId() + ". Duplicate voting is not permitted.");
        }

        // Rule 4 — Candidate must be APPROVED and belong to this election
        Candidate candidate = candidateRepository.findById(dto.getCandidateId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Candidate not found with id: " + dto.getCandidateId()));
        if (!"APPROVED".equalsIgnoreCase(candidate.getNominationStatus())) {
            throw new IllegalStateException(
                    "Candidate " + dto.getCandidateId() + " is not an approved candidate. "
                    + "Status: " + candidate.getNominationStatus());
        }
        if (!candidate.getElectionId().equals(dto.getElectionId())) {
            throw new IllegalStateException(
                    "Candidate " + dto.getCandidateId() + " does not belong to election "
                    + dto.getElectionId() + ". Vote rejected.");
        }

        // Rule 5 — Persist atomically
        LocalDateTime now = LocalDateTime.now();
        String hash = generateVoteHash(dto.getVoterId(), dto.getElectionId(), dto.getCandidateId(), now);

        Vote vote = new Vote();
        vote.setElectionId(dto.getElectionId());
        vote.setVoterId(dto.getVoterId());
        vote.setCandidateId(dto.getCandidateId());
        vote.setConstituency(dto.getConstituency());
        vote.setTimestamp(now);
        vote.setVoteHash(hash);

        Vote savedVote = voteRepository.save(vote);

        // Update voter's hasVoted flag within the same transaction
        voter.setHasVoted(true);
        voterRepository.save(voter);

        return new VoteReceiptDto(
                savedVote.getId(),
                savedVote.getElectionId(),
                savedVote.getVoterId(),
                savedVote.getCandidateId(),
                savedVote.getConstituency(),
                savedVote.getTimestamp(),
                savedVote.getVoteHash(),
                "Vote successfully recorded and sealed."
        );
    }

    public boolean hasVoted(Long electionId, Long voterId) {
        return voteRepository.existsByElectionIdAndVoterId(electionId, voterId);
    }

    public long getTotalVotesForElection(Long electionId) {
        return voteRepository.countByElectionId(electionId);
    }

    public long getVotesForCandidate(Long electionId, Long candidateId) {
        return voteRepository.countByElectionIdAndCandidateId(electionId, candidateId);
    }

    public List<CandidateTallyDto> getElectionTallies(Long electionId) {
        return voteRepository.countVotesByElectionGroupedByCandidate(electionId);
    }

    private String generateVoteHash(Long voterId, Long electionId, Long candidateId, LocalDateTime timestamp) {
        try {
            String rawData = voterId + ":" + electionId + ":" + candidateId + ":" + timestamp + ":" + UUID.randomUUID();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
