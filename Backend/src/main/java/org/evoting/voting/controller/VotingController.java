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

    /**
     * POST /api/votes/cast
     * Cast a vote. All business rule validation is done on the backend.
     * Returns:
     *   201 CREATED  — vote accepted and persisted
     *   400 BAD REQUEST — invalid input (missing fields, candidate/voter not found)
     *   403 FORBIDDEN   — voter not approved
     *   409 CONFLICT    — duplicate vote or election not open
     */
    @PostMapping("/cast")
    public ResponseEntity<?> castVote(@Valid @RequestBody CastVoteDto dto) {
        try {
            VoteReceiptDto receipt = votingService.castVote(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
        } catch (IllegalStateException e) {
            // Covers: duplicate vote, voter not approved, election not open, candidate invalid
            String msg = e.getMessage();
            if (msg != null && msg.contains("already cast a ballot")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", msg));
            }
            if (msg != null && msg.contains("not approved to vote")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", msg));
            }
            // Election not open, candidate not approved, candidate wrong election
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", msg));
        } catch (IllegalArgumentException e) {
            // Covers: voter/election/candidate not found
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred while processing your vote."));
        }
    }

    /**
     * GET /api/votes/check?electionId=X&voterId=Y
     * Check if a voter has already voted in an election.
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkVoterStatus(
            @RequestParam Long electionId,
            @RequestParam Long voterId) {
        boolean voted = votingService.hasVoted(electionId, voterId);
        return ResponseEntity.ok(Map.of("hasVoted", voted));
    }

    /**
     * GET /api/votes/election/{electionId}/count
     */
    @GetMapping("/election/{electionId}/count")
    public ResponseEntity<Map<String, Long>> getElectionVoteCount(@PathVariable Long electionId) {
        long count = votingService.getTotalVotesForElection(electionId);
        return ResponseEntity.ok(Map.of("totalVotes", count));
    }

    /**
     * GET /api/votes/election/{electionId}/candidate/{candidateId}/count
     */
    @GetMapping("/election/{electionId}/candidate/{candidateId}/count")
    public ResponseEntity<Map<String, Long>> getCandidateVoteCount(
            @PathVariable Long electionId,
            @PathVariable Long candidateId) {
        long count = votingService.getVotesForCandidate(electionId, candidateId);
        return ResponseEntity.ok(Map.of("candidateVotes", count));
    }

    /**
     * GET /api/votes/election/{electionId}/tallies
     * Returns per-candidate vote tallies for result computation.
     */
    @GetMapping("/election/{electionId}/tallies")
    public ResponseEntity<List<CandidateTallyDto>> getElectionTallies(@PathVariable Long electionId) {
        return ResponseEntity.ok(votingService.getElectionTallies(electionId));
    }
}
