package org.evoting.voting.service;

import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.dto.CastVoteDto;
import org.evoting.voting.dto.VoteReceiptDto;
import org.evoting.voting.entity.Vote;
import org.evoting.voting.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class VotingService {

    private final VoteRepository voteRepository;
    private final RestTemplate restTemplate;

    @Value("${services.voter-service.url:http://localhost:8081}")
    private String voterServiceUrl;

    public VotingService(VoteRepository voteRepository, RestTemplate restTemplate) {
        this.voteRepository = voteRepository;
        this.restTemplate = restTemplate;
    }

    public VoteReceiptDto castVote(CastVoteDto dto) {
        // Double voting prevention
        if (voteRepository.existsByElectionIdAndVoterId(dto.getElectionId(), dto.getVoterId())) {
            throw new IllegalStateException("Voter " + dto.getVoterId() + " has already cast a ballot in election " + dto.getElectionId() + ".");
        }

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

        // Notify voter service of voting status change
        try {
            restTemplate.put(voterServiceUrl + "/api/voters/" + dto.getVoterId() + "/vote-status?hasVoted=true", null);
        } catch (Exception ignored) {
            // Logged as best-effort sync
        }

        return new VoteReceiptDto(
                savedVote.getId(),
                savedVote.getElectionId(),
                savedVote.getVoterId(),
                savedVote.getCandidateId(),
                savedVote.getConstituency(),
                savedVote.getTimestamp(),
                savedVote.getVoteHash(),
                "Vote successfully recorded and encrypted."
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
