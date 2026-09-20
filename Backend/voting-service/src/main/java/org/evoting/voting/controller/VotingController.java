package org.evoting.voting.controller;

import jakarta.validation.Valid;
import org.evoting.voting.dto.CandidateTallyDto;
import org.evoting.voting.dto.CastVoteDto;
import org.evoting.voting.dto.VoteReceiptDto;
import org.evoting.voting.service.VotingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "*")
public class VotingController {

    private final VotingService votingService;

    public VotingController(VotingService votingService) {
        this.votingService = votingService;
    }

    @PostMapping("/cast")
    public ResponseEntity<?> castVote(@Valid @RequestBody CastVoteDto dto) {
        try {
            VoteReceiptDto receipt = votingService.castVote(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkVoterStatus(
            @RequestParam Long electionId,
            @RequestParam Long voterId) {
        boolean voted = votingService.hasVoted(electionId, voterId);
        return ResponseEntity.ok(Map.of("hasVoted", voted));
    }

    @GetMapping("/election/{electionId}/count")
    public ResponseEntity<Map<String, Long>> getElectionVoteCount(@PathVariable Long electionId) {
        long count = votingService.getTotalVotesForElection(electionId);
        return ResponseEntity.ok(Map.of("totalVotes", count));
    }

    @GetMapping("/election/{electionId}/candidate/{candidateId}/count")
    public ResponseEntity<Map<String, Long>> getCandidateVoteCount(
            @PathVariable Long electionId,
            @PathVariable Long candidateId) {
        long count = votingService.getVotesForCandidate(electionId, candidateId);
        return ResponseEntity.ok(Map.of("candidateVotes", count));
    }

    @GetMapping("/election/{electionId}/tallies")
    public ResponseEntity<List<CandidateTallyDto>> getElectionTallies(@PathVariable Long electionId) {
        return ResponseEntity.ok(votingService.getElectionTallies(electionId));
    }
}
